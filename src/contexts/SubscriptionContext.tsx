import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

interface SubscriptionContextType {
  isPro: boolean;
  plan: 'FREE' | 'PRO';
  loading: boolean;
  upgrade: (planType?: 'monthly' | 'yearly') => void;
  showUpgradeModal: boolean;
  setShowUpgradeModal: (show: boolean) => void;
  usageCount: number;
  incrementUsage: () => void;
  checkLimit: () => boolean;
  paymentError: string | null;
  paymentLoading: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [plan, setPlan] = useState<'FREE' | 'PRO'>(() => {
    const saved = localStorage.getItem('viralmeets_plan');
    return (saved as 'FREE' | 'PRO') || 'FREE';
  });
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [analysisCount, setAnalysisCount] = useState(() => {
    const saved = localStorage.getItem('viralmeets_analysis_count');
    const lastReset = localStorage.getItem('viralmeets_last_reset_date');
    const today = new Date().toDateString();
    
    if (lastReset !== today) {
      localStorage.setItem('viralmeets_last_reset_date', today);
      localStorage.setItem('viralmeets_analysis_count', '0');
      return 0;
    }
    return parseInt(saved || '0', 10);
  });
   const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            const userPlan = data.userPlan || data.plan || 'FREE';
            setPlan(userPlan as 'FREE' | 'PRO');
            localStorage.setItem('viralmeets_plan', userPlan);
          }
        } catch (e) {
          console.error("Error fetching user plan:", e);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const isPro = plan === 'PRO';

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const upgrade = async (planType: 'monthly' | 'yearly' = 'monthly') => {
    console.log("Payment triggered", { planType, user: auth.currentUser?.email });
    
    if (!auth.currentUser) {
      setPaymentError("Please sign in to upgrade.");
      return;
    }
    
    setPaymentLoading(true);
    setPaymentError(null);

    const scriptLoaded = await loadRazorpay();
    if (!scriptLoaded) {
      console.error("Razorpay script failed to load");
      setPaymentError("Could not load payment gateway. Please check your connection.");
      setPaymentLoading(false);
      return;
    }

    if (!window.Razorpay) {
      console.error("window.Razorpay not found after script load");
      setPaymentError("Payment system is currently unavailable. Please try again later.");
      setPaymentLoading(false);
      return;
    }

    const amount = planType === 'yearly' ? 199900 : 29900;
    const planName = planType === 'yearly' ? 'Yearly Pro Plan' : 'Monthly Pro Plan';

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: amount,
      currency: "INR",
      name: "ViralMeets",
      description: `Upgrade to ${planName}`,
      image: "https://picsum.photos/seed/viral/200/200",
      handler: async function (response: any) {
        console.log("Payment Success", response);
        try {
          const userRef = doc(db, 'users', auth.currentUser!.uid);
          await updateDoc(userRef, {
            plan: "PRO",
            userPlan: "PRO",
            planType: planType,
            paymentStatus: "success",
            paymentId: response.razorpay_payment_id,
            updatedAt: serverTimestamp()
          });
          
          setPlan('PRO');
          localStorage.setItem('viralmeets_plan', 'PRO');
          setShowUpgradeModal(false);
        } catch (e) {
          console.error("Error updating subscription in Firestore:", e);
          setPaymentError("Payment successful, but failed to update profile. Please contact support with payment ID: " + response.razorpay_payment_id);
        } finally {
          setPaymentLoading(false);
        }
      },
      prefill: {
        email: auth.currentUser.email || '',
        name: auth.currentUser.displayName || ''
      },
      theme: {
        color: "#e11d48", // rose-600
      },
      modal: {
        ondismiss: function() {
          console.log("Payment modal dismissed");
          setPaymentLoading(false);
        }
      }
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        console.error("Payment Failed", response.error);
        setPaymentError(response.error.description || 'Payment failed. Please try again.');
        setPaymentLoading(false);
      });
      rzp.open();
    } catch (e) {
      console.error("Error opening Razorpay instance:", e);
      setPaymentError("Could not initiate payment. Please try again.");
      setPaymentLoading(false);
    }
  };

  const incrementUsage = () => {
    const newCount = analysisCount + 1;
    setAnalysisCount(newCount);
    localStorage.setItem('viralmeets_analysis_count', newCount.toString());
  };

  const checkLimit = () => {
    if (isPro) return true;
    if (analysisCount >= 3) {
      setShowUpgradeModal(true);
      return false;
    }
    return true;
  };

  return (
    <SubscriptionContext.Provider value={{ 
      isPro, 
      plan, 
      loading, 
      upgrade, 
      showUpgradeModal, 
      setShowUpgradeModal,
      usageCount: analysisCount,
      incrementUsage,
      checkLimit,
      paymentError,
      paymentLoading
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
