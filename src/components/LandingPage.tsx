import React from 'react';
import { motion } from 'motion/react';
import { Rocket, Zap, BarChart3, Wand2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen text-zinc-100 selection:bg-rose-500/30">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 space-y-8 max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-black uppercase tracking-widest mb-4">
            <Sparkles className="w-4 h-4" />
            AI-Powered Viral Prediction
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-white">
            Will your video <br />
            <span className="bg-gradient-to-r from-rose-400 via-rose-600 to-rose-400 bg-clip-text text-transparent animate-gradient">
              go viral?
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Analyze before you post. Fix what doesn’t work. Get the intelligence you need to dominate the algorithm.
          </p>
          
          <div className="pt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStart}
              className="group relative inline-flex items-center gap-3 px-10 py-5 bg-rose-600 hover:bg-rose-500 text-white rounded-full text-lg font-black uppercase tracking-widest transition-all shadow-[0_0_40px_rgba(225,29,72,0.3)]"
            >
              Analyze Now 🚀
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </motion.div>
        
        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-zinc-500"
        >
          <div className="w-6 h-10 border-2 border-zinc-800 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-zinc-700 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            {
              icon: Zap,
              title: "Test Your Hook Instantly",
              desc: "See if viewers will watch or scroll within seconds. Our AI simulates real viewer behavior.",
              color: "text-amber-400"
            },
            {
              icon: BarChart3,
              title: "AI-Powered Insights",
              desc: "Understand retention, drop-offs, and engagement. Get a detailed breakdown of your content's DNA.",
              color: "text-blue-400"
            },
            {
              icon: Wand2,
              title: "Fix Before You Post",
              desc: "Get actionable suggestions to improve performance. Rewrite hooks and scripts for maximum impact.",
              color: "text-emerald-400"
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] hover:border-rose-500/30 transition-all group"
            >
              <div className={`w-14 h-14 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-7 h-7 ${feature.color}`} />
              </div>
              <h3 className="text-2xl font-black text-white mb-4">{feature.title}</h3>
              <p className="text-zinc-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Demo Section */}
      <section className="py-32 px-6 bg-zinc-900/30 border-y border-zinc-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-5xl font-black text-white tracking-tight">
              Intelligence that <br />
              <span className="text-rose-500">drives results.</span>
            </h2>
            <p className="text-xl text-zinc-400 leading-relaxed">
              Our proprietary engine analyzes thousands of viral patterns to give you a precise score and actionable roadmap.
            </p>
            <div className="space-y-4">
              {[
                "Retention Graph Simulation",
                "Hook Strength Analysis",
                "Algorithm Trigger Detection",
                "Creator DNA Extraction"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-zinc-300 font-bold">
                  <ShieldCheck className="w-5 h-5 text-rose-500" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative bg-zinc-900 border border-zinc-800 rounded-[3rem] p-8 shadow-2xl"
          >
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <div className="text-xs font-black text-zinc-500 uppercase tracking-widest">Viral Score</div>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-5xl font-black text-rose-500"
                >
                  8.8<span className="text-xl text-zinc-700">/10</span>
                </motion.div>
              </div>
              
              <div className="space-y-4">
                <div className="text-xs font-black text-zinc-500 uppercase tracking-widest">Retention Forecast</div>
                <div className="h-40 flex items-end gap-2">
                  {[80, 95, 70, 85, 60, 75, 50, 65, 40, 55].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      transition={{ delay: i * 0.1, duration: 0.8 }}
                      className="flex-1 bg-gradient-to-t from-rose-600/20 to-rose-500 rounded-t-lg"
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Paywall Section */}
      <section className="py-40 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto space-y-10"
        >
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
            You’re 2 fixes away from a viral video
          </h2>
          <p className="text-xl text-zinc-400 font-medium">
            Unlock full analysis to improve your content. Join thousands of creators using viralmeets to dominate their niche.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="px-12 py-6 bg-white text-black rounded-full text-xl font-black uppercase tracking-widest transition-all shadow-[0_0_50px_rgba(255,255,255,0.1)]"
          >
            Unlock Full Analysis 🚀
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-zinc-900 text-center">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-8">
          <div className="text-2xl font-black text-white tracking-tighter">viralmeets</div>
          <div className="flex gap-8 text-sm font-bold text-zinc-500 uppercase tracking-widest">
            <a href="#" className="hover:text-rose-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-rose-500 transition-colors">Terms</a>
            <a href="#" className="hover:text-rose-500 transition-colors">Contact</a>
          </div>
          <p className="text-xs text-zinc-700 font-bold uppercase tracking-widest">
            © 2026 viralmeets. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
