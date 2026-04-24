import React, { memo } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Zap, Activity, Info, BarChart3, TrendingUp, Lock, ArrowRight, Brain } from 'lucide-react';
import { cn } from '../lib/utils';

interface ViralIdeasEngineProps {
  onAnalyze: () => void;
}

const IDEAS = [
  { id: 1, text: "“I tried waking up at 4AM for 7 days…”", rotation: -2, zIndex: 10, offset: { x: -40, y: -20 } },
  { id: 2, text: "“This one mistake is killing your Instagram growth”", rotation: 3, zIndex: 40, offset: { x: 20, y: 0 } },
  { id: 3, text: "“I copied MrBeast’s strategy for 24 hours”", rotation: -1, zIndex: 30, offset: { x: -20, y: 40 } },
  { id: 4, text: "“Why your reels get 0 views (fix this)”", rotation: 5, zIndex: 20, offset: { x: 50, y: -40 } },
];

export const ViralIdeasEngine: React.FC<ViralIdeasEngineProps> = memo(({ onAnalyze }) => {
  return (
    <section id="demo" className="py-24 px-6 relative overflow-hidden bg-zinc-950">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-widest mb-6"
          >
            <Zap className="w-3 h-3 fill-current" />
            AI VIRAL ENGINE
          </motion.div>
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-tight">
            Viral Ideas Engine
          </h2>
          <p className="text-zinc-500 font-medium text-lg md:text-xl max-w-2xl mx-auto">
            See what works before you even post. Our engine analyzes thousands of viral patterns to predict your success.
          </p>
        </div>

        {/* Interactive Demo Area */}
        <div className="relative h-[500px] md:h-[600px] flex items-center justify-center mb-16">
          {/* Background Decorative Glow */}
          <div className="absolute inset-0 bg-rose-500/5 blur-[120px] rounded-full transform-gpu pointer-events-none" />
          
          {/* Surrounding Analysis Metrics - Positioned relative to the center */}
          
          {/* Top Left: Engagement Score */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="absolute top-0 left-0 md:top-12 md:left-12 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 p-4 rounded-3xl shadow-xl z-50 transform-gpu"
          >
            <div className="flex items-center gap-3 mb-2 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Viral Potential</span>
            </div>
            <div className="text-3xl font-black text-white tracking-tighter">82%</div>
            <div className="text-[9px] font-bold text-zinc-500 uppercase mt-1">High probability</div>
          </motion.div>

          {/* Top Right: Hook Strength */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="absolute top-12 right-0 md:top-24 md:right-12 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 p-4 rounded-3xl shadow-xl z-50 transform-gpu"
          >
            <div className="flex items-center gap-3 mb-2 text-rose-500">
              <Zap className="w-4 h-4 fill-current" />
              <span className="text-[10px] font-black uppercase tracking-widest">Hook Strength</span>
            </div>
            <div className="text-xl font-black text-white leading-tight">Strong hook <br/> in first 1.5s</div>
          </motion.div>

          {/* Center Right: Drop Point (Locked) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="absolute top-1/2 -translate-y-1/2 right-0 md:right-4 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 p-4 rounded-3xl shadow-xl z-50 transform-gpu"
          >
             <div className="flex items-center gap-3 mb-2 text-zinc-400">
              <BarChart3 className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Drop Point</span>
            </div>
            <div className="relative">
              <div className="text-xl font-black text-white blur-sm">Viewer drop at 3.2s</div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Lock className="w-5 h-5 text-rose-500" />
              </div>
            </div>
            <div className="mt-2 h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
               <div className="h-full bg-rose-500 w-1/3" />
            </div>
          </motion.div>

          {/* Bottom Left: Creator Insight */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="absolute bottom-12 left-0 md:bottom-24 md:left-12 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 p-4 rounded-3xl shadow-xl z-50 transform-gpu"
          >
            <div className="flex items-center gap-3 mb-2 text-rose-400">
              <Brain className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Core Insight</span>
            </div>
            <p className="text-sm font-bold text-white max-w-[150px] leading-tight">
              High curiosity trigger detected in intro
            </p>
          </motion.div>

          {/* Bottom Right: Growth Prediction */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="absolute bottom-0 right-0 md:bottom-12 md:right-12 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 p-5 rounded-[2rem] shadow-2xl z-50 transform-gpu"
          >
            <div className="flex items-center gap-3 mb-3 text-blue-400">
              <Activity className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Growth Prediction</span>
            </div>
            <div className="text-2xl font-black text-white tracking-tighter">120K – 450K</div>
            <div className="text-[9px] font-bold text-zinc-500 uppercase mt-1 tracking-widest">Estimated Reach</div>
          </motion.div>

          {/* Locked Advanced Insight (Blurred overlay in middle-ish bottom) */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-zinc-950/40 backdrop-blur-sm border border-zinc-800/30 px-6 py-2 rounded-full flex items-center gap-3 text-[10px] font-black text-zinc-500 uppercase tracking-widest z-10"
          >
            <Lock className="w-3 h-3 text-rose-500" />
            Script Optimization Locked
          </motion.div>

          {/* Floating Idea Cards */}
          <div className="relative w-full max-w-lg h-full flex items-center justify-center perspective-1000">
            {IDEAS.map((idea, index) => (
              <motion.div
                key={idea.id}
                initial={{ opacity: 0, scale: 0.8, y: idea.offset.y + 40, x: idea.offset.x }}
                whileInView={{ 
                  opacity: 1, 
                  scale: 1, 
                  y: idea.offset.y,
                  x: idea.offset.x,
                  rotate: idea.rotation
                }}
                animate={{
                  y: [idea.offset.y, idea.offset.y - 15, idea.offset.y],
                }}
                transition={{
                  y: {
                    duration: 4 + Math.random() * 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5 + index * 0.1 // Delayed floating after enter
                  },
                  opacity: { duration: 0.6, delay: index * 0.1 },
                  scale: { duration: 0.6, delay: index * 0.1 },
                  x: { duration: 0.6, delay: index * 0.1 },
                  rotate: { duration: 0.6, delay: index * 0.1 }
                }}
                whileHover={{ 
                  scale: 1.05, 
                  rotate: 0,
                  zIndex: 100,
                  transition: { duration: 0.2 }
                }}
                viewport={{ once: true }}
                className={cn(
                  "absolute p-6 rounded-3xl border border-zinc-800 backdrop-blur-xl shadow-2xl cursor-pointer transition-colors group transform-gpu",
                  index % 2 === 0 ? "bg-zinc-900/90" : "bg-black/90",
                )}
                style={{ zIndex: idea.zIndex }}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Viral Idea</span>
                  </div>
                  <p className="text-xl font-black text-white leading-tight tracking-tight group-hover:text-rose-400 transition-colors">
                    {idea.text}
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-4 border-t border-zinc-800/50">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-5 h-5 rounded-full border border-zinc-900 bg-zinc-800" />
                      ))}
                    </div>
                    <div className="flex items-center gap-1 text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                       <Sparkles className="w-3 h-3 text-amber-500" />
                       Analyze Now
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={onAnalyze}
            className="group px-12 py-5 bg-white text-black text-xl font-black rounded-full hover:shadow-[0_0_50px_rgba(255,255,255,0.15)] transition-all flex items-center gap-3 mx-auto shadow-2xl transform-gpu"
          >
            Analyze Your Idea 🚀
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </motion.button>
          <p className="mt-8 text-zinc-600 text-xs font-bold uppercase tracking-widest">
            Dominating the attention economy, one idea at a time.
          </p>
        </div>
      </div>
    </section>
  );
});

ViralIdeasEngine.displayName = 'ViralIdeasEngine';
