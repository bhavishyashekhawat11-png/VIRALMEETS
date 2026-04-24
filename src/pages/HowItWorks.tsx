import React, { memo } from 'react';
import { motion } from 'motion/react';
import { Rocket, Target, Zap, Activity, BarChart3, Search, Lightbulb, Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { Helmet } from 'react-helmet-async';

export const HowItWorks: React.FC = memo(() => {
  const steps = [
    {
      icon: <Search className="w-6 h-6 text-rose-500" />,
      title: "1. Enter your idea",
      description: "Paste your video script, hook, or just a rough concept. Tell us the platform and your target niche.",
      color: "rose"
    },
    {
      icon: <Target className="w-6 h-6 text-blue-500" />,
      title: "2. AI analyzes content",
      description: "Our engine compares your idea against millions of high-performing data points and behavioral patterns.",
      color: "blue"
    },
    {
      icon: <Sparkles className="w-6 h-6 text-amber-500" />,
      title: "3. Get viral score + improvements",
      description: "Receive a precise viral score, identify potential drop-off points, and get actionable tips to fix your content.",
      color: "amber"
    }
  ];

  const features = [
    { icon: <BarChart3 className="w-5 h-5" />, title: "Retention Insights", sub: "predict viewership duration" },
    { icon: <Search className="w-5 h-5" />, title: "Drop-off Detection", sub: "spot boring moments" },
    { icon: <Zap className="w-5 h-5" />, title: "Viral Score", sub: "0-100 probability index" },
    { icon: <Target className="w-5 h-5" />, title: "Hook Improvements", sub: "catchier opening sentences" },
    { icon: <Activity className="w-5 h-5" />, title: "Optimization Tips", sub: "AI-driven polish" }
  ];

  return (
    <div className="relative pt-32 pb-24 overflow-hidden">
      <Helmet>
        <title>How ViralMeets Works – AI Content Analysis Tool</title>
        <meta name="description" content="Fix drop points. Improve retention. Grow faster. Learn how ViralMeets uses AI to predict your video performance." />
        <meta property="og:title" content="How ViralMeets Works – AI Content Analysis Tool" />
        <meta property="og:description" content="Fix drop points. Improve retention. Grow faster." />
        <meta property="og:image" content="https://viralmeets.com/preview.png" />
      </Helmet>

      {/* Floating Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-rose-500/10 blur-[100px] animate-pulse" />
        <div className="absolute bottom-40 right-10 w-96 h-96 bg-blue-500/10 blur-[120px] animation-delay-2000" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* HERO SECTION */}
        <div className="text-center max-w-3xl mx-auto mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-widest mb-6"
          >
            <Sparkles className="w-3 h-3" /> The Science of Virality
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-400"
          >
            Know If Your Content Will Go Viral — <span className="text-rose-500">Before You Post</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-zinc-400 font-medium leading-relaxed mb-10"
          >
            ViralMeets analyzes your content idea and predicts performance using AI trained on the latest social algorithm patterns. Stop guessing, start growing.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
             <button className="bg-white text-black font-black px-10 py-4 rounded-2xl hover:bg-zinc-100 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/5 flex items-center justify-center gap-2 mx-auto group">
                Try Free Analysis
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
             </button>
          </motion.div>
        </div>

        {/* STEP BY STEP PROCESS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {steps.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              whileHover={{ y: -10 }}
              className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 p-8 rounded-[2.5rem] relative group"
            >
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110",
                item.color === 'rose' ? "bg-rose-500/10 text-rose-500" : 
                item.color === 'blue' ? "bg-blue-500/10 text-blue-500" : "bg-amber-500/10 text-amber-500"
              )}>
                {item.icon}
              </div>
              <h3 className="text-xl font-black text-white mb-4 tracking-tight">{item.title}</h3>
              <p className="text-zinc-400 text-sm font-medium leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* WHAT YOU GET */}
        <div className="mb-32">
          <div className="text-center mb-16">
             <h2 className="text-3xl font-black text-white tracking-tighter mb-4">Unfair Advantage for Your Content</h2>
             <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest leading-loose">Comprehensive analysis in every report</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-zinc-950 border border-zinc-800 px-6 py-4 rounded-2xl flex items-center gap-4 group"
              >
                <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
                <div>
                  <div className="text-xs font-black text-zinc-100 uppercase tracking-widest">{feature.title}</div>
                  <div className="text-[10px] font-bold text-zinc-500 leading-none mt-1">{feature.sub}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* WHY IT WORKS */}
        <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden mb-32">
           <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 via-transparent to-rose-500/5 opacity-50" />
           <div className="relative z-10 max-w-2xl mx-auto">
             <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
             >
               <h2 className="text-3xl font-black text-white tracking-tighter mb-8">Why It Actually Works</h2>
               <p className="text-xl text-zinc-300 font-medium leading-relaxed mb-8">
                 Most creators guess. ViralMeets uses behavioral patterns to predict performance before posting. Our AI is trained on content that actually moves the needle, not just random metrics.
               </p>
               <div className="flex items-center justify-center gap-8 text-zinc-500">
                  <div className="flex flex-col items-center gap-2">
                    <ShieldCheck className="w-8 h-8 text-rose-500/50" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Secure</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Zap className="w-8 h-8 text-rose-500/50" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Fast</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle2 className="w-8 h-8 text-rose-500/50" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Reliable</span>
                  </div>
               </div>
             </motion.div>
           </div>
        </div>

        {/* FINAL CTA */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-rose-600 rounded-[3rem] p-12 md:p-16 text-center space-y-8 relative overflow-hidden shadow-2xl shadow-rose-900/20"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] -translate-y-1/2 translate-x-1/2" />
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter relative z-10">
            Ready to stop guessing?
          </h2>
          <p className="text-rose-100 text-lg font-medium opacity-90 max-w-xl mx-auto relative z-10">
            Join 10,000+ creators who use ViralMeets to optimize their content for maximum reach.
          </p>
          <motion.button 
            animate={{ boxShadow: ["0 0 0px rgba(255,255,255,0)", "0 0 20px rgba(255,255,255,0.4)", "0 0 0px rgba(255,255,255,0)"] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="bg-white text-black font-black px-12 py-5 rounded-2xl hover:scale-105 active:scale-95 transition-all relative z-10 uppercase tracking-widest text-xs"
          >
            Start Your First Analysis
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
});

HowItWorks.displayName = 'HowItWorks';
