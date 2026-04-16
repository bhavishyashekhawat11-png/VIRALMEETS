import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

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
  const [loading, setLoading] = useState(false);

  const isPro = plan === 'PRO';

  const upgrade = () => {
    setPlan('PRO');
    localStorage.setItem('viralmeets_plan', 'PRO');
    setShowUpgradeModal(false);
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
      checkLimit
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
