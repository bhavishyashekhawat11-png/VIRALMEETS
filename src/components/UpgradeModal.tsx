import React, { memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Rocket, Check, Lock, X, Sparkles, Zap, BarChart3, Wand2, AlertCircle, Loader2 } from 'lucide-react';
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
          className="relative w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl transform-gpu will-change-[transform,opacity]"
        >
          {/* Top Banner */}
          <div className="h-32 bg-gradient-to-br from-rose-600 to-rose-400 relative overflow-hidden flex items-center justify-center transform-gpu">
            <div className="absolute inset-0 opacity-20 transform-gpu">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
            </div>
            <Rocket className="w-16 h-16 text-white/20 absolute -right-4 -bottom-4 rotate-12 transform-gpu" />
            <div className="relative z-10 bg-white/20 backdrop-blur-md p-4 rounded-2xl border border-white/30 transform-gpu">
              <Sparkles className="w-8 h-8 text-white animate-pulse" />
            </div>
          </div>

          <div className="p-8 pt-6 transform-gpu">
            <div className="text-center space-y-2 mb-8 transform-gpu">
              <h2 className="text-2xl font-black text-zinc-100 leading-tight tracking-tight">
                Unlock Your Content's <br /> Full Potential 🚀
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                You're only seeing a limited version. Unlock powerful tools to create high-performing content.
              </p>
            </div>

            <div className="space-y-4 mb-8 transform-gpu">
              {benefits.map((benefit, i) => (
                <motion.div 
                  key={i}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="flex items-center gap-3 transform-gpu will-change-[transform,opacity]"
                >
                  <div className={cn("w-8 h-8 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center shrink-0", benefit.color)}>
                    <benefit.icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-zinc-300">{benefit.text}</span>
                </motion.div>
              ))}
            </div>

            <div className="space-y-4 transform-gpu">
              {paymentError && (
                <div className="flex items-center gap-2 text-rose-500 text-[10px] font-black uppercase tracking-widest bg-rose-500/10 p-4 rounded-2xl border border-rose-500/20 mb-4 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{paymentError}</span>
                </div>
              )}

              <button
                onClick={upgrade}
                disabled={paymentLoading}
                className="w-full bg-rose-600 hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl shadow-xl shadow-rose-900/40 transition-all active:scale-[0.98] relative group overflow-hidden outline-none transform-gpu"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] transform-gpu" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {paymentLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Upgrade to Pro 🚀'
                  )}
                </span>
              </button>
              
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="w-full text-zinc-500 hover:text-zinc-300 text-xs font-bold uppercase tracking-widest transition-colors outline-none"
              >
                Maybe later
              </button>

              {onManageSubscription && (
                <button
                  onClick={() => {
                    setShowUpgradeModal(false);
                    onManageSubscription();
                  }}
                  className="w-full text-rose-500/60 hover:text-rose-500 text-[10px] font-black uppercase tracking-[0.15em] transition-colors pt-2 outline-none"
                >
                  View all plans & comparison
                </button>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-800 text-center space-y-2 transform-gpu">
              <p className="text-[10px] font-black text-rose-400 uppercase tracking-[0.2em]">
                Start creating better content instantly
              </p>
              <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">
                Used by creators to improve content performance
              </p>
            </div>
          </div>

          <button 
            onClick={() => setShowUpgradeModal(false)}
            className="absolute top-4 right-4 w-8 h-8 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white/70 hover:text-white transition-all outline-none"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
});

UpgradeModal.displayName = 'UpgradeModal';
