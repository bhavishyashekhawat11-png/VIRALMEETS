import fs from 'fs';

const code = `import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { analyzeVideoIntelligence, VideoIntelligenceResult, executeQuickAction } from './lib/gemini';
import { RotateCcw, Flame, Sparkles, Share, Zap, ArrowRight, Video, Clapperboard, X, Check, RefreshCw, BarChart3, Activity, Target, Play, Pause, Eye, Hand } from 'lucide-react';
import { cn } from './lib/utils';

type AnalysisState = 'idle' | 'analyzing' | 'scroll-test' | 'simulator' | 'creator-dna' | 'optimization';

export default function App() {
  const [videoFile, setVideoFile] = useState<{ data: string; mimeType: string; url: string } | null>(null);
  const [analysisState, setAnalysisState] = useState<AnalysisState>('idle');
  const [result, setResult] = useState<VideoIntelligenceResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pastAnalyses, setPastAnalyses] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('viralmeter_past_analyses');
    if (saved) {
      try {
        setPastAnalyses(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      setError("Video must be under 20MB for this prototype.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setVideoFile({
        data: (reader.result as string).split(',')[1],
        mimeType: file.type,
        url: URL.createObjectURL(file)
      });
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const startAnalysis = async () => {
    if (!videoFile) return;
    setAnalysisState('analyzing');
    setError(null);

    try {
      const res = await analyzeVideoIntelligence(videoFile.data, videoFile.mimeType, pastAnalyses);
      setResult(res);
      
      const newPast = [...pastAnalyses, { date: new Date().toISOString(), insight: res.scrollTestInsight }].slice(-5);
      setPastAnalyses(newPast);
      localStorage.setItem('viralmeter_past_analyses', JSON.stringify(newPast));

      setAnalysisState('scroll-test');
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to analyze video.");
      setAnalysisState('idle');
    }
  };

  const reset = () => {
    setVideoFile(null);
    setResult(null);
    setAnalysisState('idle');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-rose-500/30 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-rose-600/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-orange-600/10 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <AnimatePresence mode="wait">
        {analysisState === 'idle' && (
          <motion.div 
            key="input"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="w-full max-w-md p-6 space-y-8 z-10"
          >
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center p-3 bg-rose-500/10 rounded-2xl mb-2">
                <Flame className="w-8 h-8 text-rose-500" />
              </div>
              <h1 className="text-4xl font-black text-white tracking-tight">Viral Intelligence Engine</h1>
              <p className="text-zinc-400 text-sm font-medium">Upload your video for real AI analysis</p>
            </div>
            
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-bold py-3 px-4 rounded-xl text-center">
                {error}
              </div>
            )}

            <label className="block w-full aspect-[9/16] max-h-[60vh] bg-zinc-900/50 border-2 border-dashed border-zinc-800 rounded-3xl overflow-hidden relative cursor-pointer hover:border-rose-500/50 transition-colors group">
              <input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
              {videoFile ? (
                <>
                  <video src={videoFile.url} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" autoPlay loop muted playsInline />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-zinc-900/80 px-4 py-2 rounded-full text-sm font-bold text-white flex items-center gap-2 backdrop-blur-sm">
                      <RefreshCw className="w-4 h-4" /> Change Video
                    </div>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500 gap-4">
                  <div className="w-20 h-20 bg-zinc-800/50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform group-hover:bg-rose-500/20 group-hover:text-rose-400">
                    <Video className="w-10 h-10" />
                  </div>
                  <span className="font-bold tracking-wide">Tap to upload video</span>
                </div>
              )}
            </label>

            {videoFile && (
              <motion.button 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={startAnalysis} 
                className="w-full bg-rose-600 hover:bg-rose-500 text-white font-black py-5 rounded-2xl shadow-[0_0_30px_rgba(225,29,72,0.3)] transition-all active:scale-95 text-lg flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" /> Analyze Video
              </motion.button>
            )}
          </motion.div>
        )}

        {analysisState === 'analyzing' && (
          <motion.div 
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center space-y-6 z-10"
          >
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-4 border-zinc-800 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-rose-500 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Flame className="w-8 h-8 text-rose-500 animate-pulse" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-xl font-black text-white">Analyzing Video...</h2>
              <p className="text-zinc-400 text-sm font-medium animate-pulse">Extracting visual hooks & retention data</p>
            </div>
          </motion.div>
        )}

        {analysisState !== 'idle' && analysisState !== 'analyzing' && result && videoFile && (
          <EngineFlow 
            state={analysisState} 
            setState={setAnalysisState} 
            result={result} 
            videoUrl={videoFile.url} 
            onReset={reset}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function EngineFlow({ state, setState, result, videoUrl, onReset }: { state: AnalysisState, setState: (s: AnalysisState) => void, result: VideoIntelligenceResult, videoUrl: string, onReset: () => void }) {
  return (
    <div className="w-full max-w-md h-[100dvh] flex flex-col bg-zinc-950 relative z-10">
      <AnimatePresence mode="wait">
        {state === 'scroll-test' && <ScrollTest key="scroll-test" result={result} videoUrl={videoUrl} onNext={() => setState('simulator')} />}
        {state === 'simulator' && <ViralSimulator key="simulator" result={result} onNext={() => setState('creator-dna')} />}
        {state === 'creator-dna' && <CreatorDNA key="creator-dna" result={result} onNext={() => setState('optimization')} />}
        {state === 'optimization' && <OptimizationPlan key="optimization" result={result} onReset={onReset} />}
      </AnimatePresence>
    </div>
  );
}

function ScrollTest({ result, videoUrl, onNext }: { result: VideoIntelligenceResult, videoUrl: string, onNext: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showInsight, setShowInsight] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
      setShowOverlay(true);
    }, 3000); // Pause after 3 seconds
    return () => clearTimeout(timer);
  }, []);

  const handleChoice = () => {
    setShowOverlay(false);
    setShowInsight(true);
    setTimeout(() => {
      onNext();
    }, 3500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col bg-black"
    >
      <video 
        ref={videoRef}
        src={videoUrl} 
        className="w-full h-full object-cover" 
        autoPlay 
        muted 
        playsInline 
      />
      
      <div className="absolute top-12 left-0 right-0 flex justify-center pointer-events-none">
        <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-white text-xs font-bold tracking-widest uppercase flex items-center gap-2">
          <Eye className="w-4 h-4 text-rose-500" /> Scroll Test Mode
        </div>
      </div>

      <AnimatePresence>
        {showOverlay && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 z-20"
          >
            <h2 className="text-3xl font-black text-white text-center mb-12 drop-shadow-lg">Would you keep watching or scroll?</h2>
            <div className="flex flex-col w-full gap-4 max-w-xs">
              <button onClick={handleChoice} className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-black py-5 rounded-2xl text-lg transition-transform active:scale-95 shadow-[0_0_30px_rgba(16,185,129,0.3)] flex items-center justify-center gap-3">
                <Eye className="w-6 h-6" /> Keep Watching
              </button>
              <button onClick={handleChoice} className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-black py-5 rounded-2xl text-lg transition-transform active:scale-95 flex items-center justify-center gap-3">
                <Hand className="w-6 h-6" /> Scroll
              </button>
            </div>
          </motion.div>
        )}

        {showInsight && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-12 left-4 right-4 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl z-30 flex flex-col items-center text-center"
          >
            <div className="w-12 h-12 bg-rose-500/20 rounded-full flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-rose-500" />
            </div>
            <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">AI Insight</h3>
            <p className="text-lg font-bold text-white leading-snug">{result.scrollTestInsight}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ViralSimulator({ result, onNext }: { result: VideoIntelligenceResult, onNext: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex-1 flex flex-col p-6 overflow-y-auto pb-32"
    >
      <div className="text-center mb-8 mt-4">
        <h2 className="text-2xl font-black text-white">📊 Performance Projection</h2>
        <p className="text-zinc-400 text-sm mt-1">Simulated viral metrics</p>
      </div>

      <div className="space-y-6">
        {/* Retention Curve */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
          <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
            <Activity className="w-4 h-4" /> Retention Curve
          </h3>
          <div className="h-32 w-full flex items-end gap-1 relative">
            <div className="absolute top-0 left-0 text-[10px] text-zinc-600 font-bold">100%</div>
            <div className="absolute bottom-0 left-0 text-[10px] text-zinc-600 font-bold">0s</div>
            <div className="absolute bottom-0 right-0 text-[10px] text-zinc-600 font-bold">End</div>
            
            {result.predictions.retentionCurve.map((h, i) => (
              <div key={i} className="flex-1 bg-gradient-to-t from-rose-600/20 to-rose-500 rounded-t-sm transition-all duration-1000" style={{ height: \`\${Math.max(5, h)}%\` }}></div>
            ))}
            
            <div className="absolute top-1/2 left-1/3 bg-zinc-800 text-zinc-200 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-zinc-700 shadow-xl whitespace-nowrap transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-1">
              <Target className="w-3 h-3 text-rose-500" /> Drop-off: {result.predictions.dropOffPoint}
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl flex flex-col items-center justify-center text-center">
            <div className="text-2xl font-black text-white mb-1">{result.predictions.viewsRange}</div>
            <div className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Expected Views</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl flex flex-col items-center justify-center text-center">
            <div className="text-2xl font-black text-white mb-1">{result.predictions.engagementProbability}</div>
            <div className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Engagement</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl flex flex-col items-center justify-center text-center">
            <div className="text-lg font-black text-white mb-1">{result.predictions.sharePotential}</div>
            <div className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Share Potential</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl flex flex-col items-center justify-center text-center">
            <div className="text-lg font-black text-white mb-1">{result.predictions.savePotential}</div>
            <div className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Save Potential</div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-zinc-950 via-zinc-950 to-transparent pt-12">
        <div className="max-w-md mx-auto">
          <button onClick={onNext} className="w-full bg-white text-black font-black py-4 rounded-2xl text-lg transition-transform active:scale-95 flex items-center justify-center gap-2">
            Next: Creator DNA <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function CreatorDNA({ result, onNext }: { result: VideoIntelligenceResult, onNext: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex-1 flex flex-col p-6 overflow-y-auto pb-32"
    >
      <div className="text-center mb-8 mt-4">
        <h2 className="text-2xl font-black text-white">🧬 Your Creator Profile</h2>
        <p className="text-zinc-400 text-sm mt-1">Based on video analysis patterns</p>
      </div>

      <div className="space-y-4">
        <div className="bg-emerald-950/20 border border-emerald-900/30 p-5 rounded-3xl">
          <h3 className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Check className="w-4 h-4" /> Strengths
          </h3>
          <ul className="space-y-3">
            {result.creatorDNA.strengths.map((s, i) => (
              <li key={i} className="text-sm font-medium text-emerald-100 flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">•</span> {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-rose-950/20 border border-rose-900/30 p-5 rounded-3xl">
          <h3 className="text-xs font-black text-rose-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <X className="w-4 h-4" /> Weaknesses
          </h3>
          <ul className="space-y-3">
            {result.creatorDNA.weaknesses.map((w, i) => (
              <li key={i} className="text-sm font-medium text-rose-100 flex items-start gap-2">
                <span className="text-rose-500 mt-0.5">•</span> {w}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl">
          <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Brain className="w-4 h-4" /> Behavior Patterns
          </h3>
          <ul className="space-y-3">
            {result.creatorDNA.patterns.map((p, i) => (
              <li key={i} className="text-sm font-medium text-zinc-200 flex items-start gap-2">
                <span className="text-zinc-500 mt-0.5">•</span> {p}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-zinc-950 via-zinc-950 to-transparent pt-12">
        <div className="max-w-md mx-auto">
          <button onClick={onNext} className="w-full bg-rose-600 hover:bg-rose-500 text-white font-black py-4 rounded-2xl text-lg transition-transform active:scale-95 shadow-[0_0_30px_rgba(225,29,72,0.3)] flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" /> Improve This Video
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function OptimizationPlan({ result, onReset }: { result: VideoIntelligenceResult, onReset: () => void }) {
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionResults, setActionResults] = useState<Record<string, string[]>>({});
  const [highlightedAction, setHighlightedAction] = useState<string | null>(null);

  const handleAction = async (actionName: string) => {
    if (actionResults[actionName] || actionLoading) {
      if (actionResults[actionName]) {
        document.getElementById(\`action-result-\${actionName.replace(/\\s+/g, '-')}\`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setHighlightedAction(actionName);
        setTimeout(() => setHighlightedAction(null), 2000);
      }
      return;
    }
    
    setActionLoading(actionName);
    
    setTimeout(() => {
      document.getElementById('action-loading-indicator')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);

    try {
      const res = await executeQuickAction(actionName, "Video Content", "General", 'TikTok/Reels');
      setActionResults(prev => ({ ...prev, [actionName]: res }));
      
      setTimeout(() => {
        document.getElementById(\`action-result-\${actionName.replace(/\\s+/g, '-')}\`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setHighlightedAction(actionName);
        setTimeout(() => setHighlightedAction(null), 2000);
      }, 100);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const quickActions = [
    { id: 'Fix My Hook', icon: '🔥' },
    { id: 'Increase Retention', icon: '🎯' },
    { id: 'Upgrade Visuals', icon: '🎬' },
    { id: 'Fix Audio Strategy', icon: '🔊' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 flex flex-col p-6 overflow-y-auto pb-32"
    >
      <div className="text-center mb-8 mt-4">
        <h2 className="text-2xl font-black text-white">🚀 Optimization Plan</h2>
        <p className="text-zinc-400 text-sm mt-1">Make it perform better instantly</p>
      </div>

      <div className="space-y-8">
        {/* Quick Actions */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map(action => (
              <button 
                key={action.id}
                onClick={() => handleAction(action.id)}
                disabled={!!actionLoading}
                className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all active:scale-95"
              >
                <span className="text-2xl">{action.icon}</span>
                <span className="text-xs font-bold text-zinc-200 text-center">{action.id}</span>
              </button>
            ))}
          </div>
          
          {/* Action Results Area */}
          <div id="action-results-container">
            {Object.entries(actionResults).map(([actionName, res]) => (
              <motion.div 
                id={\`action-result-\${actionName.replace(/\\s+/g, '-')}\`}
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                key={actionName} 
                className={cn(
                  "p-5 rounded-3xl mt-3 relative transition-all duration-500 border",
                  highlightedAction === actionName 
                    ? "bg-rose-500/20 border-rose-400 shadow-[0_0_20px_rgba(225,29,72,0.4)]" 
                    : "bg-zinc-900 border-zinc-800"
                )}
              >
                <button onClick={() => setActionResults(p => { const n = {...p}; delete n[actionName]; return n; })} className="absolute top-4 right-4 text-zinc-500 hover:text-rose-400"><X className="w-4 h-4"/></button>
                <div className="flex items-center justify-between mb-4 pr-6">
                  <div className="text-xs font-black text-rose-400 uppercase tracking-widest">{actionName}</div>
                  {highlightedAction === actionName && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      className="text-[10px] font-bold text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded-full flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" /> ✨ Updated
                    </motion.div>
                  )}
                </div>
                <ul className="space-y-3">
                  {(res as string[]).map((r, i) => (
                    <li key={i} className="text-sm text-zinc-200 font-medium flex items-start gap-3">
                      <span className="text-rose-500 mt-0.5">•</span> <span className="leading-relaxed">{r}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
            {actionLoading && (
              <div id="action-loading-indicator" className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl mt-3 flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-bold text-zinc-400">Optimizing your content...</span>
              </div>
            )}
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest">Detailed Fixes</h3>
          
          {Object.entries(result.optimizationPlan).map(([key, plan]) => {
            const labels: Record<string, string> = {
              openingImpact: 'Opening Impact',
              textOverlayStrategy: 'Text Overlay Strategy',
              soundSelection: 'Sound Selection',
              narrativeFlow: 'Narrative Flow',
              visualAttentionDesign: 'Visual Attention Design',
              trendCompatibility: 'Trend Compatibility',
              audienceTrigger: 'Audience Trigger'
            };
            return (
              <div key={key} className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl space-y-4">
                <div className="text-sm font-black text-white">{labels[key]}</div>
                <div className="grid gap-3">
                  <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800/50">
                    <span className="text-[10px] font-black text-rose-500 uppercase block mb-1">What's Wrong</span>
                    <span className="text-sm text-zinc-300 font-medium leading-relaxed">{plan.issue}</span>
                  </div>
                  <div className="bg-emerald-950/20 p-4 rounded-2xl border border-emerald-900/30">
                    <span className="text-[10px] font-black text-emerald-500 uppercase block mb-1">Quick Fix</span>
                    <span className="text-sm text-emerald-100 font-medium leading-relaxed">{plan.fix}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-zinc-950 via-zinc-950 to-transparent pt-12">
        <div className="max-w-md mx-auto">
          <button onClick={onReset} className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-black py-4 rounded-2xl text-lg transition-transform active:scale-95 flex items-center justify-center gap-2">
            <RotateCcw className="w-5 h-5" /> Analyze Another Video
          </button>
        </div>
      </div>
    </motion.div>
  );
}
`

fs.writeFileSync('src/App.tsx', code);
console.log('App.tsx rewritten');
