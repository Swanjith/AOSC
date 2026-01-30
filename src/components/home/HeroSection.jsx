import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

export default function HeroSection() {
  // Generate modern particle pattern
  const generateParticles = () => {
    const particles = [];
    for (let i = 0; i < 48; i++) {
      particles.push(
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-slate-900/20 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: 0,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      );
    }
    return particles;
  };

  return (
    <section className="min-h-screen bg-white relative overflow-hidden flex flex-col justify-between pt-16">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {generateParticles()}
      </div>

      {/* Subtle Background Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-slate-900/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl" />

      {/* Terminal Status Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center px-6 py-4 text-xs font-mono text-slate-500 relative z-10"
      >
        <div className="flex items-center gap-2">
          <span className="font-mono-accent">(env):</span>
          <span className="text-green-500 flex items-center gap-1 font-mono-accent-medium">
            active
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </span>
        </div>
        {/* <div className="hidden md:block font-mono-accent">
          Core_Sys // Terminal_01
        </div> */}
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8 relative z-10">
        {/* Location Tag */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 text-slate-500 font-mono-accent text-sm mb-8"
        >
          {/* <span className="text-slate-400 text-xs font-mono-accent">LOC_DATA</span> */}
          <MapPin className="w-4 h-4 text-cyan-500" />
          <span className="font-mono-accent-medium text-slate-700">MANGALORE, IN</span>
        </motion.div>

        {/* Main Logo with Clean Typography */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          <motion.h1
            className="aosc-logo text-[80px] md:text-[180px] lg:text-[220px] leading-none text-slate-900 cursor-hover"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            AOSC
          </motion.h1>

          {/* Subtle underline accent */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-cyan-400 rounded-full"></div>
        </motion.div>

        {/* Tagline with accent underline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative mt-6"
        >
          <p className="text-slate-600 font-mono text-sm md:text-base tracking-wider">
            COMMIT. MERGE. EVOLVE
          </p>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-cyan-400 rounded-full mt-1"></div>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-slate-500 text-sm mt-4 font-medium"
        >
          Alva's Open Source Community
        </motion.p>
      </div>

      {/* Clean Wave Pattern */}
      <div className="relative">
        <svg
          className="w-full h-24 text-slate-900/10"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"
            fill="currentColor"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </svg>
      </div>
    </section>
  );
}