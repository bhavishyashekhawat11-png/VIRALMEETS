import React, { memo } from 'react';
import { motion } from 'motion/react';

export const AboutPage: React.FC = memo(() => {
  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto transform-gpu">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12 transform-gpu will-change-transform"
      >
        <div className="text-center">
          <h1 className="text-5xl font-black text-white mb-6">About ViralMeets</h1>
          <p className="text-xl text-zinc-400 font-medium leading-relaxed">
            We bridge the gap between creative intuition and algorithmic intelligence.
          </p>
        </div>

        <div className="grid gap-12">
          <section className="bg-zinc-900/30 border border-zinc-800/50 p-10 rounded-[2.5rem] transform-gpu">
            <h2 className="text-2xl font-black text-white mb-4">What is ViralMeets?</h2>
            <p className="text-zinc-400 text-lg font-medium leading-relaxed">
              ViralMeets is an AI-powered content intelligence platform designed specifically for the short-form video era. We analyze millions of data points across TikTok, Reels, and Shorts to help creators understand exactly why content succeeds or fails.
            </p>
          </section>

          <section className="bg-zinc-900/30 border border-zinc-800/50 p-10 rounded-[2.5rem] transform-gpu">
            <h2 className="text-2xl font-black text-white mb-4">Who is it for?</h2>
            <p className="text-zinc-400 text-lg font-medium leading-relaxed">
              Whether you're a solo creator looking to break through, a brand aiming for organic reach, or an agency managing multiple high-growth accounts, ViralMeets provides the data-driven insights you need to stop guessing and start growing.
            </p>
          </section>

          <section className="bg-zinc-900/30 border border-zinc-800/50 p-10 rounded-[2.5rem] transform-gpu">
            <h2 className="text-2xl font-black text-white mb-4">Why we exist?</h2>
            <p className="text-zinc-400 text-lg font-medium leading-relaxed">
              The algorithm shouldn't be a mystery. We believe that every creator deserves access to the same level of intelligence that top-tier media companies use. Our mission is to democratize viral growth by providing actionable, AI-driven feedback that anyone can use to improve their content.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
});

AboutPage.displayName = 'AboutPage';
