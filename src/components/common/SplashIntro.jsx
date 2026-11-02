import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplashIntro({ onFinish }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onFinish) onFinish();
    }, 2000); // Exactly 2 seconds opening animation

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white overflow-hidden"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute w-[500px] h-[500px] bg-orange-500/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>

          {/* Logo Showcase Animation */}
          <div className="relative z-10 flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.4, opacity: 0, rotate: -15 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20,
                duration: 0.8,
              }}
              className="relative"
            >
              <img
                src="/logo.png"
                alt="Trending Dart"
                className="w-32 h-32 sm:w-40 sm:h-40 object-contain drop-shadow-[0_10px_35px_rgba(255,107,0,0.4)]"
              />

              {/* Animated Speed Lines around Logo */}
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 40, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="absolute top-1/4 -left-6 h-1 bg-orange-500 rounded-full"
              />
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 25, opacity: 0.8 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="absolute top-1/3 -left-4 h-1 bg-orange-500 rounded-full"
              />
            </motion.div>

            {/* Brand Title */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-6 text-center"
            >
              <h1 className="text-3xl sm:text-4xl font-black tracking-wider uppercase">
                TRENDING <span className="text-orange-500">DART</span>
              </h1>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent my-2"
              />
              <p className="text-xs sm:text-sm font-semibold tracking-[0.25em] text-slate-400 uppercase">
                Discover What's Trending
              </p>
            </motion.div>

            {/* 2-Second Progress Indicator */}
            <div className="w-48 h-1 bg-slate-800 rounded-full mt-8 overflow-hidden">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.8, ease: 'linear' }}
                className="h-full bg-gradient-to-r from-orange-600 to-amber-400"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

