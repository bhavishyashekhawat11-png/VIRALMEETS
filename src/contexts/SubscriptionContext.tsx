import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, updateDoc, increment, serverTimestamp } from 'firebase/firestore';

interface SubscriptionContextType {
  isPro: boolean;
  userPlan: 'FREE' | 'PRO';
  loading: boolean;
  upgrade: (planType?: 'monthly' | 'yearly') => void;
  handlePayment: (planType: 'monthly' | 'yearly') => Promise<void>;
  showUpgradeModal: boolean;
  setShowUpgradeModal: (show: boolean) => void;
  usageCount: number;
  incrementUsage: () => void;
  updateAnalysisCount: (userId: string) => Promise<void>;
  checkLimit: () => Promise<boolean>;
  paymentError: string | null;
  paymentLoading: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [userPlan, setUserPlan] = useState<'FREE' | 'PRO'>(() => {
    const saved = localStorage.getItem('viralmeets_plan');
    return (saved as 'FREE' | 'PRO') || 'FREE';
  });
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [analysisCount, setAnalysisCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const getTodayIST = () => {
    // Returns YYYY-MM-DD in IST
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(new Date());
  };

  const syncStateFromData = (data: any) => {
    const currentPlan = data.userPlan || 'FREE';
    setUserPlan(currentPlan as 'FREE' | 'PRO');
    localStorage.setItem('viralmeets_plan', currentPlan);

    const lastResetDateStr = data.lastResetDate || "";
    const today = getTodayIST();
    
    if (lastResetDateStr === today) {
      setAnalysisCount(data.analysisCount || 0);
    } else {
      setAnalysisCount(0);
    }

    if (currentPlan === 'PRO') {
      setPaymentLoading(false);
      setShowUpgradeModal(false);
    }
  };

  useEffect(() => {
    let snapshotUnsubscribe: (() => void) | null = null;

    const authUnsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        snapshotUnsubscribe = onSnapshot(doc(db, 'users', user.uid), (userDoc) => {
          if (userDoc.exists()) {
            syncStateFromData(userDoc.data());
          } else {
            // Handle edge case: User document missing
            setUserPlan('FREE');
            setAnalysisCount(0);
          }
          setLoading(false);
        }, (error) => {
          console.error("Firestore snapshot error:", error);
          setLoading(false);
        });
      } else {
        if (snapshotUnsubscribe) snapshotUnsubscribe();
        setUserPlan('FREE');
        setAnalysisCount(0);
        setLoading(false);
      }
    });

    return () => {
      authUnsubscribe();
      if (snapshotUnsubscribe) snapshotUnsubscribe();
    };
  }, []);

  const refreshUsage = async () => {
    if (!auth.currentUser) return;
    setIsRefreshing(true);
    try {
      const { getDoc, doc } = await import('firebase/firestore');
      const userRef = doc(db, 'users', auth.currentUser.uid);
      // Force fetch from server to get freshest data
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        syncStateFromData(userDoc.data());
        return userDoc.data();
      }
    } catch (e) {
      console.error("Error refreshing usage:", e);
    } finally {
      setIsRefreshing(false);
    }
    return null;
  };

  const isPro = userPlan === 'PRO';

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
    return handlePayment(planType);
  };

  const incrementUsage = async () => {
    if (!auth.currentUser) return;
    try {
      await updateAnalysisCount(auth.currentUser.uid);
    } catch (e) {
      console.error("Error incrementing usage:", e);
    }
  };

  const updateAnalysisCount = async (userId: string) => {
    try {
      console.log("Updating count for user:", userId);
      const userRef = doc(db, "users", userId);
      
      // We also handle the daily reset here if we want it to be robust
      // but the user's requested logic was simple increment.
      // However, to keep the "Daily" aspect, we should check the reset date.
      // Since checkLimit already fetches fresh data, we can just increment here.
      
      await updateDoc(userRef, {
        analysisCount: increment(1),
        updatedAt: serverTimestamp()
      });

      console.log("analysisCount updated successfully");
      
      // Update local state instantly as requested
      setAnalysisCount(prev => prev + 1);
      
      // Optional: Force a refresh to stay synced with other possible server changes
      // refreshUsage(); 
    } catch (error) {
      console.error("Error updating analysisCount:", error);
    }
  };

  const checkLimit = async () => {
    if (!auth.currentUser) return false;
    
    const { getDoc, doc, updateDoc } = await import('firebase/firestore');
    const userRef = doc(db, 'users', auth.currentUser.uid);
    
    // 1. Fetch fresh data first (requested for reliability)
    setIsRefreshing(true);
    let currentData: any = null;
    try {
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        currentData = userDoc.data();
      }
    } catch (e) {
      console.error("Error fetching fresh data in checkLimit:", e);
    } finally {
      setIsRefreshing(false);
    }

    if (!currentData) return false;

    // 2. IST Daily Reset Logic
    const today = getTodayIST();
    let currentCount = currentData.analysisCount || 0;
    const currentPlan = currentData.userPlan || 'FREE';

    if (currentData.lastResetDate !== today) {
      try {
        await updateDoc(userRef, {
          analysisCount: 0,
          lastResetDate: today
        });
        currentCount = 0;
        console.log("Daily limit reset for IST:", today);
      } catch (e) {
        console.error("Error resetting daily limit:", e);
      }
    }

    // Update local state to match
    setUserPlan(currentPlan);
    setAnalysisCount(currentCount);

    if (currentPlan === 'PRO') return true;

    // 3. Final limit logic (3 analyses for FREE)
    if (currentCount >= 3) {
      setShowUpgradeModal(true);
      return false;
    }

    return true;
  };

  const handlePayment = async (planType: 'monthly' | 'yearly') => {
    if (!auth.currentUser) {
      setPaymentError("Please sign in to upgrade.");
      return;
    }

    setPaymentLoading(true);
    setPaymentError(null);

    try {
      const scriptLoaded = await loadRazorpay();
      if (!scriptLoaded) throw new Error("Razorpay SDK failed to load");

      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planType })
      });

      const contentType = response.headers.get("content-type");
      let order: any;
      
      if (contentType && contentType.includes("application/json")) {
        order = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}`);
      }

      if (!response.ok) throw new Error(order.error || `Order API failed with status ${response.status}`);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "ViralMeets",
        description: `${planType === 'monthly' ? 'Monthly' : 'Yearly'} Pro Plan`,
        order_id: order.id,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...response,
                userId: auth.currentUser?.uid,
                planType
              })
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok) {
              setUserPlan('PRO');
              setShowUpgradeModal(false);
            } else {
              throw new Error(verifyData.error || "Payment verification failed");
            }
          } catch (err: any) {
            setPaymentError(err.message);
          } finally {
            setPaymentLoading(false);
          }
        },
        prefill: {
          email: auth.currentUser.email || "",
          name: auth.currentUser.displayName || ""
        },
        theme: {
          color: "#e11d48",
        },
        modal: {
          ondismiss: () => setPaymentLoading(false)
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error("Payment Error:", error);
      setPaymentError(error.message || "Something went wrong during payment initialization");
      setPaymentLoading(false);
    }
  };

  return (
    <SubscriptionContext.Provider value={{ 
      isPro, 
      userPlan, 
      loading, 
      upgrade, 
      handlePayment,
      showUpgradeModal, 
      setShowUpgradeModal,
      usageCount: analysisCount,
      incrementUsage,
      updateAnalysisCount,
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
