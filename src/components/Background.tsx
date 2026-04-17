import React, { memo } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

export const Background: React.FC = memo(() => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 100]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -80]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#050505] pointer-events-none">
      {/* Base Gradient Layers for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#0a0a0a_0%,#050505_100%)] opacity-80" />
      
      {/* Floating Blurred Color Orbs - Reduced for performance */}
      <div className="absolute inset-0 opacity-40">
        {/* Purple Orb */}
        <motion.div
          style={{ y: y1 }}
          animate={{
            x: [0, 30, 0],
            y: [0, 40, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[80px] will-change-transform transform-gpu"
        />

        {/* Rose/Pink Orb */}
        <motion.div
          style={{ y: y2 }}
          animate={{
            x: [0, -40, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-[20%] -right-[10%] w-[600px] h-[600px] bg-rose-600/10 rounded-full blur-[100px] will-change-transform transform-gpu"
        />

        {/* Only 2 orbs on mobile, 3nd orb hidden or simplified on desktop */}
        <div className="hidden lg:block">
          <motion.div
            animate={{
              x: [0, 20, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute bottom-[-5%] left-[15%] w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[70px] will-change-transform transform-gpu"
          />
        </div>
      </div>

      {/* Grain/Noise Overlay - extremely low opacity for performance */}
      <div className="absolute inset-0 opacity-[0.015] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
    </div>
  );
});

Background.displayName = 'Background';
