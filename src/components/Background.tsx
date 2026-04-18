import React, { memo } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

export const Background: React.FC = memo(() => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#050505] pointer-events-none">
      {/* Static Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] to-[#111827]" />
      
      {/* Subtle Grain/Noise Overlay - low impact */}
      <div className="absolute inset-0 opacity-[0.01] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
    </div>
  );
});

Background.displayName = 'Background';
