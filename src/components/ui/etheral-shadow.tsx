import React from 'react';
import { motion } from 'motion/react';

export const EtheralShadow = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-zinc-950">
      {/* Ethereal moving shadows */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-rose-600/10 blur-[120px]"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -80, 0],
          y: [0, 100, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px]"
      />
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          x: [0, 50, 0],
          y: [0, -100, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute -bottom-[10%] left-[20%] w-[70%] h-[70%] rounded-full bg-purple-600/10 blur-[120px]"
      />
      
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-zinc-950/40 backdrop-blur-[2px]" />
    </div>
  );
};
