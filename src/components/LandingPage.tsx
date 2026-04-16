import React from 'react';
import { motion } from 'motion/react';
import { Hero } from './Hero';
import { FAQ } from './FAQ';
import { ArrowRight, Play, BarChart2, TrendingUp, Zap, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col">
      <Hero onAnalyze={onStart} />
      
      {/* Demo Section (Idea Analysis Preview) */}
      <section className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter">
              The Engine of Virality
            </h2>
            <p className="text-zinc-500 font-medium text-lg">
              Behind the scenes of every 1M+ view post is a calculated strategy.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Demo Input Mockup */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-5 bg-zinc-900/50 border border-zinc-800 p-8 rounded-[2.5rem] backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-rose-600/20 rounded-xl flex items-center justify-center">
                  <Play className="w-5 h-5 text-rose-500 fill-rose-500" />
                </div>
                <span className="font-black text-white uppercase tracking-widest text-sm">Media Draft</span>
              </div>
              
              <div className="aspect-[9/16] bg-zinc-950 rounded-3xl mb-6 relative overflow-hidden group cursor-pointer border border-zinc-800">
                <img 
                  src="https://picsum.photos/seed/viral/500/800" 
                  alt="Demo video" 
                  className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                   <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-white fill-white" />
                   </div>
                   <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Click to preview</span>
                </div>
                
                {/* Simulated Overlays */}
                <div className="absolute bottom-6 left-6 right-6 space-y-2">
                  <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: ['0%', '100%'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="h-full bg-rose-500"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-black text-rose-500 uppercase tracking-tighter">
                    <span>Hook Phase</span>
                    <span>Retention: 94%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="h-4 bg-zinc-800/50 rounded-full w-3/4" />
                <div className="h-4 bg-zinc-800/50 rounded-full w-1/2" />
              </div>
            </motion.div>

            {/* Analysis Result Mockup */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-7 space-y-8"
            >
              <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-[2.5rem] backdrop-blur-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6">
                  <TrendingUp className="w-8 h-8 text-rose-500 opacity-20 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-rose-500" />
                  Viral Score: 87/100
                </h3>
                
                <div className="space-y-6">
                   <div className="grid grid-cols-2 gap-4">
                      <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
                        <div className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Hook Strength</div>
                        <div className="text-xl font-black text-rose-400">92%</div>
                      </div>
                      <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
                        <div className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Retention Potential</div>
                        <div className="text-xl font-black text-blue-400">84%</div>
                      </div>
                   </div>

                   <div className="space-y-3">
                      <h4 className="text-sm font-black text-white uppercase tracking-widest">AI Feedback</h4>
                      <p className="text-zinc-400 text-sm leading-relaxed">
                        "Your hook has high contrast but lacks curiosity. Try using a 'Reason Why' framing in the first 0.5s to boost initial watch time by 20%."
                      </p>
                   </div>

                   {/* Retention Graph Simulator */}
                   <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800">
                     <div className="flex justify-between items-end h-24 gap-1">
                        {[40, 70, 45, 90, 65, 85, 30, 50, 95, 40, 80, 55].map((h, i) => (
                          <motion.div 
                            key={i}
                            initial={{ height: 0 }}
                            whileInView={{ height: `${h}%` }}
                            className={cn(
                              "flex-1 rounded-t-sm",
                              h > 70 ? "bg-rose-500" : "bg-zinc-800"
                            )}
                          />
                        ))}
                     </div>
                     <div className="flex justify-between mt-2 text-[8px] font-black text-zinc-600 uppercase tracking-widest">
                       <span>0.0s</span>
                       <span>Predicted Retention Drop-offs</span>
                       <span>15.0s</span>
                     </div>
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-[2rem] flex flex-col items-center text-center">
                  <Zap className="w-6 h-6 text-yellow-500 mb-3" />
                  <span className="text-xs font-black text-white uppercase tracking-widest">10x Speed</span>
                  <span className="text-[10px] text-zinc-500 font-bold">In-depth analysis in seconds</span>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-[2rem] flex flex-col items-center text-center">
                  <BarChart2 className="w-6 h-6 text-blue-500 mb-3" />
                  <span className="text-xs font-black text-white uppercase tracking-widest">Algorithm Data</span>
                  <span className="text-[10px] text-zinc-500 font-bold">Trained on viral trends</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing / CTA Section */}
      <section id="pricing" className="py-32 px-6 text-center bg-zinc-950/50">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto bg-gradient-to-b from-zinc-900/50 to-transparent border border-zinc-800 p-16 md:p-24 rounded-[4rem] relative overflow-hidden"
        >
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-rose-500/10 blur-[120px] rounded-full" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-rose-500/10 blur-[120px] rounded-full" />
          
          <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-[0.9]">
            Don't leave your <br />
            growth to chance.
          </h2>
          <p className="text-zinc-500 text-lg mb-12 max-w-xl mx-auto font-medium">
            Join 1,000+ creators who use ViralMeets to dominate the attention economy.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="group px-12 py-5 bg-white text-black text-xl font-black rounded-full hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all flex items-center gap-3 mx-auto"
          >
            Start Analyzing <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </section>

      <div id="about">
        <FAQ />
      </div>

      {/* Footer */}
      <footer className="py-24 px-6 border-t border-zinc-900/50 bg-[#050505]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
          <div className="md:col-span-2">
            <div className="text-3xl font-black text-white tracking-tighter mb-6">ViralMeets</div>
            <p className="text-zinc-500 text-sm font-medium max-w-sm">
              The premium AI companion for the next generation of digital creators. Built for those who don't just post, but compete.
            </p>
          </div>
          
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-widest mb-6">Product</h4>
            <div className="flex flex-col gap-4 text-sm font-bold text-zinc-500">
              <button onClick={() => window.scrollTo(0,0)} className="hover:text-rose-500 transition-colors text-left uppercase tracking-tighter">Analysis</button>
              <button onClick={onStart} className="hover:text-rose-500 transition-colors text-left uppercase tracking-tighter">Pricing</button>
              <button className="hover:text-rose-500 transition-colors text-left uppercase tracking-tighter">API</button>
            </div>
          </div>

          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-widest mb-6">Legal</h4>
            <div className="flex flex-col gap-4 text-sm font-bold text-zinc-500">
              <button className="hover:text-rose-500 transition-colors text-left uppercase tracking-tighter">Privacy</button>
              <button className="hover:text-rose-500 transition-colors text-left uppercase tracking-tighter">Terms</button>
              <button className="hover:text-rose-500 transition-colors text-left uppercase tracking-tighter">Contact</button>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-20 pt-12 border-t border-zinc-900/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-[0.2em]">
            © 2026 ViralMeets. Built for the bold.
          </p>
          <div className="flex gap-4">
             {/* Simple social icons could go here */}
          </div>
        </div>
      </footer>
    </div>
  );
};
