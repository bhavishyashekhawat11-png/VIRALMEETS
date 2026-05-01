import React, { useState, memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Rocket, Check, Lock, X, Sparkles, Zap, BarChart3, Wand2, 
  ChevronDown, ChevronUp, TrendingUp, Target, Activity, 
  ShieldCheck, CheckCircle2, CreditCard, Clock, ArrowRight, Loader2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useSubscription } from '../contexts/SubscriptionContext';

interface ComparisonRow {
  feature: string;
  explanation: string;
  free: string | boolean;
  pro: string | boolean;
  isCore?: boolean;
}

export const PricingPage: React.FC = memo(() => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { handlePayment, paymentLoading, refreshStatus } = useSubscription();

  const comparisonData: ComparisonRow[] = useMemo(() => [
    { 
      feature: "Daily Analysis Limit", 
      explanation: "Control how many ideas you can test daily", 
      free: "3 analyses/day", 
      pro: "Unlimited",
      isCore: true
    },
    { 
      feature: "Hooks & Variations", 
      explanation: "Access multiple high-performing content angles", 
      free: "Limited (1–2 only)", 
      pro: "Full access",
      isCore: true
    },
    { 
      feature: "Script Builder & Rewrite", 
      explanation: "Turn ideas into ready-to-use content instantly", 
      free: "Preview only", 
      pro: "Full generation",
      isCore: true
    },
    { 
      feature: "First 3 Seconds Analyzer", 
      explanation: "Deep analysis of your video's hook performance", 
      free: "Basic score", 
      pro: "Detailed breakdown",
      isCore: true
    },
    { 
      feature: "Scroll Simulation Graph", 
      explanation: "Predict where users will drop off in your video", 
      free: "Locked", 
      pro: "Full access",
      isCore: true
    },
    { 
      feature: "Viral Gap Detector", 
      explanation: "Identify exactly what's missing from your content", 
      free: "Locked", 
      pro: "Full access",
      isCore: true
    },
    // Expanded features
    { 
      feature: "Algorithm Trigger Check", 
      explanation: "Verify curiosity gaps and loop potential", 
      free: false, 
      pro: true 
    },
    { 
      feature: "Trend Timing Window", 
      explanation: "Optimal posting hours for maximum reach", 
      free: false, 
      pro: true 
    },
    { 
      feature: "Performance Forecast", 
      explanation: "Predict views and engagement rates", 
      free: false, 
      pro: true 
    },
    { 
      feature: "Content ROI Score", 
      explanation: "Effort vs. Expected Result analysis", 
      free: false, 
      pro: true 
    },
    { 
      feature: "Audience Type Detector", 
      explanation: "See exactly who will engage with your content", 
      free: false, 
      pro: true 
    },
    { 
      feature: "Replay Value Score", 
      explanation: "Rewatch potential and loopability triggers", 
      free: false, 
      pro: true 
    },
    { 
      feature: "Risk Check", 
      explanation: "Identify overused hooks or weak lighting", 
      free: false, 
      pro: true 
    },
    { 
      feature: "Virality Confidence Meter", 
      explanation: "AI confidence score for your content's success", 
      free: false, 
      pro: true 
    },
    { 
      feature: "Final Verdict & Action Steps", 
      explanation: "Clear instructions on how to fix your content", 
      free: false, 
      pro: true 
    },
    { 
      feature: "Priority AI Processing", 
      explanation: "Faster analysis results during peak times", 
      free: false, 
      pro: true 
    }
  ], []);

  const visibleRows = useMemo(() => isExpanded ? comparisonData : comparisonData.filter(row => row.isCore), [isExpanded, comparisonData]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-12 pb-32 pt-32 max-w-4xl mx-auto transform-gpu"
    >
      {/* Hero Section */}
      <div className="text-center space-y-6 pt-4 transform-gpu">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-black uppercase tracking-widest mb-2 transform-gpu"
        >
          <Sparkles className="w-4 h-4" />
          Master the Algorithm
        </motion.div>
        <h2 className="text-5xl md:text-7xl font-black text-zinc-100 leading-tight tracking-tighter transform-gpu">
          Unlock Viral <br /> Growth 🚀
        </h2>
        <p className="text-zinc-400 text-lg max-w-lg mx-auto leading-relaxed font-medium">
          Choose the plan that fits your growth ambitions. Start for free, upgrade when you're ready to dominate.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 transform-gpu">
        {/* Monthly */}
        <div className="group relative p-8 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] text-left hover:border-zinc-700 transition-all transform-gpu">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h4 className="text-xl font-black text-zinc-100 mb-1">Monthly</h4>
              <p className="text-sm text-zinc-500 font-medium">Perfect for starters</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-black text-zinc-100">₹299</div>
              <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">per month</div>
            </div>
          </div>
          <div className="h-px bg-zinc-800 mb-8" />
          <ul className="space-y-4 mb-10">
            {comparisonData.filter(r => r.isCore).map(feat => (
              <li key={feat.feature} className="flex items-center gap-3 text-sm font-medium text-zinc-400">
                <Check className="w-4 h-4 text-zinc-600" />
                {feat.feature}
              </li>
            ))}
          </ul>
          <button 
            disabled={paymentLoading}
            onClick={() => handlePayment('monthly')}
            className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 rounded-2xl text-center text-sm font-black text-white uppercase tracking-widest transition-all outline-none flex items-center justify-center gap-2"
          >
            {paymentLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Get Started'}
          </button>
        </div>

        {/* Yearly */}
        <div className="group relative p-8 bg-zinc-900 border-2 border-rose-600 rounded-[2.5rem] text-left shadow-[0_0_50px_rgba(225,29,72,0.15)] transition-all transform-gpu">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-rose-600 text-white text-xs font-black px-6 py-1.5 rounded-full uppercase tracking-widest">
            Best Value
          </div>
          <div className="flex justify-between items-start mb-8">
            <div>
              <h4 className="text-xl font-black text-zinc-100 mb-1">Yearly</h4>
              <p className="text-sm text-rose-500/80 font-medium italic">Save over 40%</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-black text-zinc-100">₹1999</div>
              <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">per year</div>
            </div>
          </div>
          <div className="h-px bg-zinc-800/50 mb-8" />
          <ul className="space-y-4 mb-10">
            {comparisonData.filter(r => r.isCore).map(feat => (
              <li key={feat.feature} className="flex items-center gap-3 text-sm font-bold text-white">
                <Check className="w-4 h-4 text-rose-500" />
                {feat.feature}
              </li>
            ))}
            <li className="flex items-center gap-3 text-sm font-bold text-rose-400">
               <Sparkles className="w-4 h-4 text-rose-500" />
               Viral Intelligence Engine
            </li>
          </ul>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={paymentLoading}
            onClick={() => handlePayment('yearly')}
            className="w-full py-4 bg-rose-600 rounded-2xl disabled:opacity-50 text-center text-sm font-black text-white uppercase tracking-widest shadow-lg shadow-rose-900/20 transition-all transform-gpu outline-none flex items-center justify-center gap-2"
          >
            {paymentLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Go Pro Now 🚀'}
          </motion.button>
          
          {paymentLoading && (
            <button 
              onClick={() => refreshStatus()}
              className="w-full mt-4 text-[10px] font-black text-rose-500 hover:text-rose-400 uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all animate-pulse"
            >
              <Activity className="w-3 h-3" />
              Check Payment Status
            </button>
          )}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="space-y-8 pt-12 transform-gpu">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-2xl font-black text-zinc-100 uppercase tracking-tight">Feature Rundown</h3>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-[3rem] overflow-hidden backdrop-blur-sm transform-gpu">
          <div className="grid grid-cols-2 border-b border-zinc-800 bg-zinc-950/50">
            <div className="p-6 text-center border-r border-zinc-800">
              <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">Free Plan</span>
            </div>
            <div className="p-6 text-center bg-rose-500/5">
              <span className="text-xs font-black text-rose-500 uppercase tracking-widest">Pro Plan</span>
            </div>
          </div>

          <div className="divide-y divide-zinc-800">
            <AnimatePresence mode="popLayout">
              {visibleRows.map((row, i) => (
                <motion.div 
                  key={row.feature}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.3, delay: i * 0.02 }}
                  className="grid grid-cols-2 transform-gpu will-change-[transform,opacity]"
                >
                  <div className="p-6 border-r border-zinc-800 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-zinc-200">{row.feature}</span>
                    </div>
                    <p className="text-[10px] text-zinc-500 font-medium leading-relaxed">{row.explanation}</p>
                    <div className="pt-2 flex items-center gap-1.5">
                      {typeof row.free === 'boolean' ? (
                        row.free ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Lock className="w-4 h-4 text-zinc-700" />
                      ) : (
                        <span className="text-[11px] font-bold text-zinc-400">{row.free}</span>
                      )}
                    </div>
                  </div>
                  <div className="p-6 bg-rose-500/[0.02] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-rose-400">{row.feature}</span>
                      <CheckCircle2 className="w-4 h-4 text-rose-500" />
                    </div>
                    <div className="pt-2">
                      {typeof row.pro === 'boolean' ? (
                        <span className="text-[11px] font-black text-rose-500 uppercase tracking-widest">Unlimited</span>
                      ) : (
                        <span className="text-[11px] font-black text-rose-500 uppercase tracking-widest">{row.pro}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full py-6 flex items-center justify-center gap-3 text-zinc-500 hover:text-zinc-300 text-xs font-black uppercase tracking-widest transition-colors outline-none"
        >
          {isExpanded ? (
            <>Less Features <ChevronUp className="w-5 h-5" /></>
          ) : (
            <>View All Pro Features <ChevronDown className="w-5 h-5" /></>
          )}
        </button>
      </div>

      {/* Trust Elements */}
      <div className="pt-12 text-center space-y-6 transform-gpu">
        <div className="flex items-center justify-center gap-8 opacity-40 grayscale group-hover:grayscale-0 transition-all transform-gpu">
          <ShieldCheck className="w-8 h-8" />
          <CreditCard className="w-8 h-8" />
          <Clock className="w-8 h-8" />
        </div>
        <p className="text-xs font-bold text-zinc-600 uppercase tracking-[0.2em] leading-relaxed">
          Trusted by 1,000+ top-tier creators <br /> 
          Safe & Secure Payments • Instant Setup
        </p>
      </div>
    </motion.div>
  );
});

PricingPage.displayName = 'PricingPage';
