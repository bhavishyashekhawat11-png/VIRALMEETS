import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail
} from 'firebase/auth';
import { X, Mail, Lock, User, ArrowRight, Sparkles, Chrome, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMethod = 'email';

export const AuthModal: React.FC<AuthModalProps> = memo(({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [method, setMethod] = useState<AuthMethod>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setError(null);
      setSuccess(null);
      setLoading(false);
      setIsLogin(true);
      setShowForgotPassword(false);
      setMethod('email');
    }
  }, [isOpen]);

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (showForgotPassword) {
      handleForgotPassword();
      return;
    }

    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
      }
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess('Password reset link sent to your email.');
      setShowForgotPassword(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div id="recaptcha-container"></div>
            
            {/* Background Glow - Static */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-500/5 blur-[60px] rounded-full pointer-events-none" />
            
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors outline-none"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="mb-8 text-center">
              <div className="inline-flex items-center justify-center p-3 bg-rose-500/10 rounded-2xl mb-4">
                <Sparkles className="w-6 h-6 text-rose-500" />
              </div>
              <h2 className="text-3xl font-black text-white tracking-tighter">
                {showForgotPassword ? 'Reset Password' : (isLogin ? 'Welcome Back' : 'Join ViralMeets')}
              </h2>
              <p className="text-zinc-400 text-sm font-medium mt-2">
                {showForgotPassword 
                  ? 'Enter your email to receive a reset link' 
                  : (isLogin ? 'Enter your details to continue' : 'Start your viral journey today')}
              </p>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-4">
              {!isLogin && !showForgotPassword && (
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all font-medium"
                    />
                  </div>
                )}
                
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all font-medium"
                  />
                </div>

                {!showForgotPassword && (
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    <input
                      type="password"
                      placeholder="Password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all font-medium"
                    />
                  </div>
                )}

                {isLogin && !showForgotPassword && (
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => { setShowForgotPassword(true); setError(null); }}
                      className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:text-rose-400 transition-colors outline-none"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                {error && (
                  <div className="flex items-center gap-2 text-rose-500 text-xs font-bold bg-rose-500/10 p-4 rounded-2xl border border-rose-500/20">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{success}</span>
                  </div>
                )}

                <button
                  disabled={loading}
                  className="w-full bg-white text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-100 active:scale-95 transition-all disabled:opacity-50 outline-none"
                >
                  {loading ? 'Processing...' : (showForgotPassword ? 'Send Reset Link' : (isLogin ? 'Login' : 'Create Account'))}
                  {!loading && <ArrowRight className="w-5 h-5" />}
                </button>
              </form>

            {!showForgotPassword && (
              <>
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-800"></div>
                  </div>
                  <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
                    <span className="bg-zinc-900 px-4 text-zinc-500">Or continue with</span>
                  </div>
                </div>

                <button
                  disabled={loading}
                  onClick={handleGoogleLogin}
                  className="w-full bg-zinc-950 border border-zinc-800 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-zinc-900 active:scale-95 transition-all outline-none"
                >
                  <Chrome className="w-5 h-5 text-rose-500" />
                  Google Account
                </button>
              </>
            )}

            <div className="mt-8 text-center">
              <button
                onClick={() => { 
                  if (showForgotPassword) setShowForgotPassword(false); 
                  else setIsLogin(!isLogin); 
                  setError(null);
                  setSuccess(null);
                }}
                className="text-sm font-bold text-zinc-500 hover:text-white transition-colors outline-none"
              >
                {showForgotPassword 
                  ? 'Back to Login' 
                  : (isLogin ? "Don't have an account? Register" : "Already have an account? Login")}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

AuthModal.displayName = 'AuthModal';
