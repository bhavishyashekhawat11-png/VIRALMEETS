import React from 'react';
import { motion } from 'motion/react';
import { Eye, BarChart3, Brain, Dna, Wand2, TrendingUp, Target } from 'lucide-react';

const detailedFeatures = [
  {
    title: "Scroll Test",
    desc: "Simulate the first 3 seconds of viewer behavior. We pause the video and ask the hard question: would they keep watching? Get instant feedback on your hook's effectiveness.",
    icon: Eye,
    color: "text-blue-400"
  },
  {
    title: "Scroll-Stopping Power",
    desc: "Visualize your video's retention before you even post. Our AI generates a projected retention curve, highlighting exactly where you're likely to lose your audience.",
    icon: BarChart3,
    color: "text-rose-400"
  },
  {
    title: "Viral Intelligence Engine",
    desc: "Deep frame-by-frame analysis that detects visual patterns, pacing, and narrative triggers that historically lead to viral growth on short-form platforms.",
    icon: Brain,
    color: "text-purple-400"
  },
  {
    title: "Creator DNA",
    desc: "Understand your unique style. We analyze your content history to identify recurring strengths and weaknesses, helping you double down on what works.",
    icon: Dna,
    color: "text-emerald-400"
  },
  {
    title: "Improvement System",
    desc: "Don't just find problems—fix them. Get specific, actionable advice on how to improve your hook, lighting, pacing, and call-to-actions.",
    icon: Wand2,
    color: "text-amber-400"
  },
  {
    title: "Engagement Prediction",
    desc: "Know your numbers. We project the probability of likes, shares, and saves, giving you a clear picture of your video's viral potential.",
    icon: TrendingUp,
    color: "text-indigo-400"
  },
  {
    title: "Drop-off Detection",
    desc: "Identify the 'dead zones' in your content. Pinpoint the exact second where engagement dips so you can trim the fat and keep viewers locked in.",
    icon: Target,
    color: "text-orange-400"
  }
];

export const FeaturesPage: React.FC = () => {
  return (
    <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-20"
      >
        <h1 className="text-5xl font-black text-white mb-6">Powerful Features</h1>
        <p className="text-xl text-zinc-400 font-medium">Everything you need to master the algorithm.</p>
      </motion.div>

      <div className="space-y-12">
        {detailedFeatures.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-8 items-center bg-zinc-900/30 border border-zinc-800/50 p-10 rounded-[2.5rem]"
          >
            <div className="w-20 h-20 shrink-0 rounded-3xl bg-zinc-800 flex items-center justify-center">
              <f.icon className={`w-10 h-10 ${f.color}`} />
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-black text-white mb-3">{f.title}</h3>
              <p className="text-zinc-400 text-lg font-medium leading-relaxed">{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
