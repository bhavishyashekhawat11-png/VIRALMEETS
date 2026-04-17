import React, { memo } from 'react';
import { Step } from '../types';

export const Footer = memo(({ onLegalClick }: { onLegalClick: (s: Step) => void }) => {
  return (
    <div className="mt-12 pt-8 border-t border-zinc-900 flex flex-col items-center gap-4 pb-32 transform-gpu">
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
        <button onClick={() => onLegalClick('privacy')} className="hover:text-rose-400 transition-colors outline-none">Privacy Policy</button>
        <button onClick={() => onLegalClick('terms')} className="hover:text-rose-400 transition-colors outline-none">Terms & Conditions</button>
        <button onClick={() => onLegalClick('refund')} className="hover:text-rose-400 transition-colors outline-none">Refund Policy</button>
        <button onClick={() => onLegalClick('contact')} className="hover:text-rose-400 transition-colors outline-none">Contact</button>
      </div>
      <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">© 2026 ViralMeets. All rights reserved.</p>
    </div>
  );
});

Footer.displayName = 'Footer';
