import React, { memo } from 'react';
import { Link } from 'react-router-dom';

export const Footer = memo(() => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-zinc-950 border-t border-zinc-900 py-12 px-6 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-8 md:flex-row md:justify-between">
        <Link to="/" className="flex items-center gap-2 group cursor-pointer">
          <span className="text-lg font-black tracking-tighter text-zinc-100 uppercase">ViralMeets</span>
        </Link>

        <p className="text-zinc-500 text-xs font-bold order-3 md:order-2">
          © {currentYear} ViralMeets. All rights reserved.
        </p>

        <div className="flex items-center gap-8 order-2 md:order-3">
          <Link 
            to="/privacy"
            className="text-xs font-black text-zinc-500 hover:text-rose-500 uppercase tracking-widest transition-colors outline-none"
          >
            Privacy Policy
          </Link>
          <Link 
            to="/terms"
            className="text-xs font-black text-zinc-500 hover:text-rose-500 uppercase tracking-widest transition-colors outline-none"
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';
