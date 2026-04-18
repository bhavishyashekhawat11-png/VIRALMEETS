import React, { memo } from 'react';
import { Step } from '../types';

interface FooterProps {
  onNavigate: (step: Step) => void;
}

export const Footer = memo(({ onNavigate }: FooterProps) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-zinc-950 border-t border-zinc-900 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-8 md:flex-row md:justify-between">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => onNavigate('landing')}>
          <span className="text-lg font-black tracking-tighter text-zinc-100 uppercase">ViralMeets</span>
        </div>

        <p className="text-zinc-500 text-xs font-bold order-3 md:order-2">
          © {currentYear} ViralMeets. All rights reserved.
        </p>

        <div className="flex items-center gap-8 order-2 md:order-3">
          <button 
            onClick={() => onNavigate('privacy')}
            className="text-xs font-black text-zinc-500 hover:text-rose-500 uppercase tracking-widest transition-colors outline-none"
          >
            Privacy Policy
          </button>
          <button 
            onClick={() => onNavigate('terms')}
            className="text-xs font-black text-zinc-500 hover:text-rose-500 uppercase tracking-widest transition-colors outline-none"
          >
            Terms of Service
          </button>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';
