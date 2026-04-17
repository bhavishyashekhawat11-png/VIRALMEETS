import React, { memo } from 'react';
import { motion } from 'motion/react';
import { Rocket, LogOut } from 'lucide-react';

interface AppTopBarProps {
  onLogout: () => void;
  onNavigateHome: () => void;
}

export const AppTopBar: React.FC<AppTopBarProps> = memo(({ onLogout, onNavigateHome }) => {
  return (
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
      
      <button 
        onClick={onLogout}
        className="flex items-center gap-2 text-[10px] font-black text-zinc-500 hover:text-rose-500 uppercase tracking-widest transition-colors outline-none"
      >
        <LogOut className="w-3 h-3" />
        Logout
      </button>
    </div>
  );
});

AppTopBar.displayName = 'AppTopBar';
