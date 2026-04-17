import React, { memo } from 'react';
import { motion } from 'motion/react';
import { Eye, BarChart3, Brain, Dna, Wand2, TrendingUp, Target } from 'lucide-react';

const features = [
  {
    title: "Scroll Test",
    desc: "Test if viewers will watch or scroll within seconds.",
    icon: Eye,
    color: "text-blue-400"
  },
  {
    title: "Scroll-Stopping Power",
    desc: "Deep retention graph simulation based on visual hooks.",
    icon: BarChart3,
    color: "text-rose-400"
  },
  {
    title: "Viral Intelligence Engine",
    desc: "AI-powered deep analysis of content patterns.",
    icon: Brain,
    color: "text-purple-400"
  },
  {
    title: "Creator DNA",
    desc: "Identify your unique content strengths and weaknesses.",
    icon: Dna,
    color: "text-emerald-400"
  },
  {
    title: "Improvement System",
    desc: "Actionable fixes to optimize your video instantly.",
    icon: Wand2,
    color: "text-amber-400"
  },
  {
    title: "Engagement Prediction",
    desc: "Simulate like, share, and save probabilities.",
    icon: TrendingUp,
    color: "text-indigo-400"
  },
  {
    title: "Drop-off Detection",
    desc: "Pinpoint exactly where viewers lose interest.",
    icon: Target,
    color: "text-orange-400"
  }
];

export const FeaturesGrid: React.FC = memo(() => {
  return (
    <section className="py-32 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto pb-8 md:pb-0 scrollbar-hide">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ 
              duration: 0.4,
              delay: i * 0.05,
              ease: "easeOut"
            }}
            whileHover={{ y: -5, scale: 1.01 }}
            className="group bg-zinc-900/50 border border-zinc-800/50 p-8 rounded-[2rem] hover:border-rose-500/30 hover:shadow-[0_0_30px_rgba(225,29,72,0.1)] transition-all transform-gpu will-change-transform"
          >
            <div className={`w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform transform-gpu`}>
              <f.icon className={`w-6 h-6 ${f.color}`} />
            </div>
            <h3 className="text-xl font-black text-white mb-2">{f.title}</h3>
            <p className="text-zinc-400 text-sm font-medium leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
});

FeaturesGrid.displayName = 'FeaturesGrid';
