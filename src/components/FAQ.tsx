import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: "How does ViralMeets work?",
    a: "ViralMeets uses advanced AI to analyze visual hooks, narrative flow, and engagement patterns in your videos, comparing them against viral database trends."
  },
  {
    q: "Is the analysis accurate?",
    a: "Our models are trained on millions of high-performing short-form videos to provide the most accurate performance projections possible."
  },
  {
    q: "Do I need to upload videos?",
    a: "Yes, for the most accurate analysis, uploading your video file allows our AI to perform deep frame-by-frame visual intelligence."
  },
  {
    q: "What is included in Pro?",
    a: "Pro includes unlimited deep analysis, Creator DNA profiling, detailed optimization plans, and advanced engagement simulations."
  },
  {
    q: "Can I cancel anytime?",
    a: "Absolutely. You can manage your subscription and cancel at any time from your settings page."
  },
  {
    q: "Does it work for YouTube Shorts?",
    a: "Yes, ViralMeets supports TikTok, Instagram Reels, and YouTube Shorts."
  },
  {
    q: "How long does analysis take?",
    a: "Deep analysis typically takes between 15-30 seconds depending on video length and complexity."
  },
  {
    q: "Is my data secure?",
    a: "We prioritize your privacy. Your videos are analyzed and processed securely, and we never share your content with third parties."
  },
  {
    q: "Can I use it for client work?",
    a: "Yes, many agencies use ViralMeets to optimize content for their clients and improve ROI."
  },
  {
    q: "What if I'm a beginner?",
    a: "ViralMeets is designed for everyone. Our actionable fixes tell you exactly what to change, even if you're just starting out."
  }
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-32 px-6 max-w-3xl mx-auto">
      <h2 className="text-4xl font-black text-white text-center mb-16">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="border-b border-zinc-800/50">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full py-6 flex items-center justify-between text-left group"
            >
              <span className="text-lg font-bold text-zinc-200 group-hover:text-white transition-colors">{faq.q}</span>
              <ChevronDown className={`w-5 h-5 text-zinc-500 transition-transform ${openIndex === i ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="pb-6 text-zinc-400 font-medium leading-relaxed">{faq.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
};
