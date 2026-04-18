import React, { memo, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Hero } from './Hero';
import { FAQ } from './FAQ';
import { ArrowRight, Play, BarChart2, TrendingUp, Zap, Sparkles, X, Pause, Volume2, VolumeX } from 'lucide-react';
import { cn } from '../lib/utils';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = memo(({ onStart }) => {
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionVideoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const toggleSectionPlay = () => {
    if (sectionVideoRef.current) {
      if (sectionVideoRef.current.paused) sectionVideoRef.current.play();
      else sectionVideoRef.current.pause();
    }
  };

  return (
    <div className="flex flex-col">
      <Hero 
        onAnalyze={onStart} 
        onWatchDemo={() => setShowDemoModal(true)} 
      />
      
      {/* Demo Section (Idea Analysis Preview) */}
      <section id="demo" className="py-24 px-6 relative overflow-hidden">
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="lg:col-span-5 bg-zinc-900/50 border border-zinc-800 p-8 rounded-[2.5rem] backdrop-blur-sm transform-gpu will-change-transform"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-rose-600/20 rounded-xl flex items-center justify-center">
                  <Play className="w-5 h-5 text-rose-500 fill-rose-500" />
                </div>
                <span className="font-black text-white uppercase tracking-widest text-sm">Media Draft</span>
              </div>
              
              <div 
                onClick={toggleSectionPlay}
                className="aspect-[9/16] bg-zinc-950 rounded-3xl mb-6 relative overflow-hidden group cursor-pointer border border-zinc-800 shadow-2xl shadow-rose-900/10"
              >
                <video 
                  ref={sectionVideoRef}
                  src="https://assets.mixkit.co/videos/preview/mixkit-woman-dancing-in-front-of-a-pink-background-mid-shot-41484-large.mp4"
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                  muted
                  loop
                  playsInline
                />
                
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 group-hover:bg-black/20 transition-all">
                   <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-white fill-white" />
                   </div>
                   <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Preview Draft</span>
                </div>
                
                {/* Simulated Overlays */}
                <div className="absolute bottom-6 left-6 right-6 space-y-2">
                  <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 w-[94%]" />
                  </div>
                  <div className="flex justify-between text-[10px] font-black text-rose-400 uppercase tracking-tighter">
                    <span>Hook Strength Analysis</span>
                    <span>Confidence: 94%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="h-3 bg-zinc-800/50 rounded-full w-3/4" />
                <div className="h-3 bg-zinc-800/50 rounded-full w-1/2" />
              </div>
            </motion.div>

            {/* Analysis Result Mockup */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="lg:col-span-7 space-y-8 transform-gpu will-change-transform"
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

                   {/* Retention Graph Simulator - Optimized bars */}
                   <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800">
                     <div className="flex justify-between items-end h-24 gap-1">
                        {[40, 70, 45, 90, 65, 85, 30, 50, 95, 40, 80, 55].map((h, i) => (
                          <div 
                            key={i}
                            className={cn(
                              "flex-1 rounded-t-sm transform-gpu transition-all duration-1000",
                              h > 70 ? "bg-rose-500" : "bg-zinc-800"
                            )}
                            style={{ height: `${h}%` }}
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
              <button onClick={() => window.scrollTo(0,0)} className="hover:text-rose-500 transition-colors text-left uppercase tracking-tighter outline-none">Analysis</button>
              <button onClick={onStart} className="hover:text-rose-500 transition-colors text-left uppercase tracking-tighter outline-none">Pricing</button>
              <button className="hover:text-rose-500 transition-colors text-left uppercase tracking-tighter outline-none">API</button>
            </div>
          </div>

          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-widest mb-6">Legal</h4>
            <div className="flex flex-col gap-4 text-sm font-bold text-zinc-500">
              <button className="hover:text-rose-500 transition-colors text-left uppercase tracking-tighter outline-none">Privacy</button>
              <button className="hover:text-rose-500 transition-colors text-left uppercase tracking-tighter outline-none">Terms</button>
              <button className="hover:text-rose-500 transition-colors text-left uppercase tracking-tighter outline-none">Contact</button>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-20 pt-12 border-t border-zinc-900/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-[0.2em]">
            © 2026 ViralMeets. Built for the bold.
          </p>
        </div>
      </footer>

      {/* Demo Modal */}
      <AnimatePresence>
        {showDemoModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDemoModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-900 rounded-[2rem] overflow-hidden shadow-2xl"
            >
              <button 
                onClick={() => setShowDemoModal(false)}
                className="absolute top-6 right-6 z-50 p-2 bg-black/50 text-white rounded-full hover:bg-white hover:text-black transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="aspect-video relative bg-black group">
                <video
                  ref={videoRef}
                  src="https://assets.mixkit.co/videos/preview/mixkit-fashionable-content-creator-recording-a-video-with-her-phone-42045-large.mp4"
                  className="w-full h-full object-contain"
                  playsInline
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
                
                {/* Custom Controls Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <button onClick={togglePlay} className="text-white hover:text-rose-500 transition-colors">
                        {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
                      </button>
                      <button onClick={() => setIsMuted(!isMuted)} className="text-white hover:text-rose-500 transition-colors">
                        {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-[10px] font-black text-white uppercase tracking-widest bg-rose-600 px-3 py-1 rounded-full">
                        Live Analysis Demo
                      </div>
                    </div>
                  </div>
                </div>
                
                {!isPlaying && (
                  <button 
                    onClick={togglePlay}
                    className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform"
                  >
                    <div className="w-20 h-20 bg-rose-600 rounded-full flex items-center justify-center shadow-2xl shadow-rose-900/40">
                      <Play className="w-8 h-8 text-white fill-current ml-1" />
                    </div>
                  </button>
                )}
              </div>

              <div className="p-8 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-1">Viral Potential Analysis</h3>
                  <p className="text-xs text-zinc-500 font-medium">Watch how ViralMeets breaks down content in real-time.</p>
                </div>
                <button 
                  onClick={() => { setShowDemoModal(false); onStart(); }}
                  className="px-8 py-3 bg-white text-black text-xs font-black rounded-full uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all whitespace-nowrap"
                >
                  Start Your Analysis
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
});

LandingPage.displayName = 'LandingPage';
