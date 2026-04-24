import React, { memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Rocket, Check, Lock, X, Sparkles, Zap, BarChart3, Wand2, AlertCircle, Loader2, ShieldCheck, ArrowRight } from 'lucide-react';
import { useSubscription } from '../contexts/SubscriptionContext';
import { cn } from '../lib/utils';

export const UpgradeModal = memo(({ onManageSubscription }: { onManageSubscription?: () => void }) => {
  const { showUpgradeModal, setShowUpgradeModal, upgrade, paymentLoading, paymentError } = useSubscription();

  if (!showUpgradeModal) return null;

  const benefits = [
    { icon: Zap, text: "Full hook library (no limits)", color: "text-rose-500" },
    { icon: Sparkles, text: "Unlimited daily analyses", color: "text-emerald-500" },
    { icon: Wand2, text: "AI script & rewrite access", color: "text-amber-500" },
    { icon: BarChart3, text: "Advanced audience insights", color: "text-blue-500" }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 transform-gpu">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowUpgradeModal(false)}
          className="absolute inset-0 bg-black/80 backdrop-blur-md transform-gpu"
        />
        
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-[2.5rem] shadow-2xl transform-gpu overflow-hidden"
        >
          {/* Top Decorative Background */}
          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-rose-600/10 to-transparent pointer-events-none" />
          
          <div className="p-8 relative z-10">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20">
                <Sparkles className="w-8 h-8 text-rose-500 animate-pulse" />
              </div>
            </div>

            <div className="text-center space-y-3 mb-8">
              <h2 className="text-3xl font-black text-white leading-tight tracking-tight">
                You’re 2 insights away <br /> from a viral video
              </h2>
              <p className="text-sm text-zinc-400 font-medium px-4 leading-relaxed">
                Your video is losing viewers early. Unlock the <span className="text-rose-400 font-bold">full breakdown</span> to fix it and dominate the algorithm.
              </p>
            </div>

            {/* Plans Comparison */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {/* Free Plan */}
              <div className="p-5 rounded-[2rem] bg-zinc-950 border border-zinc-800 flex flex-col h-full opacity-60">
                <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3">Free</div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-zinc-500" />
                    <span className="text-[10px] font-bold text-zinc-400">3 Analyses/day</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-zinc-500" />
                    <span className="text-[10px] font-bold text-zinc-400">Basic insights</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-zinc-500" />
                    <span className="text-[10px] font-bold text-zinc-400">Standard speed</span>
                  </div>
                </div>
                <div className="mt-auto">
                  <span className="text-lg font-black text-zinc-400 line-through opacity-30">Active</span>
                </div>
              </div>

              {/* Pro Plan */}
              <div className="p-5 rounded-[2rem] bg-zinc-900 border-2 border-rose-600 flex flex-col h-full relative scale-105 shadow-[0_0_30px_rgba(225,29,72,0.15)] overflow-hidden">
                <div className="absolute top-2 right-2">
                  <span className="bg-rose-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Popular</span>
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-rose-500 mb-3">Pro 💎</div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-rose-500" />
                    <span className="text-[10px] font-bold text-zinc-200">Unlimited analyses</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-rose-500" />
                    <span className="text-[10px] font-bold text-zinc-200">Retention graph</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-rose-500" />
                    <span className="text-[10px] font-bold text-zinc-200">Creator DNA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-rose-500" />
                    <span className="text-[10px] font-bold text-zinc-200">Full Strategy</span>
                  </div>
                </div>
                <div className="mt-auto pt-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-black text-white">₹1999</span>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">/Year</span>
                  </div>
                  <div className="text-[9px] font-black text-emerald-400 uppercase tracking-widest leading-none">
                    Save ~45%
                  </div>
                </div>
              </div>
            </div>

            {/* Locked Content Peeking (Blurred) */}
            <div className="mb-8 p-4 bg-zinc-950 rounded-2xl border border-zinc-800/50 flex flex-col gap-3 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent z-10" />
              <div className="flex items-center justify-between blur-[2px] opacity-30 select-none">
                <div className="flex items-center gap-2">
                   <BarChart3 className="w-4 h-4 text-zinc-500" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Retention Data</span>
                </div>
                <Lock className="w-3 h-3 text-rose-500" />
              </div>
              <div className="h-4 bg-zinc-900 rounded-full w-full blur-[3px] opacity-20" />
              <div className="h-4 bg-zinc-900 rounded-full w-2/3 blur-[3px] opacity-20" />
              
              <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full flex items-center gap-2 shadow-2xl">
                   <Lock className="w-3 h-3 text-rose-500" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">Premium Insights Locked</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {paymentError && (
                <div className="flex items-center gap-2 text-rose-500 text-[10px] font-black uppercase tracking-widest bg-rose-500/10 p-4 rounded-2xl border border-rose-500/20 mb-4">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{paymentError}</span>
                </div>
              )}

              <button
                onClick={() => upgrade('yearly')}
                disabled={paymentLoading}
                className="w-full bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-black py-5 rounded-[2rem] shadow-[0_20px_50px_rgba(225,29,72,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-3 group text-lg"
              >
                {paymentLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin text-white" />
                    <span className="uppercase tracking-widest">Processing...</span>
                  </>
                ) : (
                  <>
                    Unlock Full Analysis <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {/* Monthly option link */}
              <button 
                onClick={() => upgrade('monthly')} 
                className="w-full text-[10px] font-black text-zinc-500 hover:text-zinc-300 uppercase tracking-[0.2em] transition-all"
              >
                Or ₹299/month (Cancel anytime)
              </button>
            </div>

            <div className="mt-8 flex items-center justify-center gap-6 opacity-40">
               <div className="flex items-center gap-1">
                 <ShieldCheck className="w-3 h-3 text-zinc-400" />
                 <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Cancel Anytime</span>
               </div>
               <div className="flex items-center gap-1">
                 <Lock className="w-3 h-3 text-zinc-400" />
                 <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">No Hidden Charges</span>
               </div>
            </div>
          </div>

          <button 
            onClick={() => setShowUpgradeModal(false)}
            className="absolute top-6 right-6 p-2 text-zinc-500 hover:text-white transition-colors outline-none z-50"
          >
            <X className="w-6 h-6" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
});

UpgradeModal.displayName = 'UpgradeModal';
