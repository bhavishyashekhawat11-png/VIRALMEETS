import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import Markdown from 'react-markdown';

export function LegalPage({ title, content, onBack }: { title: string, content: string, onBack: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 flex flex-col p-6 pt-12 bg-zinc-950 overflow-y-auto"
    >
      <button 
        onClick={onBack}
        className="fixed top-6 left-6 z-50 p-2 bg-zinc-900/80 backdrop-blur-sm rounded-full text-zinc-500 hover:text-zinc-300 transition-colors border border-zinc-800"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="max-w-2xl mx-auto w-full">
        <div className="mb-12 mt-4">
          <h2 className="text-4xl font-black text-zinc-100 mb-2 tracking-tight">{title}</h2>
          <div className="h-1 w-20 bg-rose-600 rounded-full" />
        </div>

        <div className="prose prose-invert prose-zinc max-w-none text-zinc-400 pb-20">
          <Markdown>{content}</Markdown>
        </div>
      </div>
    </motion.div>
  );
}
