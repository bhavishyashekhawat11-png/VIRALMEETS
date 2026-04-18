import React, { memo } from 'react';
import { motion } from 'motion/react';
import { Rocket, LogOut, Settings, User as UserIcon } from 'lucide-react';
import { ProfileSettingsModal } from './ProfileSettingsModal';

interface AppTopBarProps {
  onLogout: () => void;
  onNavigateHome: () => void;
  user: any;
}

export const AppTopBar: React.FC<AppTopBarProps> = memo(({ onLogout, onNavigateHome, user }) => {
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

  const getUserInitial = () => {
    if (!user) return '?';
    const name = user.displayName || user.email || 'User';
    return name.charAt(0).toUpperCase();
  };

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
        
        <div className="flex items-center gap-4">
          <div 
            className="flex items-center gap-2 cursor-pointer group p-1 pr-3 bg-zinc-900/50 border border-zinc-800 rounded-full hover:bg-zinc-800 transition-all"
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
