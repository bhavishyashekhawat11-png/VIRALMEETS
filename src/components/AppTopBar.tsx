import React, { memo } from 'react';
import { motion } from 'motion/react';
import { Rocket, LogOut, Settings, User as UserIcon, Zap, Infinity } from 'lucide-react';
import { ProfileSettingsModal } from './ProfileSettingsModal';
import { useSubscription } from '../contexts/SubscriptionContext';
import { cn } from '../lib/utils';

interface AppTopBarProps {
  onLogout: () => void;
  onNavigateHome: () => void;
  user: any;
}

export const AppTopBar: React.FC<AppTopBarProps> = memo(({ onLogout, onNavigateHome, user }) => {
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const { isPro, usageCount, upgrade, setShowUpgradeModal } = useSubscription();

  const getUserInitial = () => {
    if (!user) return '?';
    const name = user.displayName || user.email || 'User';
    return name.charAt(0).toUpperCase();
  };

  const remaining = Math.max(0, 3 - usageCount);

  return (
    <>
      <div className="w-full max-w-md mx-auto px-6 py-4 flex items-center justify-between z-[40] bg-zinc-950/50 backdrop-blur-md border-b border-zinc-900/50">
        <div 
          onClick={onNavigateHome}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="bg-rose-600 p-1 rounded-md group-hover:rotate-6 transition-transform">
            <Rocket className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-black tracking-tighter text-white uppercase">ViralMeets</span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Usage Pill */}
          <button
            onClick={() => isPro ? null : setShowUpgradeModal(true)}
            title={isPro ? "You have unlimited analyses" : `${remaining} analyses left today. Click to upgrade.`}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 border",
              isPro 
                ? "bg-rose-500/10 text-rose-500 border-rose-500/30 hover:bg-rose-500/20" 
                : remaining === 0
                  ? "bg-rose-500 text-white border-rose-600 animate-pulse"
                  : remaining === 1
                    ? "bg-amber-500/10 text-amber-500 border-amber-500/30 hover:bg-amber-500/20"
                    : "bg-zinc-900/50 text-zinc-400 border-zinc-800 hover:bg-zinc-800"
            )}
          >
            {isPro ? (
              <>
                <Infinity className="w-3 h-3" />
                <span className="hidden sm:inline">Unlimited</span>
              </>
            ) : (
              <>
                <Zap className="w-3 h-3 fill-current" />
                <span>{remaining} left</span>
              </>
            )}
          </button>

          <div 
            className="flex items-center gap-2 cursor-pointer group p-1 pr-2 bg-zinc-900/50 border border-zinc-800 rounded-full hover:bg-zinc-800 transition-all"
            onClick={() => setIsSettingsOpen(true)}
          >
            {user?.photoURL ? (
              <img 
                src={user.photoURL} 
                alt="Profile" 
                referrerPolicy="no-referrer"
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-rose-600 flex items-center justify-center text-[10px] font-black text-white">
                {getUserInitial()}
              </div>
            )}
            <Settings className="w-3 h-3 text-zinc-500 group-hover:text-white transition-colors" />
          </div>

          <button 
            onClick={onLogout}
            className="text-zinc-500 hover:text-rose-500 transition-colors outline-none"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <ProfileSettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        user={user}
      />
    </>
  );
});

AppTopBar.displayName = 'AppTopBar';
