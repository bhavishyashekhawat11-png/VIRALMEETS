import React from 'react';
import { Step } from '../types';

export function Footer({ onLegalClick }: { onLegalClick: (s: Step) => void }) {
  return (
    <div className="mt-12 pt-8 border-t border-zinc-900 flex flex-col items-center gap-4 pb-32">
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
        <button onClick={() => onLegalClick('privacy')} className="hover:text-rose-400 transition-colors">Privacy Policy</button>
        <button onClick={() => onLegalClick('terms')} className="hover:text-rose-400 transition-colors">Terms & Conditions</button>
        <button onClick={() => onLegalClick('refund')} className="hover:text-rose-400 transition-colors">Refund Policy</button>
        <button onClick={() => onLegalClick('contact')} className="hover:text-rose-400 transition-colors">Contact</button>
      </div>
      <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">© 2026 ViralMeets. All rights reserved.</p>
    </div>
  );
}
