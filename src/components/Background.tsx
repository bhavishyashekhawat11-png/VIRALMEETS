import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

export const Background: React.FC = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -150]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#050505]">
      {/* Base Gradient Layers for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#0a0a0a_0%,#050505_100%)] opacity-80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(124,58,237,0.03)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(225,29,72,0.03)_0%,transparent_50%)]" />

      {/* Floating Blurred Color Orbs */}
      <div className="absolute inset-0">
        {/* Purple Orb */}
        <motion.div
          style={{ y: y1 }}
          animate={{
            x: [0, 100, -50, 0],
            y: [0, 80, 160, 0],
            scale: [1, 1.2, 0.8, 1],
            rotate: [0, 45, -45, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-[20%] -left-[10%] w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[160px]"
        />

        {/* Rose/Pink Orb */}
        <motion.div
          style={{ y: y2 }}
          animate={{
            x: [0, -120, 80, 0],
            y: [0, 150, -60, 0],
            scale: [1, 0.9, 1.1, 1],
            rotate: [0, -60, 60, 0],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[30%] -right-[15%] w-[900px] h-[900px] bg-rose-600/10 rounded-full blur-[180px]"
        />

        {/* Blue/Indigo Orb */}
        <motion.div
          animate={{
            x: [0, 60, -80, 0],
            y: [0, -120, 80, 0],
            scale: [1.1, 1, 1.2, 1.1],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-[-10%] left-[10%] w-[700px] h-[700px] bg-indigo-600/10 rounded-full blur-[150px] hidden md:block"
        />
      </div>

      {/* Grain/Noise Overlay for premium texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
    </div>
  );
};
