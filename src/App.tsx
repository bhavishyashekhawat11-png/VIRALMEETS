import React, { useState, useEffect, useRef, lazy, Suspense, memo, useMemo } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { analyzeIdeaQuick, analyzeIdeaDetailed, AnalysisResult, UserProfile, generateProfileInsights, ProfileInsights, executeQuickAction } from './lib/gemini';
import { RotateCcw, Flame, Skull, AlertTriangle, Sparkles, Share, Dice5, Zap, TrendingUp, ArrowRight, ArrowLeft, Paperclip, Link as LinkIcon, Image as ImageIcon, Video, Clapperboard, X, Trophy, History, Check, RefreshCw, Music, Instagram, Youtube, Brain, Target, BarChart3, Activity, Rocket, Lock, Unlock, ChevronRight, ChevronLeft, FileText, Wand2, AlertCircle, Info, ShieldCheck, CheckCircle2, CreditCard, Clock, RotateCcw as RotateCcwIcon } from 'lucide-react';
import { cn } from './lib/utils';

// Lazy load non-critical components
const DeepAnalysisView = lazy(() => import('./components/DeepAnalysisView').then(m => ({ default: m.DeepAnalysisView })));
const SubscriptionView = lazy(() => import('./components/SubscriptionView').then(m => ({ default: m.SubscriptionView })));
const FeaturesPage = lazy(() => import('./components/FeaturesPage').then(m => ({ default: m.FeaturesPage })));
const PricingPage = lazy(() => import('./components/PricingPage').then(m => ({ default: m.PricingPage })));
const AboutPage = lazy(() => import('./components/AboutPage').then(m => ({ default: m.AboutPage })));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const LegalPage = lazy(() => import('./components/LegalPage').then(m => ({ default: m.LegalPage })));

import { LandingPage } from './components/LandingPage';
import { FeaturesGrid } from './components/FeaturesGrid';
import { Navbar } from './components/Navbar';
import { AppTopBar } from './components/AppTopBar';
import { AuthModal } from './components/AuthModal';
import { Background } from './components/Background';
import { Footer } from './components/Footer';
import { Step, Platform, PastIdea } from './types';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

import { SubscriptionProvider, useSubscription } from './contexts/SubscriptionContext';
import { UpgradeModal } from './components/UpgradeModal';

// Loading fallback for lazy components
const PageLoading = () => (
  <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh]">
    <motion.div 
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full"
    />
  </div>
);

const NICHES = ['General', 'Students', 'Fitness', 'Finance', 'Creators'];

const LOADING_MESSAGES = [
  "Analyzing hook strength...",
  "Matching viral patterns...",
  "Generating better version...",
  "Simulating audience reaction...",
  "Consulting the algorithm..."
];

const RANDOM_IDEAS = [
  "Hook: 'I tried the 5am routine so you don't have to.' Concept: Showing how miserable waking up at 5am actually is. Format: Fast-paced vlog with voiceover.",
  "Hook: 'Stop buying this skincare product.' Concept: Dermatologist reacts to popular but useless products. Format: Green screen reaction.",
  "Hook: 'The psychological trick to win any argument.' Concept: Explaining the 'agree and amplify' technique. Format: Direct to camera, educational.",
  "Hook: 'My biggest mistake as a junior developer.' Concept: Deleting the production database. Format: Storytime with dramatic pauses.",
  "Hook: 'What I eat in a day (realistic version).' Concept: Eating mostly snacks and takeout instead of aesthetic salads. Format: POV vlog."
];

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isPro, plan, checkLimit, incrementUsage, setShowUpgradeModal } = useSubscription();
  const [step, setStep] = useState<Step>('landing');
  const [analysisStage, setAnalysisStage] = useState<'idle' | 'quick' | 'detailed'>('idle');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [idea, setIdea] = useState('');
  const [mediaContext, setMediaContext] = useState('');
  const [mediaFile, setMediaFile] = useState<{ mimeType: string, data: string, name: string } | null>(null);
  const [platform, setPlatform] = useState<Platform>('TikTok');
  const [niche, setNiche] = useState('General');
  const [feedbackStyle, setFeedbackStyle] = useState('Balanced');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  
  const [pastIdeas, setPastIdeas] = useState<PastIdea[]>([]);
  const [bestScore, setBestScore] = useState(0);
  const [todayBest, setTodayBest] = useState(0);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setUser(authUser);
      
      if (authUser) {
        // Fetch profile from Firestore if missing or needs sync
        try {
          const userDoc = await getDoc(doc(db, 'users', authUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            const profile: UserProfile = {
              experience: data.experience || 'Just starting',
              followers: data.followers || 'Under 1K',
              audienceAge: data.audienceAge || 'Teens',
              categories: data.categories || [],
              problem: data.problem || 'Not getting views',
              goal: data.goal || 'Get more views'
            };
            setUserProfile(profile);
            localStorage.setItem('viralmeets_profile', JSON.stringify(profile));
          } else {
            // New user without profile data
            if (step !== 'onboarding') setStep('onboarding');
          }
        } catch (e) {
          console.error("Error fetching profile:", e);
        }

        // Post-signup / Post-login redirection
        if (step === 'landing') {
          setStep('home');
          setAuthModalOpen(false);
        }
      }
      
      // Protected Route Logic
      const isAppPage = ['onboarding', 'home', 'deep_analysis', 'manage_subscription', 'result', 'settings'].includes(step);
      if (!authUser && isAppPage) {
        setStep('landing');
        setAuthModalOpen(true);
      }
    });
    return () => unsubscribe();
  }, [step]);

  useEffect(() => {
    const savedProfile = localStorage.getItem('viralmeets_profile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
      setStep('home');
    }

    const savedStreak = localStorage.getItem('viralmeets_streak');
    if (savedStreak) setStreak(parseInt(savedStreak, 10));
    
    const storedData = localStorage.getItem('viralmeets_data');
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setPastIdeas(data.pastIdeas || []);
        setBestScore(data.bestScore || 0);
        
        const today = new Date().setHours(0,0,0,0);
        const todayIdeas = (data.pastIdeas || []).filter((i: PastIdea) => i.timestamp >= today);
        setTodayBest(todayIdeas.length ? Math.max(...todayIdeas.map((i: PastIdea) => i.score)) : 0);
      } catch (e) {}
    }
  }, []);

  const handleAnalyze = async () => {
    if (loading) return;
    if (!idea.trim() && !mediaFile && !mediaContext) return;
    
    // Check daily limit for FREE users
    if (!checkLimit()) return;

    setLoading(true);
    setStep('loading');
    setAnalysisStage('idle');
    setError(null);
    try {
      // 1. Quick Analysis
      const quickRes = await analyzeIdeaQuick(idea, platform, feedbackStyle, niche, userProfile, mediaContext, mediaFile || undefined);
      
      setResult(quickRes);
      setStep('result');
      setAnalysisStage('quick');
      setLoading(false);
      
      // Increment usage count
      incrementUsage();
      
      try {
        // 2. Detailed Analysis
        const detailedRes = await analyzeIdeaDetailed(quickRes, idea, platform, feedbackStyle, niche, userProfile, mediaContext, mediaFile || undefined);
        
        setResult(detailedRes);
        setAnalysisStage('detailed');
        
        const newStreak = streak + 1;
        setStreak(newStreak);
        localStorage.setItem('viralmeets_streak', newStreak.toString());

        const newIdea: PastIdea = { id: Date.now().toString(), idea: idea || 'Media Idea', score: detailedRes.score, timestamp: Date.now() };
        const updatedIdeas = [newIdea, ...pastIdeas].slice(0, 5);
        setPastIdeas(updatedIdeas);
        
        const newBest = Math.max(bestScore, detailedRes.score);
        setBestScore(newBest);
        
        const today = new Date().setHours(0,0,0,0);
        const todayIdeas = updatedIdeas.filter(i => i.timestamp >= today);
        setTodayBest(todayIdeas.length ? Math.max(...todayIdeas.map(i => i.score)) : 0);
        
        localStorage.setItem('viralmeets_data', JSON.stringify({ pastIdeas: updatedIdeas, bestScore: newBest }));
      } catch (detailedErr: any) {
        console.error("Analysis failed:", detailedErr);
        setAnalysisStage('detailed');
      }
    } catch (err: any) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setStep('home');
      setLoading(false);
    }
  };

  const handleEditPreferences = () => {
    setStep('onboarding');
  };

  const reset = () => {
    setIdea('');
    setMediaContext('');
    setMediaFile(null);
    setResult(null);
    setStep('home');
    setAnalysisStage('idle');
    setError(null);
    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setStep('landing');
      // Clear any local state if necessary
      reset();
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  const handleFullReset = () => {
    setStep('resetting');
    setTimeout(() => {
      localStorage.removeItem('viralmeets_profile');
      localStorage.removeItem('viralmeets_streak');
      localStorage.removeItem('viralmeets_data');
      setUserProfile(null);
      setStreak(0);
      setPastIdeas([]);
      setBestScore(0);
      setTodayBest(0);
      setIdea('');
      setMediaContext('');
      setMediaFile(null);
      setResult(null);
      setStep('onboarding');
    }, 1500);
  };

  // Sync step with URL if URL changes to /privacy or /terms
  useEffect(() => {
    if (location.pathname === '/privacy') setStep('privacy');
    else if (location.pathname === '/terms') setStep('terms');
    else if (location.pathname === '/' && ['privacy', 'terms'].includes(step)) setStep('landing');
  }, [location.pathname]);

  const handleNavigate = (s: Step) => {
    if (s === 'privacy') navigate('/privacy');
    else if (s === 'terms') navigate('/terms');
    else {
      setStep(s);
      if (location.pathname !== '/') navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-rose-500/30 overflow-x-hidden relative">
      <Background />
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
      
      <Routes>
        <Route path="/privacy" element={
          <div className="flex flex-col min-h-screen">
            <Navbar onNavigate={handleNavigate} onAuth={() => setAuthModalOpen(true)} user={user} onLogout={handleLogout} />
            <div className="flex-grow">
              <Suspense fallback={<PageLoading />}><Privacy /></Suspense>
            </div>
            <Footer />
          </div>
        } />
        <Route path="/terms" element={
          <div className="flex flex-col min-h-screen">
            <Navbar onNavigate={handleNavigate} onAuth={() => setAuthModalOpen(true)} user={user} onLogout={handleLogout} />
            <div className="flex-grow">
              <Suspense fallback={<PageLoading />}><Terms /></Suspense>
            </div>
            <Footer />
          </div>
        } />
        <Route path="*" element={
          <>
            {['landing', 'features', 'pricing', 'about', 'refund', 'contact'].includes(step) ? (
              <div className="flex flex-col min-h-screen">
                <Navbar 
                  onNavigate={handleNavigate} 
                  onAuth={() => setAuthModalOpen(true)}
                  user={user}
                  onLogout={handleLogout}
                />
                <div className="flex-grow">
                  <AnimatePresence mode="wait">
                    {step === 'landing' && (
                      <LandingPage 
                        key="landing" 
                        onStart={() => {
                          if (!user) {
                            setAuthModalOpen(true);
                          } else {
                            setStep(userProfile ? 'home' : 'onboarding');
                          }
                        }} 
                      />
                    )}

                    {step === 'features' && (
                      <Suspense fallback={<PageLoading />}>
                        <FeaturesPage key="features" />
                      </Suspense>
                    )}

                    {step === 'pricing' && (
                      <Suspense fallback={<PageLoading />}>
                        <PricingPage key="pricing" />
                      </Suspense>
                    )}

                    {step === 'about' && (
                      <Suspense fallback={<PageLoading />}>
                        <AboutPage key="about" />
                      </Suspense>
                    )}

                    {['refund', 'contact'].includes(step) && (
                      <Suspense fallback={<PageLoading />}>
                        <LegalPage 
                          key={step}
                          title={step === 'refund' ? "Refund Policy" : "Contact Us"}
                          onBack={() => setStep('landing')}
                          content={step === 'refund' ? `All purchases are **final and non-refundable**.

Since ViralMeets provides instant digital access to premium features, refunds cannot be issued once access is granted.

---

### Exceptions

Refunds may be considered only if:

* There is a technical issue preventing access
* Duplicate payment occurs

Requests must be made within **48 hours** of purchase.` : `We’re here to help and support you at every step of your journey with ViralMeets.

---

### 📧 Email Support

For any questions, issues, or feedback:

support@viralmeets.com`}
                        />
                      </Suspense>
                    )}
                  </AnimatePresence>
                </div>
                <Footer />
              </div>
            ) : (
              <motion.main 
                key="app-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="min-h-screen w-full max-w-md mx-auto relative flex flex-col transform-gpu will-change-transform"
              >
                <AppTopBar 
                  onLogout={handleLogout} 
                  onNavigateHome={() => setStep('home')}
                  user={user}
                />
                <UpgradeModal onManageSubscription={() => setStep('manage_subscription')} />
                <AnimatePresence mode="wait">
                  {step === 'onboarding' && (
                <OnboardingView 
                  key="onboarding" 
                  initialProfile={userProfile}
                  onComplete={async (profile) => {
                    setUserProfile(profile);
                    localStorage.setItem('viralmeets_profile', JSON.stringify(profile));
                    
                    if (auth.currentUser) {
                      try {
                        await updateDoc(doc(db, 'users', auth.currentUser.uid), {
                          ...profile,
                          updatedAt: serverTimestamp()
                        });
                      } catch (e) {
                        console.error("Error syncing onboarding profile:", e);
                      }
                    }

                    if (result) {
                      handleAnalyze();
                    } else {
                      setStep('home');
                    }
                  }} 
                  onLegalClick={handleNavigate}
                />
              )}
              {step === 'home' && (
                <HomeView
                  key="home"
                  idea={idea}
                  setIdea={setIdea}
                  mediaContext={mediaContext}
                  setMediaContext={setMediaContext}
                  mediaFile={mediaFile}
                  setMediaFile={setMediaFile}
                  platform={platform}
                  setPlatform={setPlatform}
                  niche={niche}
                  setNiche={setNiche}
                  brutalMode={false} 
                  setBrutalMode={() => {}}
                  feedbackStyle={feedbackStyle}
                  setFeedbackStyle={setFeedbackStyle}
                  onAnalyze={handleAnalyze}
                  onDeepAnalysis={() => setStep('deep_analysis')}
                  error={error}
                  streak={streak}
                  pastIdeas={pastIdeas}
                  bestScore={bestScore}
                  todayBest={todayBest}
                  onResetOnboarding={handleFullReset}
                  onLegalClick={handleNavigate}
                  onEditPreferences={handleEditPreferences}
                />
              )}
              {step === 'deep_analysis' && (
                <Suspense fallback={<PageLoading />}>
                  <DeepAnalysisView 
                    onBack={() => setStep('home')} 
                    onLegalClick={handleNavigate}
                  />
                </Suspense>
              )}
              {step === 'manage_subscription' && (
                <Suspense fallback={<PageLoading />}>
                  <SubscriptionView onBack={() => setStep('settings')} />
                </Suspense>
              )}
              {step === 'loading' && <LoadingView key="loading" />}
              {step === 'resetting' && (
                <motion.div key="resetting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                  <div className="relative w-24 h-24 mb-8">
                    <div className="absolute inset-0 border-4 border-zinc-800 rounded-full"></div>
                    <motion.div className="absolute inset-0 border-4 border-rose-500 rounded-full border-t-transparent" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <RotateCcw className="w-8 h-8 text-rose-500 animate-pulse" />
                    </div>
                  </div>
                  <p className="text-zinc-400 font-bold">Resetting your ViralMeets...</p>
                </motion.div>
              )}
              {step === 'result' && result && analysisStage !== 'idle' && (
                <ResultView 
                  key="result" 
                  result={result} 
                  idea={idea} 
                  mediaFile={mediaFile} 
                  mediaContext={mediaContext} 
                  onReset={reset} 
                  onRematch={() => {}} 
                  bestScore={bestScore} 
                  analysisStage={analysisStage} 
                  error={error} 
                  onLegalClick={handleNavigate} 
                  onEditPreferences={handleEditPreferences}
                />
              )}
              {step === 'settings' && (
                <SettingsView 
                  onBack={() => setStep('home')} 
                  onLegalClick={handleNavigate}
                />
              )}
                  </AnimatePresence>

                  {['home', 'deep_analysis', 'settings', 'result'].includes(step) && (
                    <BottomNav currentStep={step} onNavigate={handleNavigate} />
                  )}
                </motion.main>
              )}

            <AuthModal 
              isOpen={authModalOpen} 
              onClose={() => setAuthModalOpen(false)} 
            />
          </>
        } />
      </Routes>
    </div>
  );
}

const OnboardingView = memo(({ onComplete, onLegalClick, initialProfile }: { key?: string; onComplete: (profile: UserProfile) => void, onLegalClick: (s: Step) => void, initialProfile?: UserProfile | null }) => {
  const [step, setStep] = useState(initialProfile ? 1 : 0);
  const [profile, setProfile] = useState<Partial<UserProfile>>(initialProfile || { categories: [] });
  const [customCategory, setCustomCategory] = useState('');
  const [insights, setInsights] = useState<ProfileInsights | null>(null);

  const [agreed, setAgreed] = useState(!!initialProfile);

  const nextStep = () => setStep(s => s + 1);

  const handleSelect = (key: keyof UserProfile, value: string) => {
    setProfile(p => ({ ...p, [key]: value }));
    setTimeout(nextStep, 300);
  };

  const handleMultiSelect = (value: string) => {
    setProfile(p => {
      const cats = p.categories || [];
      if (cats.includes(value)) return { ...p, categories: cats.filter(c => c !== value) };
      if (cats.length >= 4) return p;
      return { ...p, categories: [...cats, value] };
    });
  };

  const EXPERIENCE_OPTIONS = [
    { id: 'Just starting', label: '🟢 Just starting' },
    { id: 'Getting consistent', label: '🟡 3–6 months' },
    { id: 'Growing fast', label: '🔵 Growing fast' },
    { id: 'Advanced / Pro', label: '🔴 Advanced / Pro' }
  ];

  const FOLLOWER_OPTIONS = [
    { id: 'Under 1K', label: '🐣 Under 1K' },
    { id: '1K – 10K', label: '🚀 1K–10K' },
    { id: '10K – 100K', label: '📈 10K–100K' },
    { id: '100K+', label: '🔥 100K+' }
  ];

  const AUDIENCE_AGE_OPTIONS = [
    { id: 'Teens', label: '🎒 Teens' },
    { id: 'Young Adults', label: '🧑 Young Adults' },
    { id: 'Adults', label: '👨 Adults' },
    { id: 'Broad Audience', label: '🌍 Broad Audience' }
  ];

  const CATEGORY_OPTIONS = [
    { id: 'Vlogs', label: '🎥 Vlogs' },
    { id: 'Personal Branding', label: '🧠 Personal Branding' },
    { id: 'Comedy', label: '😂 Comedy' },
    { id: 'Food', label: '🍔 Food' },
    { id: 'Travel', label: '✈️ Travel' },
    { id: 'Animals', label: '🐶 Animals' },
    { id: 'Sports', label: '⚽ Sports' },
    { id: 'Beauty & Style', label: '💄 Beauty & Style' },
    { id: 'Gaming', label: '🎮 Gaming' },
    { id: 'Education', label: '📚 Education' },
    { id: 'Tech', label: '💻 Tech' }
  ];

  const PROBLEM_OPTIONS = [
    { id: 'Not getting views', label: '📉 Not getting views' },
    { id: 'Low engagement', label: '😐 Low engagement' },
    { id: 'Poor reach', label: '📭 Poor reach' },
    { id: 'No conversions', label: '💸 No conversions' },
    { id: 'No content ideas', label: '🤷 No content ideas' }
  ];

  const GOAL_OPTIONS = [
    { id: 'Get more views', label: '👀 Get more views' },
    { id: 'Boost engagement', label: '🔥 Boost engagement' },
    { id: 'Grow followers', label: '📈 Grow followers' },
    { id: 'Get brand deals', label: '🤝 Get brand deals' },
    { id: 'Find viral ideas', label: '💡 Find viral ideas' }
  ];

  useEffect(() => {
    if (step === 8) {
      let isMounted = true;
      generateProfileInsights(profile).then(res => {
        if (isMounted) {
          setInsights(res);
          nextStep();
        }
      }).catch(err => {
        console.error(err);
        if (isMounted) {
          setInsights({
            summary: `Based on your profile (${profile.categories?.[0] || 'content'} creator, ${profile.followers || 'under 1K'} followers), we identified key growth gaps causing ${profile.problem || 'low engagement'}.`,
            insight1: "Your content likely loses attention in the first 2 seconds.",
            insight2: "Your niche has high competition but strong viral potential.",
            actionableDirection: "Fix My First Idea",
            emotionalHook: "Your ideas aren't bad. Your hooks are."
          });
          nextStep();
        }
      });
      return () => { isMounted = false; };
    }
  }, [step]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col p-6 pt-12"
    >
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div key="step0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Skull className="w-12 h-12 text-rose-500" />
              <h1 className="text-6xl font-black bg-gradient-to-br from-rose-400 to-rose-600 bg-clip-text text-transparent leading-tight tracking-tighter">ViralMeets</h1>
            </div>
            <div className="space-y-4 mb-12">
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-xl font-bold text-zinc-300">Know if it’ll hit—before you post.</motion.p>
            </div>
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.5 }} onClick={nextStep} className="w-full bg-rose-600 hover:bg-rose-500 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
              Start Testing <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="flex-1 flex flex-col justify-center relative">
            <button onClick={() => setStep(0)} className="absolute -top-4 left-0 p-2 text-zinc-500 hover:text-zinc-300 transition-colors rounded-full hover:bg-zinc-900">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-black text-zinc-100 mb-8 text-center">How long have you been creating content?</h2>
            <div className="space-y-3">
              {EXPERIENCE_OPTIONS.map(opt => {
                const isSelected = profile.experience === opt.id;
                return (
                  <button key={opt.id} onClick={() => handleSelect('experience', opt.id)} className={cn("w-full border p-4 rounded-2xl text-left font-bold transition-all active:scale-[0.98]", isSelected ? "bg-rose-500/10 border-rose-500 text-rose-400" : "bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-200")}>
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="flex-1 flex flex-col justify-center relative">
            <button onClick={() => setStep(1)} className="absolute -top-4 left-0 p-2 text-zinc-500 hover:text-zinc-300 transition-colors rounded-full hover:bg-zinc-900">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-black text-zinc-100 mb-8 text-center">How big is your audience?</h2>
            <div className="space-y-3">
              {FOLLOWER_OPTIONS.map(opt => {
                const isSelected = profile.followers === opt.id;
                return (
                  <button key={opt.id} onClick={() => handleSelect('followers', opt.id)} className={cn("w-full border p-4 rounded-2xl text-left font-bold transition-all active:scale-[0.98]", isSelected ? "bg-rose-500/10 border-rose-500 text-rose-400" : "bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-200")}>
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="flex-1 flex flex-col justify-center relative">
            <button onClick={() => setStep(2)} className="absolute -top-4 left-0 p-2 text-zinc-500 hover:text-zinc-300 transition-colors rounded-full hover:bg-zinc-900">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-black text-zinc-100 mb-8 text-center">Who watches your content?</h2>
            <div className="space-y-3">
              {AUDIENCE_AGE_OPTIONS.map(opt => {
                const isSelected = profile.audienceAge === opt.id;
                return (
                  <button key={opt.id} onClick={() => handleSelect('audienceAge', opt.id)} className={cn("w-full border p-4 rounded-2xl text-left font-bold transition-all active:scale-[0.98]", isSelected ? "bg-rose-500/10 border-rose-500 text-rose-400" : "bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-200")}>
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="flex-1 flex flex-col justify-center relative">
            <button onClick={() => setStep(3)} className="absolute -top-4 left-0 p-2 text-zinc-500 hover:text-zinc-300 transition-colors rounded-full hover:bg-zinc-900">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-black text-zinc-100 mb-2 text-center mt-6">What do you create?</h2>
            <p className="text-zinc-500 text-center mb-6 text-sm font-bold uppercase tracking-wider">Select up to 3–4</p>
            <div className="grid grid-cols-2 gap-3 mb-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {CATEGORY_OPTIONS.map(opt => {
                const isSelected = profile.categories?.includes(opt.id);
                return (
                  <button key={opt.id} onClick={() => handleMultiSelect(opt.id)} className={cn("bg-zinc-900 border p-4 rounded-2xl text-left font-bold transition-all active:scale-[0.98]", isSelected ? "border-rose-500 text-rose-400 bg-rose-500/10" : "border-zinc-800 text-zinc-300 hover:bg-zinc-800")}>
                    {opt.label}
                  </button>
                );
              })}
            </div>
            <div className="mb-8">
              <input 
                type="text" 
                placeholder="+ Add your category" 
                value={customCategory}
                onChange={e => setCustomCategory(e.target.value)}
                onBlur={() => {
                  if (customCategory.trim() && !profile.categories?.includes(customCategory.trim())) {
                    handleMultiSelect(customCategory.trim());
                    setCustomCategory('');
                  }
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' && customCategory.trim()) {
                    handleMultiSelect(customCategory.trim());
                    setCustomCategory('');
                  }
                }}
                className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-2xl text-zinc-200 font-bold focus:outline-none focus:border-rose-500/50 placeholder:text-zinc-600"
              />
            </div>
            <button onClick={nextStep} disabled={!profile.categories?.length} className="w-full bg-zinc-100 text-zinc-900 disabled:bg-zinc-800 disabled:text-zinc-500 font-black py-4 rounded-2xl transition-all active:scale-[0.98]">
              Continue
            </button>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div key="step5" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="flex-1 flex flex-col justify-center relative">
            <button onClick={() => setStep(4)} className="absolute -top-4 left-0 p-2 text-zinc-500 hover:text-zinc-300 transition-colors rounded-full hover:bg-zinc-900">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-black text-zinc-100 mb-8 text-center">What's holding you back?</h2>
            <div className="space-y-3">
              {PROBLEM_OPTIONS.map(opt => {
                const isSelected = profile.problem === opt.id;
                return (
                  <button key={opt.id} onClick={() => handleSelect('problem', opt.id)} className={cn("w-full border p-4 rounded-2xl text-left font-bold transition-all active:scale-[0.98]", isSelected ? "bg-rose-500/10 border-rose-500 text-rose-400" : "bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-200")}>
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {step === 6 && (
          <motion.div key="step6" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="flex-1 flex flex-col justify-center relative">
            <button onClick={() => setStep(5)} className="absolute -top-4 left-0 p-2 text-zinc-500 hover:text-zinc-300 transition-colors rounded-full hover:bg-zinc-900">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-black text-zinc-100 mb-8 text-center">What do you want right now?</h2>
            <div className="space-y-3">
              {GOAL_OPTIONS.map(opt => {
                const isSelected = profile.goal === opt.id;
                return (
                  <button key={opt.id} onClick={() => handleSelect('goal', opt.id)} className={cn("w-full border p-4 rounded-2xl text-left font-bold transition-all active:scale-[0.98]", isSelected ? "bg-rose-500/10 border-rose-500 text-rose-400" : "bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-200")}>
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {step === 7 && (
          <motion.div key="step7" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="flex-1 flex flex-col justify-center relative">
            <button onClick={() => setStep(6)} className="absolute -top-4 left-0 p-2 text-zinc-500 hover:text-zinc-300 transition-colors rounded-full hover:bg-zinc-900">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-4xl font-black text-zinc-100 mb-8 text-center leading-tight mt-6">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Skull className="w-8 h-8 text-rose-500" />
                <span>ViralMeets</span>
              </div>
              <span className="text-rose-400 text-2xl">Know if it’ll hit—before you post.</span>
            </h2>
            
            <div className="flex gap-3 mb-10">
              <div className="flex-1 bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl">
                <div className="text-[10px] font-black text-zinc-500 mb-4 uppercase tracking-widest text-center">Without ViralMeets</div>
                <ul className="space-y-4 text-xs text-zinc-400 font-bold">
                  <li className="flex items-center gap-2"><X className="w-4 h-4 text-rose-500/50 shrink-0"/> Guessing ideas</li>
                  <li className="flex items-center gap-2"><X className="w-4 h-4 text-rose-500/50 shrink-0"/> Low reach</li>
                  <li className="flex items-center gap-2"><X className="w-4 h-4 text-rose-500/50 shrink-0"/> Inconsistent growth</li>
                  <li className="flex items-center gap-2"><X className="w-4 h-4 text-rose-500/50 shrink-0"/> No clear direction</li>
                </ul>
              </div>
              
              <div className="flex-1 bg-rose-500/10 border border-rose-500/30 p-4 rounded-2xl relative overflow-hidden shadow-[0_0_20px_rgba(225,29,72,0.1)]">
                <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/20 blur-2xl rounded-full"></div>
                <div className="text-[10px] font-black text-rose-400 mb-4 uppercase tracking-widest text-center">With ViralMeets</div>
                <ul className="space-y-4 text-xs text-zinc-100 font-bold relative z-10">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0"/> Tested ideas</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0"/> Higher engagement</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0"/> Smarter decisions</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 shrink-0"/> Faster growth</li>
                </ul>
              </div>
            </div>
            
            <button onClick={nextStep} className="w-full bg-zinc-100 text-zinc-900 font-black py-4 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg">
              Continue <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {step === 8 && (
          <motion.div key="step8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center p-6">
            <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 border-4 border-zinc-800 rounded-full"></div>
              <motion.div className="absolute inset-0 border-4 border-rose-500 rounded-full border-t-transparent" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-rose-500 animate-pulse" />
              </div>
            </div>
            <div className="h-8 relative w-full flex justify-center">
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.5 }} className="text-zinc-400 font-bold text-center absolute">
                Analyzing your creator profile...
              </motion.p>
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.8 } }} exit={{ opacity: 0, y: -10 }} className="text-zinc-400 font-bold text-center absolute">
                Detecting growth opportunities...
              </motion.p>
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, transition: { delay: 1.6 } }} exit={{ opacity: 0, y: -10 }} className="text-rose-400 font-bold text-center absolute">
                Setting up your ViralMeets...
              </motion.p>
            </div>
          </motion.div>
        )}

        {step === 9 && insights && (
          <motion.div key="step9" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col justify-center items-center text-center relative">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-4 border border-emerald-500/30">
              <Check className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-black text-zinc-100 mb-4">Setup Complete</h2>
            
            <p className="text-zinc-300 text-sm mb-6 leading-relaxed px-2">
              {insights.summary}
            </p>

            <div className="w-full bg-zinc-900 border border-zinc-800 p-5 rounded-3xl mb-6 relative flex flex-col gap-4">
              <div className="flex items-end justify-around h-32 px-4 mt-4">
                <div className="flex flex-col items-center gap-2 w-1/3 relative">
                  <span className="absolute -top-6 text-[10px] font-bold text-zinc-500 whitespace-nowrap">Low retention</span>
                  <motion.div initial={{ height: 0 }} animate={{ height: 40 }} transition={{ delay: 0.5, duration: 0.8 }} className="w-full bg-rose-500/50 rounded-t-xl" />
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Current</span>
                </div>
                <div className="flex flex-col items-center gap-2 w-1/3 relative">
                  <span className="absolute -top-8 text-[10px] font-bold text-[#25F4EE] whitespace-nowrap">Improved hooks<br/>= higher engagement</span>
                  <motion.div initial={{ height: 0 }} animate={{ height: 100 }} transition={{ delay: 1, duration: 0.8, type: "spring" }} className="w-full bg-[#25F4EE] rounded-t-xl relative shadow-[0_0_15px_rgba(37,244,238,0.3)]">
                    <div className="absolute -top-3 -right-5 bg-[#25F4EE] text-zinc-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg">
                      +340%
                    </div>
                  </motion.div>
                  <span className="text-[10px] font-black text-[#25F4EE] uppercase tracking-widest">Potential</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-8 w-full text-left bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/50">
              <div className="flex items-start gap-3">
                <Zap className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <p className="text-xs text-zinc-300 font-medium">{insights.insight1}</p>
              </div>
              <div className="flex items-start gap-3">
                <TrendingUp className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <p className="text-xs text-zinc-300 font-medium">{insights.insight2}</p>
              </div>
            </div>

            <p className="text-rose-400 font-black mb-6 text-xl">{insights.emotionalHook}</p>
            
            <div className="flex items-center gap-3 mb-6 bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/50 w-full">
              <input 
                type="checkbox" 
                id="agree" 
                checked={agreed} 
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-5 h-5 rounded border-zinc-800 bg-zinc-900 text-rose-500 focus:ring-rose-500/50"
              />
              <label htmlFor="agree" className="text-xs text-zinc-400 font-medium text-left">
                I agree to the <button onClick={() => onLegalClick('privacy')} className="text-rose-400 hover:underline">Privacy Policy</button> and <button onClick={() => onLegalClick('terms')} className="text-rose-400 hover:underline">Terms & Conditions</button>.
              </label>
            </div>

            <button 
              onClick={() => agreed && onComplete(profile as UserProfile)} 
              disabled={!agreed}
              className="w-full bg-rose-600 hover:bg-rose-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-black py-4 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(225,29,72,0.3)] mb-3"
            >
              🚀 {insights.actionableDirection || "Fix My First Idea"}
            </button>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Built to help creators improve before posting.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

OnboardingView.displayName = 'OnboardingView';

const HomeView = memo(({
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
  onDeepAnalysis,
  error,
  streak,
  pastIdeas,
  bestScore,
  todayBest,
  onResetOnboarding,
  onLegalClick,
  onEditPreferences
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
  onDeepAnalysis: () => void;
  error: string | null;
  streak: number;
  pastIdeas: PastIdea[];
  bestScore: number;
  todayBest: number;
  onResetOnboarding: () => void;
  onLegalClick: (step: Step) => void;
  onEditPreferences: () => void;
}) => {
  const { isPro } = useSubscription();
  const [showMedia, setShowMedia] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
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
      className="flex-1 flex flex-col p-6 pt-12 transform-gpu will-change-transform"
    >
      <div className="flex-1 flex flex-col justify-center">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-800 flex items-center gap-2 shadow-sm">
                <Trophy className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Best</span>
                <span className="text-xs font-black text-emerald-400">{bestScore.toFixed(1)}</span>
              </div>
              {isPro && (
                <div className="bg-rose-500/10 px-3 py-1.5 rounded-full border border-rose-500/20 flex items-center gap-1.5 shadow-sm">
                  <Zap className="w-3 h-3 text-rose-500 fill-rose-500" />
                  <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">PRO</span>
                </div>
              )}
            </div>
            <button 
              onClick={onEditPreferences}
              className="flex items-center gap-2 px-3 py-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 rounded-full transition-colors border border-zinc-800/50"
              title="Edit Preferences"
            >
              <RefreshCw className="w-3 h-3" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Edit Preferences</span>
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
          <div className="flex items-center gap-3 mb-2">
            <Skull className="w-10 h-10 text-rose-500" />
            <h1 className="text-6xl font-black bg-gradient-to-br from-rose-400 to-rose-600 bg-clip-text text-transparent leading-tight tracking-tighter">
              ViralMeets
            </h1>
          </div>
          <p className="text-zinc-400 text-sm font-medium">Know if it’ll hit—before you post.</p>
        </div>

        <div className="space-y-6">
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
                      <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden focus-within:border-rose-500/50 focus-within:ring-1 focus-within:ring-rose-500/50 transition-all">
                        <div className="pl-3 flex items-center justify-center text-zinc-500">
                          <LinkIcon className="w-4 h-4" />
                        </div>
                        <input 
                          type="text" 
                          placeholder="Paste TikTok/Reels link..." 
                          value={mediaContext}
                          onChange={e => setMediaContext(e.target.value)}
                          className="w-full bg-transparent p-3 text-sm text-zinc-200 focus:outline-none placeholder:text-zinc-600" 
                        />
                      </div>
                      
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
                      {idea.trim() && (mediaContext.trim() || mediaFile) && (
                        <p className="text-[10px] text-emerald-400/80 font-medium text-center mt-2">
                          Using both idea and media for better analysis
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

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
                    onClick={() => setIdea(p.idea)}
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
      </div>

      <div className="mt-8 pb-8">
        {(() => {
          const hasIdea = idea.trim().length > 0;
          const hasMedia = mediaContext.trim().length > 0 || mediaFile !== null;
          if (!hasIdea && !hasMedia) return null;
          
          let label = '';
          if (hasIdea && hasMedia) label = 'Analyzing idea + media';
          else if (hasIdea) label = 'Analyzing idea';
          else if (hasMedia) label = 'Analyzing media';

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
          disabled={!idea.trim() && !mediaContext.trim() && !mediaFile}
          className="w-full bg-rose-600 hover:bg-rose-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-semibold py-4 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
        >
          Analyze <Sparkles className="w-5 h-5" />
        </button>
      </div>

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
      <Footer />
    </motion.div>
  );
});

HomeView.displayName = 'HomeView';

const LoadingView = memo((_props: { key?: string }) => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col items-center justify-center p-6 transform-gpu will-change-transform"
    >
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 border-4 border-zinc-800 rounded-full"></div>
        <motion.div
          className="absolute inset-0 border-4 border-rose-500 rounded-full border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-rose-500 animate-pulse" />
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={msgIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-zinc-400 font-medium text-center"
        >
          {LOADING_MESSAGES[msgIndex]}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
});

LoadingView.displayName = 'LoadingView';

const BottomNav = memo(({ currentStep, onNavigate }: { currentStep: Step, onNavigate: (s: Step) => void }) => {
  const tabs = [
    { id: 'home', label: 'ViralMeets', icon: RefreshCw },
    { id: 'deep_analysis', label: 'Deep Analysis', icon: Clapperboard },
    { id: 'settings', label: 'Settings', icon: Zap }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-950/80 backdrop-blur-lg border-t border-zinc-900 px-6 py-3 flex justify-around items-center z-50">
      {tabs.map(tab => {
        const isActive = currentStep === tab.id || (tab.id === 'home' && currentStep === 'result');
        const Icon = tab.icon;
        return (
          <button 
            key={tab.id} 
            onClick={() => onNavigate(tab.id as Step)}
            className={cn(
              "flex flex-col items-center gap-1 transition-all",
              isActive ? "text-rose-500" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <Icon className={cn("w-6 h-6", isActive && "animate-pulse")} />
            <span className="text-[10px] font-bold uppercase tracking-widest">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
});

BottomNav.displayName = 'BottomNav';

const SettingsView = memo(({ onBack, onLegalClick }: { onBack: () => void, onLegalClick: (s: Step) => void }) => {
  const sections = [
    { id: 'privacy', label: 'Privacy Policy', icon: ShieldCheck },
    { id: 'terms', label: 'Terms & Conditions', icon: CheckCircle2 },
    { id: 'refund', label: 'Refund Policy', icon: CreditCard },
    { id: 'contact', label: 'Contact Us', icon: Clock }
  ];

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col p-6 pt-12 bg-zinc-950 pb-32 transform-gpu will-change-transform">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-zinc-100 mb-2">Settings</h2>
        <p className="text-zinc-400 text-sm">Legal, support, and account preferences</p>
      </div>

      <div className="space-y-3">
        <div className="pt-4 pb-2">
          <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2 mb-3">Account</h3>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden">
            <button 
              onClick={() => onLegalClick('manage_subscription')}
              className="w-full p-5 flex items-center justify-between group hover:bg-zinc-800/50 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-500 group-hover:text-rose-400">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="block text-sm font-bold text-zinc-300 group-hover:text-zinc-100">Manage Subscription</span>
                  <span className="block text-[10px] font-medium text-zinc-500">View plans and upgrade to Pro</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <div className="pt-4 pb-2">
          <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-2 mb-3">Legal & Support</h3>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden">
            {sections.map((sec, i) => {
              const Icon = sec.icon;
              return (
                <button 
                  key={sec.id} 
                  onClick={() => onLegalClick(sec.id as Step)}
                  className={cn(
                    "w-full p-5 flex items-center justify-between group hover:bg-zinc-800/50 transition-all",
                    i !== sections.length - 1 && "border-b border-zinc-800/50"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-400 group-hover:text-zinc-200">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-zinc-300 group-hover:text-zinc-100">{sec.label}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-1 transition-transform" />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-auto pt-12 text-center">
        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">© 2026 ViralMeets. All rights reserved.</p>
        <p className="text-[10px] font-bold text-zinc-700">Version 1.0.4 (Stable)</p>
      </div>
    </motion.div>
  );
});

SettingsView.displayName = 'SettingsView';

const ResultView = memo(({ result, idea, mediaFile, mediaContext, onReset, onRematch, bestScore, analysisStage, error, onLegalClick, onEditPreferences }: { key?: string; result: AnalysisResult; idea: string; mediaFile: any; mediaContext: string; onReset: () => void; onRematch: () => void; bestScore: number; analysisStage: 'quick' | 'detailed'; error?: string | null; onLegalClick: (s: Step) => void; onEditPreferences: () => void }) => {
  const { isPro, setShowUpgradeModal } = useSubscription();
  const [showAllTags, setShowAllTags] = useState(false);
  const [activeHookIndex, setActiveHookIndex] = useState(0);
  const [showFullRewrite, setShowFullRewrite] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);

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

  const score = result.score || 0;
  const status = getStatus(score);

  const handleRewrite = () => {
    setIsRewriting(true);
    setTimeout(() => {
      setShowFullRewrite(true);
      setIsRewriting(false);
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-zinc-950">
      <div className="absolute top-6 right-6 z-50">
        <button 
          onClick={onEditPreferences}
          className="flex items-center gap-2 px-3 py-1.5 text-zinc-500 hover:text-zinc-300 bg-zinc-900/50 backdrop-blur-sm rounded-full transition-colors border border-zinc-800/50"
          title="Edit Preferences"
        >
          <RefreshCw className="w-3 h-3" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Edit Preferences</span>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto pb-40 px-4 pt-6 space-y-8">
        
        {/* 1. TOP SECTION: Uploaded Content & Basic Info */}
        <div className="space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl space-y-3">
            <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
              <Paperclip className="w-3.5 h-3.5 text-rose-500" /> Your Content
            </div>
            {idea && (
              <p className="text-sm text-zinc-200 font-medium leading-relaxed italic">
                "{idea}"
              </p>
            )}
            {mediaFile && (
              <div className="bg-zinc-950 rounded-xl p-3 border border-zinc-800 flex items-center gap-3">
                {mediaFile.mimeType.startsWith('image') ? (
                  <img src={`data:${mediaFile.mimeType};base64,${mediaFile.data}`} className="w-12 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center">
                    <Video className="w-6 h-6 text-zinc-500" />
                  </div>
                )}
                <div className="flex-1 overflow-hidden">
                  <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Media File</div>
                  <div className="text-xs text-zinc-300 truncate">{mediaFile.name}</div>
                </div>
              </div>
            )}
            <div className="space-y-3 pt-4 border-t border-zinc-900/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-3.5 h-3.5 text-rose-500" />
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Detected Tags</span>
                </div>
                <div className="bg-zinc-950 px-2 py-1 rounded-md border border-zinc-800">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{result.niche}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <AnimatePresence>
                  {result.hashtags?.slice(0, showAllTags ? undefined : 4).map((tag, i) => (
                    <motion.button
                      key={tag}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full text-[10px] font-bold text-zinc-300 hover:border-rose-500/50 hover:text-rose-400 transition-all flex items-center gap-1.5"
                    >
                      <Flame className="w-3 h-3 text-amber-500" />
                      {tag}
                    </motion.button>
                  ))}
                </AnimatePresence>
                
                {!showAllTags && result.hashtags && result.hashtags.length > 4 && (
                  <button 
                    onClick={() => setShowAllTags(true)}
                    className="px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 rounded-full text-[10px] font-black text-rose-500 uppercase tracking-widest hover:bg-rose-500/20 transition-all"
                  >
                    +{result.hashtags.length - 4} more
                  </button>
                )}
                
                {showAllTags && result.hashtags && result.hashtags.length > 4 && (
                  <button 
                    onClick={() => setShowAllTags(false)}
                    className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-full text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:bg-zinc-700 transition-all"
                  >
                    Show Less
                  </button>
                )}
              </div>
              <p className="text-[9px] text-zinc-500 font-medium leading-relaxed">
                These tags are generated based on your content and help optimize reach.
              </p>
            </div>
          </div>

          {/* Overall Score */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 text-center relative overflow-hidden shadow-2xl flex flex-col items-center">
            <div className={cn("text-lg font-black tracking-tight mb-4", status.color)}>
              {status.label}
            </div>
            <div className={cn("text-8xl font-display font-black tracking-tighter mb-2", getScoreColor(score))}>
              {score.toFixed(1)}
            </div>
            <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-6">Viral Score</div>
            
            {/* Score Breakdown */}
            <div className="w-full grid grid-cols-2 gap-3">
              {[
                { label: 'Hook', val: result.score_breakdown?.hook_strength || 0, color: 'bg-rose-500' },
                { label: 'Engagement', val: result.score_breakdown?.engagement_potential || 0, color: 'bg-emerald-500' },
                { label: 'Trend', val: result.score_breakdown?.trend_alignment || 0, color: 'bg-amber-500' },
                { label: 'Clarity', val: result.score_breakdown?.clarity || 0, color: 'bg-blue-500' }
              ].map(item => (
                <div key={item.label} className="bg-zinc-950 p-3 rounded-2xl border border-zinc-800/50 text-left">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{item.label}</span>
                    <span className="text-[10px] font-bold text-zinc-300">{item.val}/10</span>
                  </div>
                  <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.val * 10}%` }}
                      className={cn("h-full", item.color)} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2. MAIN SECTION: Upgrade This Content 🚀 */}
        <div className="space-y-8 relative">
          {analysisStage === 'quick' && (
            <div className="absolute inset-0 z-20 bg-zinc-950/60 backdrop-blur-[2px] flex flex-col items-center justify-center rounded-3xl pt-20">
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl shadow-2xl flex flex-col items-center gap-4 max-w-[280px] text-center">
                <div className="relative">
                  <div className="w-12 h-12 border-2 border-rose-500/20 rounded-full animate-ping absolute inset-0" />
                  <div className="w-12 h-12 border-2 border-rose-500 rounded-full flex items-center justify-center relative bg-zinc-900">
                    <Sparkles className="w-6 h-6 text-rose-500 animate-pulse" />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-black text-zinc-100 uppercase tracking-widest mb-1">Generating Upgrades</h4>
                  <p className="text-[10px] text-zinc-500 leading-relaxed">Our AI is building your viral roadmap. This takes a few seconds...</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 px-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-rose-500/30" />
            <h2 className="text-sm font-black text-rose-400 uppercase tracking-[0.2em] flex items-center gap-2">
              Upgrade This Content <Rocket className="w-4 h-4" />
            </h2>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-rose-500/30" />
          </div>

          {/* FEATURE 1: Scroll-Stopping Hooks */}
          <section className="space-y-4">
            <div className="flex justify-between items-end px-2">
              <div>
                <h3 className="text-xs font-black text-zinc-100 uppercase tracking-widest">1. Scroll-Stopping Hooks</h3>
                <p className="text-[10px] text-zinc-500 mt-0.5">Tested patterns to grab attention in 1s</p>
              </div>
              <div className="text-[10px] font-bold text-zinc-600 uppercase">{activeHookIndex + 1}/{result.hooks?.length || 0}</div>
            </div>
            
            <div className="relative overflow-hidden px-2">
              <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4">
                {result.hooks?.map((hook, i) => {
                  const isLocked = !isPro && i >= 2;
                  return (
                    <motion.div 
                      key={i}
                      whileInView={{ scale: 1 }}
                      initial={{ scale: 0.95 }}
                      viewport={{ once: false, amount: 0.8 }}
                      className={cn(
                        "min-w-[280px] snap-center bg-zinc-900 border p-6 rounded-3xl transition-all duration-300 relative",
                        isLocked ? "border-zinc-800/50" : "border-rose-500/20 shadow-lg shadow-rose-500/5"
                      )}
                    >
                      {isLocked ? (
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-zinc-900/80 backdrop-blur-sm rounded-3xl p-6 text-center">
                          <Lock className="w-6 h-6 text-rose-500 mb-2" />
                          <p className="text-xs font-bold text-zinc-200 mb-1">Unlock more hooks</p>
                          <button onClick={() => setShowUpgradeModal(true)} className="text-[10px] font-black text-rose-400 uppercase tracking-widest hover:text-rose-300 transition-colors">Upgrade to Pro</button>
                        </div>
                      ) : null}
                      <div className={cn("space-y-3", isLocked && "blur-[2px]")}>
                        <div className="w-8 h-8 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500 text-xs font-black">
                          {i + 1}
                        </div>
                        <p className="text-sm font-bold text-zinc-100 leading-relaxed">
                          {hook}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* FEATURE 2: Try Different Versions */}
          <section className="space-y-4">
            <div className="px-2">
              <h3 className="text-xs font-black text-zinc-100 uppercase tracking-widest">2. Try Different Versions</h3>
              <p className="text-[10px] text-zinc-500 mt-0.5">Multiple angles for the same idea</p>
            </div>
            
            <div className="space-y-3 px-2">
              {result.variations?.map((v, i) => {
                const isLocked = !isPro && i >= 1;
                return (
                  <div 
                    key={i}
                    className={cn(
                      "p-4 rounded-2xl border transition-all relative",
                      isLocked ? "bg-zinc-900/40 border-zinc-800/50" : "bg-zinc-900 border-zinc-800"
                    )}
                  >
                    {isLocked && (
                      <button 
                        onClick={() => setShowUpgradeModal(true)}
                        className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-950/40 backdrop-blur-[2px] rounded-2xl cursor-pointer group"
                      >
                        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full shadow-xl group-hover:scale-105 transition-transform">
                          <Lock className="w-3 h-3 text-rose-500" />
                          <span className="text-[10px] font-bold text-zinc-200">Pro Feature</span>
                        </div>
                      </button>
                    )}
                    <p className={cn("text-xs text-zinc-300 leading-relaxed", isLocked && "blur-[1.5px] select-none")}>
                      {v}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* FEATURE 3: Best Format For This Content */}
          <section className="space-y-4">
            <div className="px-2">
              <h3 className="text-xs font-black text-zinc-100 uppercase tracking-widest">3. Best Format</h3>
              <p className="text-[10px] text-zinc-500 mt-0.5">The style that will perform best</p>
            </div>
            
            <div className="px-2">
              <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl flex items-center gap-4">
                <div className="w-12 h-12 bg-rose-500/20 rounded-xl flex items-center justify-center">
                  <Clapperboard className="w-6 h-6 text-rose-500" />
                </div>
                <div>
                  <div className="text-xs font-black text-rose-400 uppercase tracking-widest mb-0.5">{result.best_format}</div>
                  <p className="text-[10px] text-zinc-400">Optimized for maximum retention</p>
                </div>
              </div>
            </div>
          </section>

          {/* FEATURE 4: AI Script Builder */}
          <section className="space-y-4">
            <div className="px-2">
              <h3 className="text-xs font-black text-zinc-100 uppercase tracking-widest">4. AI Script Builder</h3>
              <p className="text-[10px] text-zinc-500 mt-0.5">Structured for maximum engagement</p>
            </div>
            
            <div className="px-2 relative">
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
                <div className="p-5 space-y-4">
                  <div className="space-y-1.5">
                    <div className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Hook</div>
                    <p className="text-xs text-zinc-300 font-medium">{result.script?.hook}</p>
                  </div>
                  
                  <div className={cn("space-y-1.5 transition-all", !isPro && "blur-[3px] opacity-50 select-none")}>
                    <div className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Body</div>
                    <p className="text-xs text-zinc-300 leading-relaxed">{result.script?.body}</p>
                  </div>
                  
                  <div className={cn("space-y-1.5 transition-all", !isPro && "blur-[3px] opacity-50 select-none")}>
                    <div className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Ending (CTA)</div>
                    <p className="text-xs text-zinc-300 font-medium">{result.script?.ending}</p>
                  </div>
                </div>
                
                {!isPro && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center">
                    <div className="bg-zinc-950/80 backdrop-blur-md border border-zinc-800 p-6 rounded-3xl shadow-2xl max-w-[240px]">
                      <Lock className="w-8 h-8 text-rose-500 mx-auto mb-3" />
                      <h4 className="text-sm font-black text-zinc-100 mb-1">Full Script Locked</h4>
                      <p className="text-[10px] text-zinc-500 mb-4">Get the full structured script with Pro</p>
                      <button onClick={() => setShowUpgradeModal(true)} className="w-full bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest py-2.5 rounded-xl hover:bg-rose-500 transition-colors">Upgrade Now</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* FEATURE 5: Viral Rewrite Button */}
          <section className="space-y-4">
            <div className="px-2">
              <h3 className="text-xs font-black text-zinc-100 uppercase tracking-widest">5. Viral Rewrite</h3>
              <p className="text-[10px] text-zinc-500 mt-0.5">One-click optimization for virality</p>
            </div>
            
            <div className="px-2">
              {!showFullRewrite ? (
                <button 
                  onClick={isPro ? handleRewrite : () => setShowUpgradeModal(true)}
                  disabled={isRewriting}
                  className="w-full bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-black py-5 rounded-3xl shadow-xl shadow-rose-900/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-70 relative group overflow-hidden"
                >
                  {isRewriting ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span className="uppercase tracking-widest text-xs">Rewriting...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      <span className="uppercase tracking-widest text-xs">Make it Viral 🚀</span>
                      {!isPro && <Lock className="w-4 h-4 absolute right-6 opacity-50" />}
                    </>
                  )}
                </button>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-zinc-900 border border-rose-500/30 p-6 rounded-3xl relative overflow-hidden"
                >
                  {!isPro && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-zinc-950/60 backdrop-blur-sm p-6 text-center">
                      <Lock className="w-6 h-6 text-rose-500 mb-2" />
                      <p className="text-xs font-bold text-zinc-200 mb-1">Full Rewrite Locked</p>
                      <button onClick={() => setShowUpgradeModal(true)} className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Upgrade to Pro</button>
                    </div>
                  )}
                  <div className={cn("space-y-3", !isPro && "blur-[3px] select-none")}>
                    <div className="text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5" /> Optimized Version
                    </div>
                    <p className="text-sm text-zinc-200 leading-relaxed font-medium italic">
                      "{result.viral_rewrite}"
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </section>

          {/* FEATURE 6: Audience Drop Insights */}
          <section className="space-y-4">
            <div className="px-2">
              <h3 className="text-xs font-black text-zinc-100 uppercase tracking-widest">6. Audience Drop Insights</h3>
              <p className="text-[10px] text-zinc-500 mt-0.5">Identify where you lose viewers</p>
            </div>
            
            <div className="px-2">
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 relative overflow-hidden">
                {!isPro && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-zinc-950/80 backdrop-blur-md p-6 text-center">
                    <Lock className="w-8 h-8 text-rose-500 mb-3" />
                    <h4 className="text-sm font-black text-zinc-100 mb-1">Retention Analysis Locked</h4>
                    <p className="text-[10px] text-zinc-500 mb-4">See exactly where people scroll away</p>
                    <button onClick={() => setShowUpgradeModal(true)} className="bg-zinc-800 border border-zinc-700 px-6 py-2 rounded-xl text-[10px] font-black text-rose-400 uppercase tracking-widest hover:bg-zinc-700 transition-colors">Unlock Now</button>
                  </div>
                )}
                
                <div className={cn("space-y-4", !isPro && "blur-[4px] opacity-30 select-none")}>
                  {result.audience_drop_insights?.map((insight, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-10 h-10 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center shrink-0">
                        <AlertCircle className="w-5 h-5 text-amber-500" />
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-0.5">Drop at {insight.point}</div>
                        <p className="text-xs text-zinc-300 leading-relaxed">{insight.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-8">
          <button onClick={onReset} className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold py-4 rounded-2xl border border-zinc-800 transition-all active:scale-95">
            New Idea
          </button>
          <button onClick={onReset} className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-rose-900/20 transition-all active:scale-95">
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
});

ResultView.displayName = 'ResultView';

const SwipeableHooks = memo(({ hooks }: { hooks: string[] }) => {
  const [stack, setStack] = useState(hooks);
  const handleDragEnd = (event: any, info: any, hook: string) => {
    if (Math.abs(info.offset.x) > 50) {
      setStack(prev => prev.filter(h => h !== hook));
    }
  };
  
  if (stack.length === 0) {
    return (
      <div className="h-40 w-full flex items-center justify-center bg-zinc-900/50 border border-zinc-800 border-dashed rounded-3xl">
        <span className="text-zinc-500 font-bold text-sm">No more hooks!</span>
      </div>
    );
  }

  return (
    <div className="relative h-40 w-full flex justify-center items-center">
      <AnimatePresence>
        {stack.map((hook, index) => {
          const isTop = index === stack.length - 1;
          return (
            <motion.div
              key={hook}
              drag={isTop ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(e, info) => isTop && handleDragEnd(e, info, hook)}
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ 
                scale: isTop ? 1 : 0.95 - (stack.length - 1 - index) * 0.05, 
                y: isTop ? 0 : (stack.length - 1 - index) * 12, 
                opacity: 1, 
                zIndex: index 
              }}
              exit={{ x: Math.random() > 0.5 ? 200 : -200, opacity: 0, transition: { duration: 0.2 } }}
              className={cn(
                "absolute w-full max-w-[320px] bg-zinc-900 border p-6 rounded-3xl shadow-xl flex flex-col justify-center items-center text-center gap-3 cursor-grab active:cursor-grabbing",
                isTop ? "border-zinc-700" : "border-zinc-800"
              )}
            >
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest bg-zinc-950 px-3 py-1 rounded-full">Swipe Me</span>
              <p className="text-sm font-bold text-zinc-100 leading-snug">{hook}</p>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
});

SwipeableHooks.displayName = 'SwipeableHooks';
