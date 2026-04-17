import React, { useState, useRef, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Video, ArrowLeft, Upload, Play, Pause, Eye, MousePointerClick, 
  TrendingUp, Share2, Brain, CheckCircle2, Clapperboard, Clock, 
  BarChart3, Rocket, X, Lock, Check, ShieldCheck, Sparkles, Zap, 
  Flame, AlertTriangle, Target, Activity, Compass, History, 
  UserCheck, ShieldAlert, Gauge, Gavel, RefreshCw, Wand2, Info
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useSubscription } from '../contexts/SubscriptionContext';
import { analyzeVideoIntelligence, AnalysisResult } from '../lib/gemini';
import { Footer } from './Footer';
import { Step } from '../types';

export const DeepAnalysisView = memo(({ onBack, onLegalClick }: { onBack: () => void, onLegalClick: (s: Step) => void }) => {
  const { isPro, setShowUpgradeModal, checkLimit, incrementUsage } = useSubscription();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState<'upload' | 'analyzing' | 'scroll_test' | 'loading_results' | 'results'>('upload');
  const [loadingStep, setLoadingStep] = useState(0);
  const [scrollTestResult, setScrollTestResult] = useState<'keep' | 'scroll' | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const [isFetchingAnalysis, setIsFetchingAnalysis] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if ((stage === 'results' || stage === 'loading_results') && videoFile && !analysisData && !isFetchingAnalysis) {
      const fetchAnalysis = async () => {
        setIsFetchingAnalysis(true);
        try {
          const reader = new FileReader();
          reader.readAsDataURL(videoFile);
          reader.onload = async () => {
            const base64Data = (reader.result as string).split(',')[1];
            const data = await analyzeVideoIntelligence(base64Data, videoFile.type, []);
            setAnalysisData(data);
            incrementUsage();
          };
        } catch (e) {
          console.error("Failed to fetch deep analysis:", e);
        } finally {
          setIsFetchingAnalysis(false);
        }
      };
      fetchAnalysis();
    }
  }, [stage, videoFile, analysisData, isFetchingAnalysis]);

  useEffect(() => {
    if (stage === 'loading_results') {
      const interval = setInterval(() => {
        setLoadingStep(prev => (prev < 4 ? prev + 1 : prev));
      }, 800);

      // Minimum duration of 3.5s, but wait for analysisData to be ready
      const timeout = setTimeout(() => {
        if (analysisData) {
          setStage('results');
        }
      }, 3500);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [stage, analysisData]);

  // If analysisData becomes ready after the minimum timeout, transition then
  useEffect(() => {
    if (stage === 'loading_results' && analysisData && loadingStep >= 4) {
      const finalTransition = setTimeout(() => {
        setStage('results');
      }, 500);
      return () => clearTimeout(finalTransition);
    }
  }, [stage, analysisData, loadingStep]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!checkLimit()) return;

    if (!file.type.startsWith('video/')) {
      setError('This feature only works with video uploads');
      return;
    }
    
    setError(null);
    setVideoFile(file);
    setVideoUrl(URL.createObjectURL(file));
    setStage('analyzing');
    
    setTimeout(() => {
      setStage('scroll_test');
    }, 2000);
  };

  const handleScrollTest = (action: 'keep' | 'scroll') => {
    setScrollTestResult(action);
    setStage('loading_results');
  };

  const renderLockedOverlay = (title: string, description: string) => (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-zinc-950/60 backdrop-blur-sm p-6 text-center rounded-3xl">
      <Lock className="w-6 h-6 text-rose-500 mb-2" />
      <p className="text-xs font-black text-zinc-100 mb-1 uppercase tracking-tight">{title}</p>
      <p className="text-[10px] text-zinc-400 mb-4 max-w-[180px]">{description}</p>
      <button 
        onClick={() => setShowUpgradeModal(true)}
        className="bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest transition-all"
      >
        Upgrade to Pro
      </button>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="flex-1 flex flex-col p-6 pt-12 transform-gpu"
    >
      <button 
        onClick={onBack}
        className="absolute top-6 left-6 text-zinc-500 hover:text-zinc-300 transition-colors z-[60] outline-none"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      {stage === 'upload' && (
        <div className="flex-1 flex flex-col items-center justify-center text-center transform-gpu">
          <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mb-6 border border-rose-500/20 transform-gpu">
            <Video className="w-8 h-8 text-rose-500" />
          </div>
          <h2 className="text-3xl font-black text-zinc-100 mb-4 tracking-tight transform-gpu">Viral Intelligence Engine</h2>
          <p className="text-zinc-400 text-sm mb-8 max-w-xs leading-relaxed font-medium">
            Predict performance, detect viral gaps, and optimize your content for maximum reach.
          </p>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="video/*" 
            onChange={handleFileChange} 
          />
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full max-w-xs bg-zinc-900 border-2 border-dashed border-zinc-700 hover:border-rose-500/50 rounded-[2.5rem] p-10 flex flex-col items-center justify-center gap-4 transition-all group shadow-2xl transform-gpu outline-none"
          >
            <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center group-hover:bg-rose-500/10 transition-colors transform-gpu">
              <Upload className="w-6 h-6 text-zinc-500 group-hover:text-rose-400" />
            </div>
            <span className="text-sm font-bold text-zinc-300">Select Video File</span>
          </button>
          
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-rose-500 text-sm font-medium">
              {error}
            </motion.div>
          )}
        </div>
      )}

      {stage === 'analyzing' && (
        <div className="flex-1 flex flex-col items-center justify-center text-center transform-gpu">
          <div className="relative transform-gpu">
            <div className="w-20 h-20 border-4 border-zinc-800 border-t-rose-500 rounded-full animate-spin mb-8 transform-gpu"></div>
            <Brain className="w-8 h-8 text-rose-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse transform-gpu" />
          </div>
          <h3 className="text-2xl font-black text-zinc-100 mb-2 transform-gpu">Analyzing Creator DNA...</h3>
          <p className="text-zinc-400 text-sm max-w-[200px] font-medium">Extracting visual hooks, pacing, and algorithm triggers</p>
        </div>
      )}

      {stage === 'scroll_test' && (
        <div className="flex-1 flex flex-col items-center justify-center transform-gpu">
          <div className="text-center mb-8 transform-gpu">
            <h3 className="text-2xl font-black text-zinc-100 mb-2">Scroll Test Simulation</h3>
            <p className="text-zinc-400 text-sm font-medium">Be honest: would you keep watching or scroll?</p>
          </div>
          <div className="relative w-full max-w-sm aspect-[9/16] bg-black rounded-[2.5rem] overflow-hidden border border-zinc-800 shadow-2xl mb-8 transform-gpu">
            {videoUrl && (
              <video 
                ref={videoRef}
                src={videoUrl} 
                className="w-full h-full object-cover"
                autoPlay 
                muted 
                playsInline
                onTimeUpdate={(e) => {
                  if (e.currentTarget.currentTime >= 3) {
                    e.currentTarget.pause();
                  }
                }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8 transform-gpu">
              <div className="flex gap-3 transform-gpu">
                <button 
                  onClick={() => handleScrollTest('keep')}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-emerald-900/20 outline-none transform-gpu"
                >
                  <Eye className="w-5 h-5" /> Keep
                </button>
                <button 
                  onClick={() => handleScrollTest('scroll')}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 border border-zinc-700 outline-none transform-gpu"
                >
                  <MousePointerClick className="w-5 h-5" /> Scroll
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {stage === 'loading_results' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-zinc-950/80 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center transform-gpu"
        >
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] shadow-2xl flex flex-col items-center gap-6 max-w-[320px] w-full relative overflow-hidden transform-gpu">
            {/* Background Glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-rose-500/10 blur-[60px] rounded-full transform-gpu" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-rose-500/10 blur-[60px] rounded-full transform-gpu" />

            <div className="relative transform-gpu">
              <div className="w-16 h-16 border-2 border-rose-500/20 rounded-full animate-ping absolute inset-0 transform-gpu" />
              <div className="w-16 h-16 border-2 border-rose-500 rounded-full flex items-center justify-center relative bg-zinc-900 transform-gpu">
                <Sparkles className="w-8 h-8 text-rose-500 animate-pulse transform-gpu" />
              </div>
            </div>

            <div className="space-y-2 transform-gpu">
              <h4 className="text-lg font-black text-zinc-100 uppercase tracking-tight transform-gpu">Analyzing Your Content</h4>
              <p className="text-[10px] text-zinc-500 leading-relaxed font-bold uppercase tracking-widest">Our AI is running deep viral analysis. This takes a few seconds...</p>
            </div>

            <div className="w-full space-y-4 pt-4 border-t border-zinc-800/50 transform-gpu">
              <div className="space-y-2 transform-gpu">
                <AnimatePresence mode="wait">
                  <motion.p 
                    key={loadingStep}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="text-[10px] font-black text-rose-500 uppercase tracking-widest transform-gpu"
                  >
                    {[
                      "Analyzing your hook...",
                      "Simulating audience behavior...",
                      "Detecting viral patterns...",
                      "Calculating performance score...",
                      "Finalizing report..."
                    ][loadingStep]}
                  </motion.p>
                </AnimatePresence>
                <div className="flex items-center justify-center gap-2 transform-gpu">
                  <div className="h-1 flex-1 bg-zinc-800 rounded-full overflow-hidden transform-gpu">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(loadingStep + 1) * 20}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-rose-500 transform-gpu"
                    />
                  </div>
                  <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest shrink-0">Step {loadingStep + 1}/5</span>
                </div>
              </div>

              <div className="pt-4 transform-gpu">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={loadingStep}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-zinc-950/50 p-3 rounded-2xl border border-zinc-800/50 transform-gpu"
                  >
                    <span className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em] block mb-1">Micro Insight</span>
                    <p className="text-[10px] text-zinc-400 font-medium leading-relaxed">
                      {[
                        "Strong hooks increase retention by up to 70%",
                        "First 3 seconds decide scroll behavior",
                        "Visual contrast triggers algorithm attention",
                        "High replay value is the key to massive reach",
                        "Consistency in pacing keeps viewers locked in"
                      ][loadingStep]}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {stage === 'results' && (
        <div className="flex-1 flex flex-col pb-8 overflow-y-auto h-full relative scroll-smooth no-scrollbar transform-gpu">
          {/* 1. CONTENT PREVIEW (TOP) */}
          <div className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-md pb-4 mb-6 border-b border-zinc-900 transform-gpu">
             <div className="flex items-center justify-between mb-4 transform-gpu">
                 <div className="flex items-center gap-2 transform-gpu">
                    <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse transform-gpu" />
                    <h2 className="text-lg font-black text-zinc-100 uppercase tracking-tighter transform-gpu">Viral Intelligence</h2>
                 </div>
                 {isFetchingAnalysis && <RefreshCw className="w-4 h-4 text-rose-500 animate-spin transform-gpu" />}
             </div>
             <div className="w-full h-40 bg-black rounded-3xl overflow-hidden border border-zinc-800 flex items-center justify-center relative shadow-inner transform-gpu">
               {videoUrl && <video src={videoUrl} className="w-full h-full object-contain transform-gpu" controls />}
             </div>
          </div>

          <div className="space-y-8 transform-gpu">
            {/* 2. VIRAL SCORE (HERO SECTION) */}
            <section className="text-center py-4 transform-gpu">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-block relative transform-gpu"
              >
                <div className="text-6xl font-black text-white tracking-tighter mb-1 transform-gpu">
                  {analysisData ? (analysisData.score / 10).toFixed(1) : "?.?"}
                  <span className="text-2xl text-zinc-500 ml-1">/10</span>
                </div>
                <div className="text-xs font-black text-rose-500 uppercase tracking-[0.2em] transform-gpu">Viral Potential</div>
              </motion.div>

              <div className="grid grid-cols-2 gap-3 mt-8 transform-gpu">
                {[
                  { label: 'Hook Strength', val: analysisData?.score_breakdown?.hook_strength || 0, icon: Zap, color: 'text-amber-400' },
                  { label: 'Retention', val: analysisData?.score_breakdown?.engagement_potential || 0, icon: Activity, color: 'text-emerald-400' },
                  { label: 'Shareability', val: analysisData?.score_breakdown?.trend_alignment || 0, icon: Share2, color: 'text-blue-400' },
                  { label: 'Trend Match', val: analysisData?.score_breakdown?.clarity || 0, icon: Flame, color: 'text-rose-400' },
                ].map((item, i) => (
                  <div key={i} className="bg-zinc-900/50 border border-zinc-800 p-3 rounded-2xl flex flex-col items-center transform-gpu">
                    <item.icon className={cn("w-4 h-4 mb-2", item.color)} />
                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{item.label}</div>
                    <div className="text-sm font-black text-white">
                      {(item.val / 10).toFixed(1)}
                      <span className="text-[10px] text-zinc-500 ml-0.5">/10</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 3. FIRST 3 SECONDS ANALYZER */}
            <section className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] relative overflow-hidden transform-gpu">
              <h3 className="text-sm font-black text-zinc-100 uppercase tracking-widest mb-4 flex items-center gap-2 transform-gpu">
                <Clock className="w-4 h-4 text-rose-500" /> First 3s Analyzer
              </h3>
              <div className="space-y-4 transform-gpu">
                <div className="flex items-center justify-between transform-gpu">
                  <span className="text-xs font-bold text-zinc-400">Hook Status</span>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                    analysisData?.first_3s_analysis?.status === 'Strong' ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                    analysisData?.first_3s_analysis?.status === 'Average' ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                    "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                  )}>
                    {analysisData?.first_3s_analysis?.status || "Analyzing..."}
                  </span>
                </div>
                <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800/50 transform-gpu">
                  <p className="text-xs text-zinc-300 font-medium leading-relaxed">
                    {analysisData?.first_3s_analysis?.issue || "Detecting hook issues..."}
                  </p>
                </div>
                
                {!isPro && renderLockedOverlay("Pro Insight Locked", "Get detailed explanation + improvement suggestions.")}
                
                {isPro && analysisData?.first_3s_analysis?.pro_tip && (
                  <div className="mt-4 p-4 bg-rose-500/5 border border-rose-500/20 rounded-2xl transform-gpu">
                    <div className="flex items-center gap-2 mb-2 transform-gpu">
                      <Sparkles className="w-3 h-3 text-rose-500" />
                      <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Pro Tip</span>
                    </div>
                    <p className="text-xs text-zinc-300 italic">"{analysisData.first_3s_analysis.pro_tip}"</p>
                  </div>
                )}
              </div>
            </section>

            {/* 4. SCROLL-STOPPING POWER (RETENTION GRAPH) */}
            <section className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] relative overflow-hidden">
              <div className="mb-6">
                <h3 className="text-sm font-black text-zinc-100 uppercase tracking-widest mb-1 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-400" /> Scroll-Stopping Power
                </h3>
                <p className="text-[10px] text-zinc-500 font-medium">Shows how long viewers are likely to stay before scrolling.</p>
              </div>
              
              <div className="relative h-32 w-full flex items-end gap-1 px-2">
                {isFetchingAnalysis && !analysisData ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/20 backdrop-blur-[1px] z-10">
                    <div className="w-8 h-8 border-2 border-zinc-800 border-t-blue-500 rounded-full animate-spin mb-2" />
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Simulating viewer behavior...</span>
                  </div>
                ) : null}

                {(analysisData?.retention_graph || [100, 85, 70, 55, 40, 30, 20, 15, 10]).map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                    <div 
                      className={cn(
                        "w-full rounded-t-lg transition-all duration-500",
                        !isPro && i > 3 ? "bg-zinc-800/50" : "bg-gradient-to-t from-blue-600 to-blue-400"
                      )}
                      style={{ height: `${val}%` }}
                    />
                    <span className="text-[8px] font-bold text-zinc-600">{i}s</span>
                    
                    {/* Highlight major drop point */}
                    {i === 2 && val < 80 && (
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                        <div className="bg-rose-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded animate-bounce">
                          MAJOR DROP
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {!isPro && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-950/40 to-zinc-950/80 backdrop-blur-[2px] flex items-center justify-end pr-8">
                    <div className="text-right">
                      <Lock className="w-4 h-4 text-rose-500 ml-auto mb-1" />
                      <p className="text-[10px] font-black text-white uppercase tracking-widest">Full Graph Locked</p>
                      <button onClick={() => setShowUpgradeModal(true)} className="text-[8px] text-rose-400 font-bold underline">Upgrade</button>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-zinc-800/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Attention Level</span>
                    <span className={cn(
                      "text-sm font-black uppercase tracking-tight",
                      (analysisData?.retention_graph?.[3] || 55) > 70 ? "text-emerald-400" :
                      (analysisData?.retention_graph?.[3] || 55) > 40 ? "text-amber-400" : "text-rose-400"
                    )}>
                      {(analysisData?.retention_graph?.[3] || 55) > 70 ? "High Attention" :
                       (analysisData?.retention_graph?.[3] || 55) > 40 ? "Medium Attention" : "Low Attention"}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Key Insight</span>
                    <p className="text-[10px] text-zinc-300 font-bold">
                      {(analysisData?.retention_graph?.[2] || 70) < 80 ? "Viewer drop at 2s due to weak hook" : "Strong initial hook retention"}
                    </p>
                  </div>
                </div>
              </div>

              {isPro && analysisData?.audience_drop_insights && (
                <div className="mt-6 space-y-3">
                  {analysisData.audience_drop_insights.map((insight, i) => (
                    <div key={i} className="flex items-start gap-3 bg-zinc-950 p-3 rounded-xl border border-zinc-800/50">
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Drop at {insight.point}</div>
                        <p className="text-[11px] text-zinc-400 leading-relaxed">{insight.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* 5. ALGORITHM TRIGGER CHECK */}
            <section className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] relative overflow-hidden">
              <h3 className="text-sm font-black text-zinc-100 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-400" /> Algorithm Trigger Check
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { label: 'Curiosity Gap', active: analysisData?.algorithm_triggers?.curiosity_gap },
                  { label: 'Loop Potential', active: analysisData?.algorithm_triggers?.loop_potential },
                  { label: 'Engagement Triggers', active: analysisData?.algorithm_triggers?.engagement_triggers },
                ].map((trigger, i) => (
                  <div key={i} className="flex items-center justify-between bg-zinc-950 p-4 rounded-2xl border border-zinc-800/50">
                    <span className="text-xs font-bold text-zinc-300">{trigger.label}</span>
                    {trigger.active ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <X className="w-5 h-5 text-zinc-700" />
                    )}
                  </div>
                ))}
              </div>
              {!isPro && renderLockedOverlay("Trigger Breakdown Locked", "See how the algorithm will react and how to fix missing triggers.")}
              {isPro && analysisData?.algorithm_triggers?.details && (
                <div className="mt-4 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                  <p className="text-xs text-zinc-300 leading-relaxed">{analysisData.algorithm_triggers.details}</p>
                </div>
              )}
            </section>

            {/* 6. VIRAL GAP DETECTOR */}
            <section className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] relative overflow-hidden">
              <h3 className="text-sm font-black text-zinc-100 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-400" /> Viral Gap Detector
              </h3>
              <p className="text-[10px] text-zinc-500 mb-4">Compared with top 1% creators in your niche</p>
              <div className="space-y-2">
                {(analysisData?.viral_gaps || ["Missing curiosity gap", "Slow pacing in middle", "Weak call to action"]).map((gap, i) => (
                  <div key={i} className={cn(
                    "flex items-center gap-3 bg-zinc-950 p-3 rounded-xl border border-zinc-800/50",
                    !isPro && i > 0 && "blur-[2px] opacity-30 select-none"
                  )}>
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                    <span className="text-xs text-zinc-300 font-medium">{gap}</span>
                  </div>
                ))}
              </div>
              {!isPro && (
                <div className="mt-4 text-center">
                  <button onClick={() => setShowUpgradeModal(true)} className="text-[10px] font-black text-rose-400 uppercase tracking-widest hover:underline">Unlock {analysisData?.viral_gaps?.length ? analysisData.viral_gaps.length - 1 : 2} more gaps</button>
                </div>
              )}
            </section>

            {/* 7. TREND TIMING WINDOW */}
            <section className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] relative overflow-hidden">
              <h3 className="text-sm font-black text-zinc-100 uppercase tracking-widest mb-4 flex items-center gap-2">
                <History className="w-4 h-4 text-indigo-400" /> Trend Timing Window
              </h3>
              <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Verdict</span>
                  <span className={cn(
                    "text-lg font-black uppercase tracking-tighter",
                    analysisData?.trend_timing?.status === 'Post Now' ? "text-emerald-400" :
                    analysisData?.trend_timing?.status === 'Wait' ? "text-amber-400" : "text-rose-400"
                  )}>
                    {analysisData?.trend_timing?.status || "Analyzing..."}
                  </span>
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-zinc-800 flex items-center justify-center relative">
                  <span className="text-xs font-black text-white">{analysisData?.trend_timing?.score || 0}</span>
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle 
                      cx="24" cy="24" r="22" 
                      fill="none" stroke="currentColor" 
                      strokeWidth="2" 
                      className="text-zinc-800"
                    />
                    <circle 
                      cx="24" cy="24" r="22" 
                      fill="none" stroke="currentColor" 
                      strokeWidth="2" 
                      strokeDasharray={138}
                      strokeDashoffset={138 - (138 * (analysisData?.trend_timing?.score || 0) / 10)}
                      className="text-indigo-500 transition-all duration-1000"
                    />
                  </svg>
                </div>
              </div>
              {!isPro && renderLockedOverlay("Timing Reasoning Locked", "Get detailed reasoning and optimal posting hours.")}
              {isPro && analysisData?.trend_timing?.reasoning && (
                <p className="text-xs text-zinc-400 leading-relaxed italic">"{analysisData.trend_timing.reasoning}"</p>
              )}
            </section>

            {/* 8. PERFORMANCE FORECAST */}
            <section className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] relative overflow-hidden">
              <h3 className="text-sm font-black text-zinc-100 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Gauge className="w-4 h-4 text-rose-500" /> Performance Forecast
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { label: 'Expected Views', val: analysisData?.performance_forecast_detailed?.views || '...', icon: Eye },
                  { label: 'Engagement Rate', val: analysisData?.performance_forecast_detailed?.engagement_rate || '...', icon: MousePointerClick },
                  { label: 'Watch Time', val: analysisData?.performance_forecast_detailed?.watch_time || '...', icon: Clock },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between bg-zinc-950 p-4 rounded-2xl border border-zinc-800/50">
                    <div className="flex items-center gap-3">
                      <item.icon className="w-4 h-4 text-zinc-500" />
                      <span className="text-xs font-bold text-zinc-400">{item.label}</span>
                    </div>
                    <span className="text-sm font-black text-white">{item.val}</span>
                  </div>
                ))}
              </div>
              {!isPro && renderLockedOverlay("Detailed Metrics Locked", "Unlock precise view ranges and engagement predictions.")}
              {isPro && analysisData?.performance_forecast_detailed?.details && (
                <div className="mt-4 p-4 bg-zinc-950 rounded-2xl border border-zinc-800/50">
                   <p className="text-[11px] text-zinc-400 leading-relaxed">{analysisData.performance_forecast_detailed.details}</p>
                </div>
              )}
            </section>

            {/* 9. CONTENT ROI SCORE */}
            <section className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] relative overflow-hidden">
              <h3 className="text-sm font-black text-zinc-100 uppercase tracking-widest mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" /> Content ROI Score
              </h3>
              <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800/50 mb-4">
                <div className={cn(
                  "text-lg font-black uppercase tracking-tighter mb-1",
                  analysisData?.roi_score?.status === 'High Return' ? "text-emerald-400" : "text-amber-400"
                )}>
                  {analysisData?.roi_score?.status || "Calculating..."}
                </div>
                <p className="text-[10px] text-zinc-500 uppercase font-bold">Effort vs. Expected Result</p>
              </div>
              {!isPro && renderLockedOverlay("ROI Analysis Locked", "Understand why this content is high or low return.")}
              {isPro && analysisData?.roi_score?.reasoning && (
                <p className="text-xs text-zinc-400 leading-relaxed">{analysisData.roi_score.reasoning}</p>
              )}
            </section>

            {/* 10. AUDIENCE TYPE DETECTOR */}
            <section className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] relative overflow-hidden">
              <h3 className="text-sm font-black text-zinc-100 uppercase tracking-widest mb-4 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-400" /> Audience Type Detector
              </h3>
              <div className="flex gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {analysisData?.audience_type?.primary || "..."}
                </span>
                <span className="px-3 py-1 bg-zinc-800 text-zinc-400 border border-zinc-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {analysisData?.audience_type?.secondary || "..."}
                </span>
              </div>
              {!isPro && renderLockedOverlay("Audience Breakdown Locked", "See exactly who will engage and who will ignore.")}
              {isPro && analysisData?.audience_type?.details && (
                <p className="text-xs text-zinc-400 leading-relaxed">{analysisData.audience_type.details}</p>
              )}
            </section>

            {/* 11. REPLAY VALUE SCORE */}
            <section className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] relative overflow-hidden">
              <h3 className="text-sm font-black text-zinc-100 uppercase tracking-widest mb-4 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-rose-400" /> Replay Value Score
              </h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full transition-all duration-1000",
                      analysisData?.replay_value?.score === 'High' ? "w-full bg-emerald-500" :
                      analysisData?.replay_value?.score === 'Medium' ? "w-2/3 bg-amber-500" : "w-1/3 bg-rose-500"
                    )}
                  />
                </div>
                <span className="text-xs font-black text-white uppercase tracking-widest">{analysisData?.replay_value?.score || "..." }</span>
              </div>
              {!isPro && renderLockedOverlay("Replay Analysis Locked", "Understand the factors driving rewatch potential.")}
              {isPro && analysisData?.replay_value?.reasoning && (
                <p className="text-xs text-zinc-400 leading-relaxed italic">"{analysisData.replay_value.reasoning}"</p>
              )}
            </section>

            {/* 12. RISK CHECK */}
            <section className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] relative overflow-hidden">
              <h3 className="text-sm font-black text-zinc-100 uppercase tracking-widest mb-4 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-500" /> Risk Check
              </h3>
              <div className="space-y-3">
                {(analysisData?.risk_check || ["Overused hook style", "Weak lighting", "Risky structure"]).map((risk, i) => (
                  <div key={i} className={cn(
                    "flex items-center gap-3 bg-zinc-950 p-3 rounded-xl border border-zinc-800/50",
                    !isPro && i > 0 && "blur-[2px] opacity-30 select-none"
                  )}>
                    <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                    <span className="text-xs text-zinc-300 font-medium">{risk}</span>
                  </div>
                ))}
              </div>
              {!isPro && (
                <div className="mt-4 text-center">
                  <button onClick={() => setShowUpgradeModal(true)} className="text-[10px] font-black text-rose-400 uppercase tracking-widest hover:underline">Unlock {analysisData?.risk_check?.length ? analysisData.risk_check.length - 1 : 2} more risks</button>
                </div>
              )}
            </section>

            {/* 13. VIRALITY CONFIDENCE METER */}
            <section className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] relative overflow-hidden">
              <h3 className="text-sm font-black text-zinc-100 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Gauge className="w-4 h-4 text-emerald-400" /> Virality Confidence
              </h3>
              <div className="relative h-4 bg-zinc-950 rounded-full border border-zinc-800 overflow-hidden mb-4">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${analysisData?.virality_confidence?.level || 0}%` }}
                  className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] font-black text-white drop-shadow-md">{analysisData?.virality_confidence?.level || 0}% Confidence</span>
                </div>
              </div>
              {!isPro && renderLockedOverlay("Confidence Reasoning Locked", "Get a detailed breakdown of why we are confident.")}
              {isPro && analysisData?.virality_confidence?.reasoning && (
                <p className="text-xs text-zinc-400 leading-relaxed">{analysisData.virality_confidence.reasoning}</p>
              )}
            </section>

            {/* 14. FINAL VERDICT (VERY IMPORTANT) */}
            <section className="bg-zinc-900 border-2 border-rose-500/30 p-8 rounded-[2.5rem] relative overflow-hidden shadow-2xl shadow-rose-900/10">
              <div className="absolute top-0 right-0 p-4">
                <Gavel className="w-8 h-8 text-rose-500/20" />
              </div>
              <h3 className="text-xs font-black text-rose-500 uppercase tracking-[0.3em] mb-6">Final Verdict</h3>
              
              <div className={cn(
                "text-3xl font-black uppercase tracking-tighter mb-4",
                analysisData?.final_verdict?.status === 'Post Now' ? "text-emerald-400" :
                analysisData?.final_verdict?.status === 'Improve Before Posting' ? "text-amber-400" : "text-rose-400"
              )}>
                {analysisData?.final_verdict?.status || "Deliberating..."}
              </div>

              {!isPro && renderLockedOverlay("Verdict Explanation Locked", "Unlock the full explanation and exact action steps to take.")}
              
              {isPro && (
                <div className="space-y-6">
                  <p className="text-sm text-zinc-300 leading-relaxed font-medium">
                    {analysisData?.final_verdict?.explanation}
                  </p>
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Action Steps:</h4>
                    {analysisData?.final_verdict?.action_steps?.map((step, i) => (
                      <div key={i} className="flex items-center gap-3 bg-zinc-950 p-3 rounded-xl border border-zinc-800/50">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span className="text-xs text-zinc-300 font-medium">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* 15. ACTION BUTTONS (END) */}
            <section className="pt-4 space-y-3">
              <button 
                onClick={() => isPro ? onBack() : setShowUpgradeModal(true)}
                className="w-full bg-zinc-100 hover:bg-white text-black font-black py-5 rounded-3xl shadow-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
              >
                <Zap className="w-5 h-5" />
                <span className="uppercase tracking-widest text-xs">Fix Hook Now</span>
              </button>
              <button 
                onClick={() => isPro ? onBack() : setShowUpgradeModal(true)}
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-black py-5 rounded-3xl border border-zinc-800 flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
              >
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <span className="uppercase tracking-widest text-xs">Improve Retention</span>
              </button>
              <button 
                onClick={() => isPro ? onBack() : setShowUpgradeModal(true)}
                className="w-full bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-black py-5 rounded-3xl shadow-xl shadow-rose-900/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
              >
                <Wand2 className="w-5 h-5" />
                <span className="uppercase tracking-widest text-xs">Make It Viral 🚀</span>
              </button>
            </section>
          </div>
        </div>
      )}
      <Footer onLegalClick={onLegalClick} />
    </motion.div>
  );
});

DeepAnalysisView.displayName = 'DeepAnalysisView';
