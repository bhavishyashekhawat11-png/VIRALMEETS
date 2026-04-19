import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

interface SubscriptionContextType {
  isPro: boolean;
  plan: 'FREE' | 'PRO';
  loading: boolean;
  upgrade: () => void;
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

  const upgrade = async () => {
    if (!auth.currentUser) return;
    
    setPaymentLoading(true);
    setPaymentError(null);

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: 29900,
      currency: "INR",
      name: "ViralMeets",
      description: "Unlock Full Analysis",
      image: "https://picsum.photos/seed/viral/200/200",
      handler: async function (response: any) {
        try {
          const userRef = doc(db, 'users', auth.currentUser!.uid);
          await updateDoc(userRef, {
            plan: "PRO",
            userPlan: "PRO",
            paymentStatus: "success",
            paymentId: response.razorpay_payment_id,
            updatedAt: serverTimestamp()
          });
          
          setPlan('PRO');
          localStorage.setItem('viralmeets_plan', 'PRO');
          setShowUpgradeModal(false);
        } catch (e) {
          console.error("Error updating subscription:", e);
          setPaymentError("Payment successful, but failed to update profile. Please contact support.");
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
          setPaymentLoading(false);
        }
      }
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        setPaymentError(response.error.description || 'Payment failed. Please try again.');
        setPaymentLoading(false);
      });
      rzp.open();
    } catch (e) {
      console.error("Razorpay error:", e);
      setPaymentError("Could not load payment gateway. Please try again.");
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
