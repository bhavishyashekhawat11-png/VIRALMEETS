const fs = require('fs');

const code = fs.readFileSync('src/App.tsx', 'utf8');

const startIdx = code.indexOf('function ResultView({ result, idea, onReset, onRematch, bestScore, analysisStage, error }');
const endIdx = code.indexOf('function SwipeableHooks({ hooks }', startIdx);

if (startIdx === -1 || endIdx === -1) {
  console.error('Could not find boundaries');
  process.exit(1);
}

const newResultView = `
import { executeQuickAction } from './lib/gemini';

function ResultView({ result, idea, onReset, onRematch, bestScore, analysisStage, error }: { key?: string; result: AnalysisResult | Partial<AnalysisResult>; idea: string; onReset: () => void; onRematch: () => void; bestScore: number; analysisStage: 'quick' | 'detailed'; error?: string | null }) {
  const [activeTab, setActiveTab] = useState<'analysis' | 'optimization'>('analysis');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionResults, setActionResults] = useState<Record<string, string[]>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-emerald-400';
    if (score >= 5) return 'text-amber-400';
    return 'text-rose-500';
  };

  const getStatus = (score: number) => {
    if (score >= 8) return { label: '🔥 High viral potential', color: 'text-emerald-400' };
    if (score >= 5) return { label: '⚠️ Average potential - needs work', color: 'text-amber-400' };
    return { label: '📉 May struggle - weak hook', color: 'text-rose-500' };
  };

  const score = result.viralScore || 0;
  const status = getStatus(score);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const width = el.clientWidth;
    const scrollLeft = el.scrollLeft;
    if (scrollLeft < width / 2 && activeTab !== 'analysis') {
      setActiveTab('analysis');
    } else if (scrollLeft >= width / 2 && activeTab !== 'optimization') {
      setActiveTab('optimization');
    }
  };

  const scrollTo = (tab: 'analysis' | 'optimization') => {
    setActiveTab(tab);
    if (scrollRef.current) {
      const width = scrollRef.current.clientWidth;
      scrollRef.current.scrollTo({ left: tab === 'analysis' ? 0 : width, behavior: 'smooth' });
    }
  };

  const handleAction = async (actionName: string) => {
    if (actionResults[actionName] || actionLoading) return;
    setActionLoading(actionName);
    try {
      const res = await executeQuickAction(actionName, idea, result.contentNiche || 'General', 'TikTok/Reels');
      setActionResults(prev => ({ ...prev, [actionName]: res }));
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const quickActions = [
    { id: 'Fix My Hook', icon: '🔥' },
    { id: 'Make It More Viral', icon: '⚡' },
    { id: 'Increase Retention', icon: '🎯' },
    { id: 'Boost Engagement', icon: '📈' }
  ];

  const secondaryActions = [
    { id: 'Simplify Idea', icon: '💡' },
    { id: 'Upgrade Visuals', icon: '🎬' },
    { id: 'Fix Audio Strategy', icon: '🔊' },
    { id: 'Improve Story Flow', icon: '📖' },
    { id: 'Stronger Caption', icon: '🧲' },
    { id: 'Generate Hashtags', icon: '🏷' },
    { id: 'Add Loop Effect', icon: '🔁' },
    { id: 'Give Me Another Version', icon: '🧪' },
    { id: 'Make It Trend-Ready', icon: '🔥' },
    { id: 'Why This Might Fail', icon: '🧠' },
    { id: 'Target Audience Fix', icon: '🎯' },
    { id: 'Make It More Addictive', icon: '🔥' }
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-zinc-950">
      {/* Tabs */}
      <div className="flex justify-center gap-2 p-4 shrink-0 border-b border-zinc-900">
         <button onClick={() => scrollTo('analysis')} className={cn("px-6 py-2 rounded-full text-sm font-bold transition-all", activeTab === 'analysis' ? 'bg-rose-600 text-white shadow-[0_0_15px_rgba(225,29,72,0.4)]' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300')}>Analysis</button>
         <button onClick={() => scrollTo('optimization')} className={cn("px-6 py-2 rounded-full text-sm font-bold transition-all", activeTab === 'optimization' ? 'bg-rose-600 text-white shadow-[0_0_15px_rgba(225,29,72,0.4)]' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300')}>Optimization</button>
      </div>
      
      <div ref={scrollRef} className="flex-1 flex overflow-x-auto snap-x snap-mandatory hide-scrollbar" onScroll={handleScroll}>
        
        {/* Screen 1: Analysis */}
        <div className="min-w-full w-full h-full overflow-y-auto snap-center pb-40 px-4 pt-6 space-y-6">
          
          {/* User Input Display */}
          <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl">
            <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Your Idea</div>
            <p className="text-sm text-zinc-300 font-medium line-clamp-3">{idea}</p>
          </div>

          {/* Score Card */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 text-center relative overflow-hidden shadow-2xl flex flex-col items-center">
            <div className={cn("text-lg font-black tracking-tight mb-6", status.color)}>
              {status.label}
            </div>
            <div className={cn("text-8xl font-display font-black tracking-tighter mb-2", getScoreColor(score))}>
              {score.toFixed(1)}
            </div>
            <div className="text-zinc-500 text-sm font-bold uppercase tracking-widest mb-8">Viral Score</div>
            
            {analysisStage === 'quick' ? (
              <div className="w-full space-y-4 animate-pulse">
                <div className="h-12 bg-zinc-800/50 rounded-xl w-full"></div>
                <p className="text-zinc-500 text-xs font-bold mt-4">Analyzing deep metrics...</p>
              </div>
            ) : (
              <>
                {error && <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-bold py-3 px-4 rounded-xl w-full mb-6">{error}</div>}
                {result.wowMomentInsight && <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-bold py-3 px-4 rounded-xl w-full mb-6">{result.wowMomentInsight}</div>}
              </>
            )}
          </div>

          {analysisStage === 'detailed' && result.predictions && (
            <>
              {/* Niche & Hashtags */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
                  <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-1"><Target className="w-3 h-3"/> Content Niche</div>
                  <div className="text-sm font-bold text-zinc-200">{result.contentNiche}</div>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl overflow-hidden">
                  <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-1"><Flame className="w-3 h-3"/> Suggested Hashtags</div>
                  <div className="flex flex-wrap gap-1">
                    {result.suggestedHashtags?.slice(0,3).map(tag => (
                      <span key={tag} className="text-xs font-medium text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Performance Forecast */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-4">
                <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" /> Performance Forecast
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-zinc-950 border border-zinc-800/50 p-3 rounded-xl flex flex-col items-center justify-center">
                    <div className="text-xl font-black text-zinc-200">{result.predictions.viewsRange}</div>
                    <div className="text-[10px] uppercase tracking-wider font-bold text-zinc-500">Expected Views</div>
                  </div>
                  <div className="bg-zinc-950 border border-zinc-800/50 p-3 rounded-xl flex flex-col items-center justify-center">
                    <div className="text-xl font-black text-zinc-200">{result.predictions.engagementRateEstimate}</div>
                    <div className="text-[10px] uppercase tracking-wider font-bold text-zinc-500">Engagement</div>
                  </div>
                  <div className="bg-zinc-950 border border-zinc-800/50 p-3 rounded-xl flex flex-col items-center justify-center">
                    <div className="text-sm font-black text-zinc-200">{result.predictions.sharePotential}</div>
                    <div className="text-[10px] uppercase tracking-wider font-bold text-zinc-500">Share Potential</div>
                  </div>
                  <div className="bg-zinc-950 border border-zinc-800/50 p-3 rounded-xl flex flex-col items-center justify-center">
                    <div className="text-sm font-black text-zinc-200">{result.predictions.savePotential}</div>
                    <div className="text-[10px] uppercase tracking-wider font-bold text-zinc-500">Save Potential</div>
                  </div>
                </div>
              </div>

              {/* Audience Retention Curve */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-4">
                <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Audience Retention Curve
                </h3>
                <div className="h-24 w-full flex items-end gap-1 pt-4 relative">
                  <div className="absolute top-0 left-0 text-[10px] text-zinc-600 font-bold">100%</div>
                  <div className="absolute bottom-0 left-0 text-[10px] text-zinc-600 font-bold">0s</div>
                  <div className="absolute bottom-0 right-0 text-[10px] text-zinc-600 font-bold">End</div>
                  
                  {/* Fake graph bars */}
                  {[100, 95, 80, 60, 45, 40, 35, 30, 25, 20].map((h, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-rose-600/20 to-rose-500 rounded-t-sm" style={{ height: \`\${h}%\` }}></div>
                  ))}
                  
                  <div className="absolute top-1/2 left-1/3 bg-zinc-800 text-zinc-200 text-[10px] font-bold px-2 py-1 rounded-md border border-zinc-700 shadow-lg whitespace-nowrap transform -translate-x-1/2 -translate-y-1/2">
                    Drop-off: {result.predictions.dropOffPoint}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Screen 2: Optimization */}
        <div className="min-w-full w-full h-full overflow-y-auto snap-center pb-40 px-4 pt-6 space-y-8">
          
          <div className="text-center">
            <h2 className="text-2xl font-black text-zinc-100 mb-2">🚀 Optimization Plan</h2>
            <p className="text-zinc-400 text-sm font-medium">Make it perform better instantly.</p>
          </div>

          {analysisStage === 'detailed' && result.optimizationPlan ? (
            <>
              {/* Quick Actions */}
              <div className="space-y-3">
                <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest">Quick Actions</h3>
                <div className="flex overflow-x-auto gap-3 pb-2 hide-scrollbar -mx-4 px-4">
                  {quickActions.map(action => (
                    <button 
                      key={action.id}
                      onClick={() => handleAction(action.id)}
                      disabled={!!actionLoading}
                      className="shrink-0 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-4 py-3 rounded-2xl flex flex-col items-start gap-2 transition-all active:scale-95"
                    >
                      <span className="text-xl">{action.icon}</span>
                      <span className="text-sm font-bold text-zinc-200 whitespace-nowrap">{action.id}</span>
                    </button>
                  ))}
                </div>
                
                {/* Action Results Area */}
                {Object.entries(actionResults).map(([actionName, res]) => (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} key={actionName} className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-2xl mt-2 relative">
                    <button onClick={() => setActionResults(p => { const n = {...p}; delete n[actionName]; return n; })} className="absolute top-2 right-2 text-rose-400 hover:text-rose-300"><X className="w-4 h-4"/></button>
                    <div className="text-xs font-black text-rose-400 uppercase tracking-widest mb-2">{actionName}</div>
                    <ul className="space-y-2">
                      {res.map((r, i) => (
                        <li key={i} className="text-sm text-zinc-200 font-medium flex items-start gap-2">
                          <span className="text-rose-500 mt-0.5">•</span> {r}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
                {actionLoading && (
                  <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl mt-2 flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm font-bold text-zinc-400">Generating {actionLoading}...</span>
                  </div>
                )}
              </div>

              {/* AI Suggestions */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest">AI Suggestions</h3>
                
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
                    <div key={key} className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl space-y-3">
                      <div className="text-sm font-black text-zinc-200">{labels[key]}</div>
                      <div className="grid gap-2">
                        <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/50">
                          <span className="text-[10px] font-black text-rose-500 uppercase block mb-1">What's Wrong</span>
                          <span className="text-xs text-zinc-300 font-medium">{plan.issue}</span>
                        </div>
                        <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800/50">
                          <span className="text-[10px] font-black text-amber-500 uppercase block mb-1">Why It Matters</span>
                          <span className="text-xs text-zinc-300 font-medium">{plan.whyItMatters}</span>
                        </div>
                        <div className="bg-emerald-950/20 p-3 rounded-xl border border-emerald-900/30">
                          <span className="text-[10px] font-black text-emerald-500 uppercase block mb-1">Quick Fix</span>
                          <span className="text-xs text-emerald-100 font-medium">{plan.fix}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Better Version */}
              {result.betterVersion && (
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest">Better Version</h3>
                  <div className="bg-emerald-950/30 border border-emerald-900/50 p-5 rounded-2xl relative overflow-hidden">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-black text-emerald-400">AI REWRITE</span>
                      <span className="text-xs font-black text-emerald-400">{result.betterVersion.predictedScore} 🔥</span>
                    </div>
                    <p className="text-sm text-emerald-100 font-medium">{result.betterVersion.idea}</p>
                  </div>
                </div>
              )}

              {/* Hook Variations */}
              {result.hookVariations && (
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest">Hook Variations</h3>
                  <SwipeableHooks hooks={result.hookVariations} />
                </div>
              )}

              {/* Content Upgrade Ideas */}
              {result.contentUpgradeIdeas && (
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest">Content Upgrade Ideas</h3>
                  <div className="grid gap-3">
                    {result.contentUpgradeIdeas.map((idea, idx) => (
                      <div key={idx} className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex items-start gap-3">
                        <div className="bg-rose-500/20 text-rose-400 p-1.5 rounded-lg mt-0.5"><Zap className="w-4 h-4" /></div>
                        <p className="text-sm text-zinc-200 font-medium">{idea}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Secondary Actions */}
              <div className="space-y-3 pt-4">
                <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest">More Tools</h3>
                <div className="flex flex-wrap gap-2">
                  {secondaryActions.map(action => (
                    <button 
                      key={action.id}
                      onClick={() => handleAction(action.id)}
                      disabled={!!actionLoading}
                      className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-3 py-2 rounded-xl flex items-center gap-2 transition-all active:scale-95"
                    >
                      <span>{action.icon}</span>
                      <span className="text-xs font-bold text-zinc-300">{action.id}</span>
                    </button>
                  ))}
                </div>
              </div>

            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-zinc-400 text-sm font-medium">Generating optimization plan...</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Actions Fixed */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-zinc-950 via-zinc-950 to-transparent pt-12 pointer-events-none">
        <div className="max-w-md mx-auto flex flex-col gap-3 pointer-events-auto">
          <button
            onClick={onRematch}
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" /> Test Another Idea
          </button>
        </div>
      </div>
    </div>
  );
}
`

const newCode = code.substring(0, startIdx) + newResultView + '\n\n' + code.substring(endIdx);
fs.writeFileSync('src/App.tsx', newCode);
console.log('Replaced ResultView');
