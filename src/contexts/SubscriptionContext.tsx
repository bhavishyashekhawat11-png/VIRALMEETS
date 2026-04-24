import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, updateDoc, increment, serverTimestamp } from 'firebase/firestore';

interface SubscriptionContextType {
  isPro: boolean;
  userPlan: 'FREE' | 'PRO';
  loading: boolean;
  upgrade: (planType?: 'monthly' | 'yearly') => void;
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

    const planName = planType === 'yearly' ? 'Yearly Pro Plan' : 'Monthly Pro Plan';

    try {
      // Step 1: Create subscription on our secure backend
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planType,
          userId: auth.currentUser.uid,
          userEmail: auth.currentUser.email
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to initiate subscription with server.");
      }

      const { subscriptionId } = data;
      console.log("Subscription ID created:", subscriptionId);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        subscription_id: subscriptionId,
        name: "ViralMeets",
        description: `Unlock ${planName}`,
        image: "https://picsum.photos/seed/viral/200/200",
        handler: async function (response: any) {
          console.log("Subscription Success", response);
          console.log("Waiting for webhook to update status...");
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
            console.log("Subscription modal dismissed");
            setPaymentLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp: any) {
        console.error("Subscription Payment Failed", resp.error);
        setPaymentError(resp.error.description || 'Payment failed. Please try again.');
        setPaymentLoading(false);
      });
      rzp.open();
    } catch (e: any) {
      console.error("Error in subscription flow:", e);
      setPaymentError(e.message || "Could not initiate subscription. Please try again.");
      setPaymentLoading(false);
    }
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

  return (
    <SubscriptionContext.Provider value={{ 
      isPro, 
      userPlan, 
      loading, 
      upgrade, 
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
