import React, { useState, memo } from 'react';
import { motion } from 'motion/react';
import { auth } from '../lib/firebase';
import { sendEmailVerification } from 'firebase/auth';
import { Mail, ShieldCheck, ArrowRight, RefreshCw, LogOut, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface VerifyEmailViewProps {
  user: any;
  onVerified: () => void;
  onLogout: () => void;
}

export const VerifyEmailView: React.FC<VerifyEmailViewProps> = memo(({ user, onVerified, onLogout }) => {
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleCheckVerification = async () => {
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      // Reload user data from Firebase to get latest emailVerified status
      await user.reload();
      const updatedUser = auth.currentUser;
      
      if (updatedUser?.emailVerified) {
        onVerified();
      } else {
        setError("Email not verified yet. Please check your inbox and click the link.");
      }
    } catch (err: any) {
      setError("Failed to check verification status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setError(null);
    setMessage(null);
    setResending(true);
    try {
      await sendEmailVerification(user);
      setMessage("Verification email resent! Please check your spam folder if you don't see it.");
    } catch (err: any) {
      if (err.code === 'auth/too-many-requests') {
        setError("Too many attempts. Please wait a moment before trying again.");
      } else {
        setError("Failed to resend email. Please try again later.");
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex-1 flex flex-col items-center justify-center p-6 text-center"
    >
      <div className="w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center mb-8 relative">
        <div className="absolute inset-0 bg-rose-500/20 blur-2xl rounded-full animate-pulse" />
        <Mail className="w-10 h-10 text-rose-500 relative z-10" />
      </div>

      <h2 className="text-3xl font-black text-white tracking-tighter mb-4">
        Verify Your Email
      </h2>
      
      <p className="text-zinc-400 font-medium mb-8 max-w-xs leading-relaxed">
        We've sent a verification link to <br />
        <span className="text-zinc-100 font-bold">{user?.email}</span>. <br />
        Please click the link to unlock your viral potential.
      </p>

      <div className="w-full space-y-4 mb-12">
        <button
          onClick={handleCheckVerification}
          disabled={loading}
          className="w-full bg-white text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-100 active:scale-95 transition-all disabled:opacity-50 outline-none"
        >
          {loading ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
            <>
              I have verified <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

        <button
          onClick={handleResendEmail}
          disabled={resending}
          className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-800 active:scale-95 transition-all disabled:opacity-50 outline-none"
        >
          {resending ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
            "Resend Email"
          )}
        </button>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 text-rose-500 text-sm font-bold bg-rose-500/10 p-4 rounded-2xl border border-rose-500/20 mb-8 w-full"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      {message && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 text-emerald-500 text-sm font-bold bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20 mb-8 w-full"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{message}</span>
        </motion.div>
      )}

      <button
        onClick={onLogout}
        className="flex items-center gap-2 text-zinc-500 hover:text-rose-500 text-xs font-black uppercase tracking-widest transition-colors outline-none"
      >
        <LogOut className="w-4 h-4" />
        Sign out and Try again
      </button>

      <div className="mt-12 flex items-center gap-2 px-4 py-2 bg-zinc-900/50 rounded-full border border-zinc-800/50">
        <ShieldCheck className="w-3.5 h-3.5 text-rose-500/60" />
        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Secure Verification</span>
      </div>
    </motion.div>
  );
});

VerifyEmailView.displayName = 'VerifyEmailView';
