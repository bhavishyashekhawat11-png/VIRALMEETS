import React, { memo } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroProps {
  onAnalyze: () => void;
}

export const Hero: React.FC<HeroProps> = memo(({ onAnalyze }) => {
  return (
    <section className="min-h-[90vh] flex items-center justify-center px-6 relative overflow-hidden pt-20">
      <div
        className="text-center z-10 max-w-5xl mx-auto"
      >
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/50 border border-zinc-800 text-rose-400 text-xs font-black uppercase tracking-widest mb-8 backdrop-blur-md"
        >
          <Sparkles className="w-3.5 h-3.5" />
          AI-Powered Content Mastery
        </div>

        <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black tracking-tighter text-white leading-[0.8] mb-12">
          Where Content <br />
          <span className="bg-gradient-to-r from-rose-400 via-rose-600 to-rose-400 bg-clip-text text-transparent">
            Meets Intelligence
          </span>
        </h1>

        <p className="text-zinc-400 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
          The all-in-one AI platform to predict virality, refine hooks, and master the algorithm before you even hit post.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button
            onClick={onAnalyze}
            className="group px-10 py-5 bg-rose-600 text-white text-lg font-black rounded-full shadow-[0_0_30px_rgba(225,29,72,0.3)] transition-all flex items-center gap-3 active:scale-95"
          >
            Analyze Now 🚀
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';
