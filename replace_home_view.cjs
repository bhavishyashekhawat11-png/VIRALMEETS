const fs = require('fs');

const appFile = fs.readFileSync('src/App.tsx', 'utf8');

const homeViewStart = appFile.indexOf('function HomeView({');
const loadingViewStart = appFile.indexOf('function LoadingView(');

if (homeViewStart === -1 || loadingViewStart === -1) {
  console.error('Could not find HomeView or LoadingView');
  process.exit(1);
}

const beforeHomeView = appFile.substring(0, homeViewStart);
const afterHomeView = appFile.substring(loadingViewStart);

const newHomeView = `function HomeView({
  idea,
  setIdea,
  mediaContext,
  setMediaContext,
  mediaFile,
  setMediaFile,
  platform,
  setPlatform,
  niche,
  setNiche,
  brutalMode,
  setBrutalMode,
  feedbackStyle,
  setFeedbackStyle,
  onAnalyze,
  error,
  streak,
  pastIdeas,
  bestScore,
  todayBest,
  onResetOnboarding
}: {
  key?: string;
  idea: string;
  setIdea: (v: string) => void;
  mediaContext: string;
  setMediaContext: (v: string) => void;
  mediaFile: { mimeType: string, data: string, name: string } | null;
  setMediaFile: (v: { mimeType: string, data: string, name: string } | null) => void;
  platform: Platform;
  setPlatform: (v: Platform) => void;
  niche: string;
  setNiche: (v: string) => void;
  brutalMode?: boolean;
  setBrutalMode?: (v: boolean) => void;
  feedbackStyle: string;
  setFeedbackStyle: (v: string) => void;
  onAnalyze: () => void;
  error: string | null;
  streak: number;
  pastIdeas: PastIdea[];
  bestScore: number;
  todayBest: number;
  onResetOnboarding: () => void;
}) {
  const [showMedia, setShowMedia] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [activeFlow, setActiveFlow] = useState<'selection' | 'test-idea' | 'break-video'>('selection');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64String = result.split(',')[1];
      setMediaFile({
        mimeType: file.type,
        data: base64String,
        name: file.name
      });
    };
    reader.readAsDataURL(file);
  };

  const generateRandomIdea = () => {
    const random = RANDOM_IDEAS[Math.floor(Math.random() * RANDOM_IDEAS.length)];
    setIdea(random);
  };

  const FEEDBACK_STYLES = [
    { id: 'Balanced', icon: Brain, label: 'Balanced', desc: 'Honest & constructive' },
    { id: 'Direct', icon: Zap, label: 'Direct', desc: 'Clear & no-nonsense' },
    { id: 'Growth Focused', icon: TrendingUp, label: 'Growth', desc: 'Optimization focused' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 flex flex-col p-6 pt-12"
    >
      <div className="flex-1 flex flex-col justify-center">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex justify-between items-center">
            <div className="bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-800 flex items-center gap-2 shadow-sm">
              <Trophy className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Best</span>
              <span className="text-xs font-black text-emerald-400">{bestScore.toFixed(1)}</span>
            </div>
            <div className="bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-800 flex items-center gap-2 shadow-sm">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Today</span>
              <span className="text-xs font-black text-amber-400">{todayBest.toFixed(1)}</span>
            </div>
          </div>
          <div className="flex justify-center">
            <button 
              onClick={() => setShowResetModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 rounded-full transition-colors border border-transparent hover:border-zinc-800"
              title="Restart App"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Start fresh anytime</span>
            </button>
          </div>
        </div>

        <div className="mb-8 text-center relative">
          {streak > 0 && (
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              className="absolute -top-6 right-0 bg-orange-500/20 text-orange-400 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-orange-500/30"
            >
              <Flame className="w-3 h-3" /> {streak} streak
            </motion.div>
          )}
          <h1 className="text-6xl font-black mb-2 bg-gradient-to-br from-rose-400 to-rose-600 bg-clip-text text-transparent leading-tight tracking-tighter">
            ViralMeter
          </h1>
          <p className="text-zinc-400 text-sm font-medium">Know if it’ll hit—before you post.</p>
        </div>

        {activeFlow === 'selection' && (
          <div className="space-y-4">
            <button
              onClick={() => setActiveFlow('test-idea')}
              className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-rose-500/50 p-6 rounded-3xl transition-all flex flex-col items-start gap-3 text-left group"
            >
              <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center border border-rose-500/20 group-hover:scale-110 transition-transform">
                <span className="text-2xl">🧪</span>
              </div>
              <div>
                <h3 className="text-xl font-black text-zinc-100 mb-1">Test Your Idea</h3>
                <p className="text-sm text-zinc-400 font-medium">Know if it’ll hit before you post. Analyze and predict performance.</p>
              </div>
            </button>

            <button
              onClick={() => setActiveFlow('break-video')}
              className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/50 p-6 rounded-3xl transition-all flex flex-col items-start gap-3 text-left group"
            >
              <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-transform">
                <span className="text-2xl">🔥</span>
              </div>
              <div>
                <h3 className="text-xl font-black text-zinc-100 mb-1">Break a Viral Video</h3>
                <p className="text-sm text-zinc-400 font-medium">See why it blew up. Perform viral breakdown + replication.</p>
              </div>
            </button>
          </div>
        )}

        {activeFlow !== 'selection' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <button 
                onClick={() => setActiveFlow('selection')}
                className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h2 className="text-lg font-black text-zinc-100">
                {activeFlow === 'test-idea' ? 'Test Your Idea' : 'Break a Viral Video'}
              </h2>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Platform</label>
              <div className="flex gap-2 bg-zinc-900/50 p-1.5 rounded-2xl border border-zinc-800/50">
                {(['TikTok', 'Reels', 'Shorts'] as Platform[]).map((p) => {
                  const isSelected = platform === p;
                  const Icon = p === 'TikTok' ? Music : p === 'Reels' ? Instagram : Youtube;
                  const iconColor = p === 'TikTok' ? 'text-[#25F4EE]' : p === 'Reels' ? 'text-[#E1306C]' : 'text-[#FF0000]';
                  
                  return (
                    <motion.button
                      key={p}
                      onClick={() => setPlatform(p)}
                      whileTap={{ scale: 0.95 }}
                      className={cn(
                        "relative flex-1 py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 overflow-hidden",
                        isSelected 
                          ? "text-zinc-100" 
                          : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
                      )}
                    >
                      {isSelected && (
                        <motion.div
                          layoutId="platform-active-bg"
                          className="absolute inset-0 bg-zinc-800 rounded-xl border border-zinc-700 shadow-sm"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      {isSelected && (
                        <motion.div
                          layoutId="platform-active-line"
                          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-rose-500 rounded-t-full"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-1.5">
                        <Icon className={cn("w-4 h-4 transition-colors", isSelected ? iconColor : "text-zinc-500")} />
                        {p}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Who is this for?</label>
              <div className="flex flex-wrap gap-2">
                {NICHES.map((n) => (
                  <button
                    key={n}
                    onClick={() => setNiche(n)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border",
                      niche === n
                        ? "bg-rose-500/20 text-rose-400 border-rose-500/50"
                        : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200"
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {activeFlow === 'test-idea' && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Your Idea</label>
                  <button 
                    onClick={generateRandomIdea}
                    className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
                  >
                    <Dice5 className="w-3 h-3" /> Random Idea
                  </button>
                </div>
                <textarea
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="Paste your idea... I'll tell you if it flops."
                  className="w-full h-40 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 transition-all resize-none"
                />
                
                <div className="mt-2">
                  <button 
                    onClick={() => setShowMedia(!showMedia)} 
                    className="text-xs font-bold text-zinc-500 hover:text-zinc-300 flex items-center gap-1.5 transition-colors"
                  >
                    <Paperclip className="w-3.5 h-3.5" /> Add Context (Optional)
                  </button>
                  
                  <AnimatePresence>
                    {showMedia && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-3 space-y-2">
                          <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept="image/*,video/*" 
                            onChange={handleFileChange} 
                          />
                          
                          {mediaFile ? (
                            <div className="flex items-center justify-between bg-zinc-900 border border-rose-500/30 rounded-xl p-2.5 px-4">
                              <span className="text-xs font-medium text-rose-400 truncate flex-1">{mediaFile.name}</span>
                              <button onClick={() => setMediaFile(null)} className="text-zinc-500 hover:text-rose-400">
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs font-bold text-zinc-400 flex items-center justify-center gap-1.5 hover:bg-zinc-800 hover:text-zinc-300 transition-colors"
                              >
                                <ImageIcon className="w-3.5 h-3.5" /> Upload Image
                              </button>
                              <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs font-bold text-zinc-400 flex items-center justify-center gap-1.5 hover:bg-zinc-800 hover:text-zinc-300 transition-colors"
                              >
                                <Video className="w-3.5 h-3.5" /> Upload Video
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {activeFlow === 'break-video' && (
              <div className="space-y-3">
                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Viral Video Link</label>
                <div className="flex bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden focus-within:border-amber-500/50 focus-within:ring-1 focus-within:ring-amber-500/50 transition-all p-2">
                  <div className="pl-3 flex items-center justify-center text-zinc-500">
                    <LinkIcon className="w-5 h-5" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Paste TikTok/Reels link here..." 
                    value={mediaContext}
                    onChange={e => setMediaContext(e.target.value)}
                    className="w-full bg-transparent p-4 text-sm text-zinc-200 focus:outline-none placeholder:text-zinc-600" 
                  />
                </div>
                <p className="text-xs text-zinc-500 font-medium">We'll analyze why it blew up and how you can replicate it.</p>
              </div>
            )}

            <div className="space-y-3">
              <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Feedback Style</label>
              <div className="grid grid-cols-3 gap-2">
                {FEEDBACK_STYLES.map(style => {
                  const isSelected = feedbackStyle === style.id;
                  const Icon = style.icon;
                  return (
                    <button
                      key={style.id}
                      onClick={() => setFeedbackStyle(style.id)}
                      className={cn(
                        "p-3 rounded-xl border text-left transition-all",
                        isSelected ? "bg-rose-500/20 border-rose-500/50 text-rose-400" : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800"
                      )}
                    >
                      <Icon className="w-4 h-4 mb-2" />
                      <div className="text-xs font-bold text-zinc-200">{style.label}</div>
                      <div className="text-[10px] text-zinc-500">{style.desc}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            {pastIdeas.length > 0 && (
              <div className="mt-6 space-y-3">
                <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5" /> Past Ideas
                </h3>
                <div className="space-y-2">
                  {pastIdeas.map(p => (
                    <div 
                      key={p.id} 
                      onClick={() => {
                        setIdea(p.idea);
                        setActiveFlow('test-idea');
                      }}
                      className="bg-zinc-900/50 border border-zinc-800/50 p-3 rounded-xl flex justify-between items-center cursor-pointer hover:bg-zinc-800 transition-colors"
                    >
                      <p className="text-xs text-zinc-400 truncate pr-4 max-w-[80%]">{p.idea}</p>
                      <span className={cn("text-xs font-black", p.score >= 8 ? "text-emerald-400" : p.score >= 5 ? "text-amber-400" : "text-rose-500")}>
                        {p.score.toFixed(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-rose-500 text-sm text-center">
                {error}
              </motion.div>
            )}
          </div>
        )}
      </div>

      {activeFlow !== 'selection' && (
        <div className="mt-8 pb-8">
          {(() => {
            const hasIdea = idea.trim().length > 0;
            const hasMedia = mediaContext.trim().length > 0 || mediaFile !== null;
            if (!hasIdea && !hasMedia) return null;
            
            let label = '';
            if (activeFlow === 'break-video') {
              label = 'Analyzing viral video';
            } else {
              if (hasIdea && hasMedia) label = 'Analyzing idea + media';
              else if (hasIdea) label = 'Analyzing idea';
              else if (hasMedia) label = 'Analyzing media';
            }

            return (
              <div className="flex justify-center mb-3">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
                  {label}
                </span>
              </div>
            );
          })()}
          <button
            onClick={onAnalyze}
            disabled={activeFlow === 'test-idea' ? (!idea.trim() && !mediaFile) : (!mediaContext.trim())}
            className={cn(
              "w-full text-white font-semibold py-4 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2",
              activeFlow === 'break-video' 
                ? "bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-800 disabled:text-zinc-500" 
                : "bg-rose-600 hover:bg-rose-500 disabled:bg-zinc-800 disabled:text-zinc-500"
            )}
          >
            {activeFlow === 'break-video' ? 'Breakdown Video' : 'Analyze Idea'} <Sparkles className="w-5 h-5" />
          </button>
          
          <div className="mt-6 text-center">
            <button 
              onClick={() => {
                setActiveFlow(activeFlow === 'test-idea' ? 'break-video' : 'test-idea');
                setIdea('');
                setMediaContext('');
                setMediaFile(null);
              }}
              className="text-xs text-zinc-500 hover:text-zinc-300 font-medium transition-colors"
            >
              Want to learn from viral content? Try '{activeFlow === 'test-idea' ? 'Break a Viral Video' : 'Test Your Idea'}'
            </button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showResetModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl max-w-sm w-full shadow-2xl"
            >
              <div className="w-12 h-12 bg-rose-500/10 rounded-full flex items-center justify-center mb-4 border border-rose-500/20">
                <RotateCcw className="w-6 h-6 text-rose-500" />
              </div>
              <h3 className="text-xl font-black text-zinc-100 mb-2">Restart App?</h3>
              <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                This will reset your setup, preferences, and past analysis. You'll start fresh.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 py-3 rounded-xl font-bold text-zinc-300 bg-zinc-800 hover:bg-zinc-700 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setShowResetModal(false);
                    onResetOnboarding();
                  }}
                  className="flex-1 py-3 rounded-xl font-bold text-white bg-rose-600 hover:bg-rose-500 transition-colors shadow-[0_0_15px_rgba(225,29,72,0.3)]"
                >
                  Restart
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
`;

fs.writeFileSync('src/App.tsx', beforeHomeView + newHomeView + afterHomeView);
