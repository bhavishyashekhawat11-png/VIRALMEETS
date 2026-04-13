import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Rocket, Check, Lock, X, Sparkles, Zap, BarChart3, Wand2, 
  ChevronDown, ChevronUp, TrendingUp, Target, Activity, 
  ArrowLeft, ShieldCheck, CheckCircle2, CreditCard, Clock
} from 'lucide-react';
import { useSubscription } from '../contexts/SubscriptionContext';
import { cn } from '../lib/utils';
import { Step } from '../types';

interface ComparisonRow {
  feature: string;
  explanation: string;
  free: string | boolean;
  pro: string | boolean;
  isCore?: boolean;
}

export function SubscriptionView({ onBack }: { onBack: () => void }) {
  const { isPro, plan, upgrade, setShowUpgradeModal } = useSubscription();
  const [isExpanded, setIsExpanded] = useState(false);

  const comparisonData: ComparisonRow[] = [
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
  ];

  const visibleRows = isExpanded ? comparisonData : comparisonData.filter(row => row.isCore);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col bg-zinc-950 overflow-y-auto custom-scrollbar"
    >
      {/* Header */}
      <div className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-bottom border-zinc-900 px-6 py-4 flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-zinc-900 rounded-full transition-colors text-zinc-400 hover:text-zinc-100"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-black text-zinc-100 uppercase tracking-tight">Subscription</h1>
      </div>

      <div className="p-6 space-y-12 pb-32">
        {/* Hero Section */}
        <div className="text-center space-y-4 pt-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-widest mb-2"
          >
            <Sparkles className="w-3 h-3" />
            Limited Time Offer
          </motion.div>
          <h2 className="text-4xl font-black text-zinc-100 leading-tight tracking-tighter">
            Unlock Viral <br /> Growth 🚀
          </h2>
          <p className="text-zinc-400 text-sm max-w-[280px] mx-auto leading-relaxed">
            Upgrade to Pro for full access to advanced insights and better performance
          </p>
        </div>

        {/* Value Graph */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <TrendingUp className="w-24 h-24 text-rose-500" />
          </div>
          
          <div className="relative z-10 space-y-8">
            <div className="flex justify-between items-end h-32 gap-4">
              <div className="flex-1 flex flex-col items-center gap-3">
                <div className="w-full bg-zinc-800 rounded-t-2xl relative h-12">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: '100%' }}
                    className="absolute bottom-0 inset-x-0 bg-zinc-700 rounded-t-2xl"
                  />
                </div>
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Free</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-3">
                <div className="w-full bg-rose-500/20 rounded-t-2xl relative h-full">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: '100%' }}
                    className="absolute bottom-0 inset-x-0 bg-rose-600 rounded-t-2xl shadow-[0_0_20px_rgba(225,29,72,0.4)]"
                  />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-rose-600 text-white text-[10px] font-black px-2 py-1 rounded-lg whitespace-nowrap">
                    10X GROWTH
                  </div>
                </div>
                <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Pro</span>
              </div>
            </div>
            <p className="text-center text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Visualizing Content Performance Potential
            </p>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-black text-zinc-100 uppercase tracking-tight">Plan Comparison</h3>
            <div className="bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
              <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Best Value</span>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] overflow-hidden">
            <div className="grid grid-cols-2 border-b border-zinc-800 bg-zinc-950/50">
              <div className="p-4 text-center border-r border-zinc-800">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Free Plan</span>
              </div>
              <div className="p-4 text-center bg-rose-500/5">
                <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Pro Plan</span>
              </div>
            </div>

            <div className="divide-y divide-zinc-800">
              <AnimatePresence mode="popLayout">
                {visibleRows.map((row, i) => (
                  <motion.div 
                    key={row.feature}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: i * 0.05 }}
                    className="grid grid-cols-2"
                  >
                    <div className="p-5 border-r border-zinc-800 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-zinc-200">{row.feature}</span>
                      </div>
                      <p className="text-[9px] text-zinc-500 font-medium leading-relaxed">{row.explanation}</p>
                      <div className="pt-2 flex items-center gap-1.5">
                        {typeof row.free === 'boolean' ? (
                          row.free ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Lock className="w-3 h-3 text-zinc-700" />
                        ) : (
                          <span className="text-[10px] font-bold text-zinc-400">{row.free}</span>
                        )}
                      </div>
                    </div>
                    <div className="p-5 bg-rose-500/[0.02] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-rose-400">{row.feature}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-rose-500" />
                      </div>
                      <p className="text-[9px] text-rose-900/40 font-medium leading-relaxed invisible">{row.explanation}</p>
                      <div className="pt-2">
                        {typeof row.pro === 'boolean' ? (
                          <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Unlimited</span>
                        ) : (
                          <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{row.pro}</span>
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
            className="w-full py-4 flex items-center justify-center gap-2 text-zinc-500 hover:text-zinc-300 text-[10px] font-black uppercase tracking-widest transition-colors"
          >
            {isExpanded ? (
              <>Show Less <ChevronUp className="w-4 h-4" /></>
            ) : (
              <>View Full Comparison <ChevronDown className="w-4 h-4" /></>
            )}
          </button>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 gap-4">
          {[
            { icon: Zap, title: "Create high-performing content", desc: "Use data-backed hooks and scripts" },
            { icon: Target, title: "Predict results before posting", desc: "Stop guessing and start knowing" },
            { icon: Clock, title: "Save time and avoid bad ideas", desc: "Focus only on what works" }
          ].map((benefit, i) => (
            <div key={i} className="flex items-start gap-4 p-5 bg-zinc-900/50 border border-zinc-800 rounded-3xl">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center shrink-0">
                <benefit.icon className="w-5 h-5 text-rose-500" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-zinc-200">{benefit.title}</h4>
                <p className="text-xs text-zinc-500 font-medium">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Section */}
        <div className="space-y-6 pt-4">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-black text-zinc-100 tracking-tight">Choose Your Plan</h3>
            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Cancel anytime • Instant access</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Monthly */}
            <button 
              onClick={upgrade}
              className="group relative p-6 bg-zinc-900 border border-zinc-800 rounded-[2rem] text-left hover:border-rose-500/50 transition-all active:scale-[0.98]"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-black text-zinc-100">Monthly</h4>
                  <p className="text-xs text-zinc-500 font-medium">Perfect for testing</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-zinc-100">₹299</div>
                  <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">per month</div>
                </div>
              </div>
              <div className="w-full py-3 bg-zinc-800 group-hover:bg-rose-600 rounded-xl text-center text-[10px] font-black text-zinc-400 group-hover:text-white uppercase tracking-widest transition-all">
                Select Monthly
              </div>
            </button>

            {/* Yearly */}
            <button 
              onClick={upgrade}
              className="group relative p-6 bg-zinc-900 border-2 border-rose-600 rounded-[2rem] text-left shadow-[0_0_30px_rgba(225,29,72,0.15)] active:scale-[0.98] transition-all"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-rose-600 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">
                Best Value
              </div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-black text-zinc-100">Yearly</h4>
                  <p className="text-xs text-zinc-500 font-medium">Save over 40%</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-zinc-100">₹1999</div>
                  <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">per year</div>
                </div>
              </div>
              <div className="w-full py-3 bg-rose-600 rounded-xl text-center text-[10px] font-black text-white uppercase tracking-widest shadow-lg shadow-rose-900/20">
                Select Yearly 🚀
              </div>
            </button>
          </div>
        </div>

        {/* Current Plan Status */}
        <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-2 h-2 rounded-full animate-pulse",
              isPro ? "bg-emerald-500" : "bg-rose-500"
            )} />
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
              Current Plan: {isPro ? 'Pro Plan ✅' : 'Free Plan'}
            </span>
          </div>
          {!isPro && (
            <span className="text-[9px] font-bold text-rose-500 uppercase tracking-widest">
              You're missing advanced insights
            </span>
          )}
        </div>

        {/* Trust Elements */}
        <div className="pt-8 text-center space-y-4">
          <div className="flex items-center justify-center gap-6 opacity-40 grayscale">
            <ShieldCheck className="w-5 h-5" />
            <CreditCard className="w-5 h-5" />
            <Clock className="w-5 h-5" />
          </div>
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-relaxed">
            Used by creators to improve performance • Cancel anytime <br />
            Most users upgrade after hitting daily limits
          </p>
        </div>
      </div>
    </motion.div>
  );
}
