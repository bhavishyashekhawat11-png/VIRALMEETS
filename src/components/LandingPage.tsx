import React, { memo, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Hero } from './Hero';
import { FAQ } from './FAQ';
import { ViralIdeasEngine } from './ViralIdeasEngine';
import { ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = memo(({ onStart }) => {
  return (
    <div className="flex flex-col">
      <Hero 
        onAnalyze={onStart} 
      />
      
      <ViralIdeasEngine onAnalyze={onStart} />

      {/* Pricing / CTA Section */}
      <section id="pricing" className="py-32 px-6 text-center bg-zinc-950/50 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto bg-gradient-to-b from-zinc-900/50 to-transparent border border-zinc-800 p-16 md:p-24 rounded-[4rem] relative overflow-hidden transform-gpu will-change-transform"
        >
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-rose-500/5 blur-[80px] rounded-full" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-rose-500/5 blur-[80px] rounded-full" />
          
          <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-[0.9]">
            Don't leave your <br />
            growth to chance.
          </h2>
          <p className="text-zinc-500 text-lg mb-12 max-w-xl mx-auto font-medium">
            Join 1,000+ creators who use ViralMeets to dominate the attention economy.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStart}
            className="group px-12 py-5 bg-white text-black text-xl font-black rounded-full hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all flex items-center gap-3 mx-auto transform-gpu"
          >
            Start Analyzing <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </section>

      <div id="about">
        <FAQ />
      </div>
    </div>
  );
});

LandingPage.displayName = 'LandingPage';
