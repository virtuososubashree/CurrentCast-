import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface AppIntroOutroAnimationProps {
  isLaunching?: boolean;
  onLaunchComplete?: () => void;
}

export const AppIntroOutroAnimation: React.FC<AppIntroOutroAnimationProps> = ({
  isLaunching = true,
  onLaunchComplete,
}) => {
  const [phase, setPhase] = useState<'wake' | 'surge' | 'reveal' | 'dock' | 'idle'>('wake');
  const [flashCount, setFlashCount] = useState<number>(0);

  // Launch Sequence Choreography
  useEffect(() => {
    if (!isLaunching) {
      setPhase('idle');
      return;
    }

    setPhase('wake');

    const t1 = setTimeout(() => {
      setPhase('surge');
      setFlashCount(1);
    }, 600);

    const t1b = setTimeout(() => {
      setFlashCount(2);
    }, 900);

    const t2 = setTimeout(() => {
      setPhase('reveal');
    }, 1200);

    const t3 = setTimeout(() => {
      setPhase('dock');
    }, 1850);

    const t4 = setTimeout(() => {
      setPhase('idle');
      if (onLaunchComplete) onLaunchComplete();
    }, 2350);

    return () => {
      clearTimeout(t1);
      clearTimeout(t1b);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [isLaunching, onLaunchComplete]);

  return (
    <AnimatePresence>
      {isLaunching && (
        <motion.div
          key="splash-launch-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            scale: 1.05, 
            filter: 'blur(8px)',
            transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } 
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#081F42] via-[#0B2B5C] to-slate-950 text-white p-6 select-none overflow-hidden"
        >
          {/* Background Circuit Field Lines */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              className="w-[420px] h-[420px] sm:w-[580px] sm:h-[580px] rounded-full border border-dashed border-amber-400/40"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
              className="w-[680px] h-[680px] sm:w-[880px] sm:h-[880px] rounded-full border border-blue-400/30 absolute"
            />
          </div>

          {/* Center: Vectorized Multi-Layered Animated CurrentCast Logo Emblem */}
          <div className="flex flex-col items-center text-center z-10 space-y-6 max-w-md my-auto">
            <div className="relative flex items-center justify-center">
              {/* Electric Ambient Pulse Aura */}
              <motion.div
                animate={{
                  scale: phase === 'surge' ? [1, 1.35, 1.1] : [1, 1.08, 1],
                  opacity: phase === 'surge' ? [0.4, 0.9, 0.5] : [0.2, 0.45, 0.2],
                }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="absolute -inset-8 rounded-full bg-gradient-to-tr from-amber-500/40 via-blue-500/30 to-emerald-400/30 blur-2xl pointer-events-none"
              />

              {/* SVG Vector Logo with Discrete Motion Layers */}
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.7, type: 'spring', bounce: 0.4 }}
                className="relative w-36 h-36 sm:w-44 sm:h-44 p-2 bg-white rounded-full shadow-[0_0_50px_rgba(245,158,11,0.25)] border-4 border-[#0B2B5C]"
              >
                <svg
                  viewBox="0 0 160 160"
                  className="w-full h-full"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Layer 1: Outer Circular Navy Ring (Clockwise Stroke Draw) */}
                  <motion.circle
                    cx="80"
                    cy="80"
                    r="72"
                    stroke="#0B2B5C"
                    strokeWidth="10"
                    fill="#FFFFFF"
                    strokeDasharray="452.4"
                    initial={{ strokeDashoffset: 452.4 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                  />

                  {/* Layer 2: Storm Cloud (Slides in from top-left) */}
                  <motion.path
                    d="M48 62 C43 62 38 58 38 52 C38 46 43 42 49 42 C51 36 57 32 64 32 C72 32 78 37 80 43 C83 43 87 46 87 50 C87 56 82 62 76 62 Z"
                    fill="#64748B"
                    initial={{ x: -25, y: -20, opacity: 0 }}
                    animate={{ x: 0, y: 0, opacity: 1 }}
                    transition={{ delay: 0.45, duration: 0.55, ease: 'easeOut' }}
                  />

                  {/* Layer 3: Yellow Lightning Bolt (Double-Flash Surge) */}
                  <motion.path
                    d="M58 58 L46 76 L55 76 L48 94 L68 72 L58 72 Z"
                    fill="#F59E0B"
                    stroke="#D97706"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={{
                      opacity: phase === 'wake' ? 0 : flashCount > 0 ? [0, 1, 0.4, 1] : 1,
                      scale: phase === 'wake' ? 0.4 : 1,
                    }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  />

                  {/* Layer 4: Transmission Tower (Scales Up with Elastic Bounce) */}
                  <motion.g
                    initial={{ scaleY: 0, originY: '140px', opacity: 0 }}
                    animate={{ scaleY: 1, opacity: 1 }}
                    transition={{ delay: 0.15, duration: 0.65, type: 'spring', bounce: 0.35 }}
                  >
                    {/* Top Spike */}
                    <path d="M80 44 L80 56" stroke="#1E293B" strokeWidth="4.5" strokeLinecap="round" />
                    {/* Crossarms */}
                    <path d="M62 68 L98 68" stroke="#1E293B" strokeWidth="4.5" strokeLinecap="round" />
                    <path d="M54 84 L106 84" stroke="#1E293B" strokeWidth="5" strokeLinecap="round" />
                    <path d="M48 100 L112 100" stroke="#1E293B" strokeWidth="5.5" strokeLinecap="round" />
                    {/* Main Tapered Legs */}
                    <path d="M78 56 L52 136" stroke="#1E293B" strokeWidth="5" strokeLinecap="round" />
                    <path d="M82 56 L108 136" stroke="#1E293B" strokeWidth="5" strokeLinecap="round" />
                    {/* Lattice Structure */}
                    <path d="M68 68 L92 84" stroke="#334155" strokeWidth="3" />
                    <path d="M92 68 L68 84" stroke="#334155" strokeWidth="3" />
                    <path d="M61 84 L99 100" stroke="#334155" strokeWidth="3" />
                    <path d="M99 84 L61 100" stroke="#334155" strokeWidth="3" />
                    <path d="M55 100 L105 120" stroke="#334155" strokeWidth="3.5" />
                    <path d="M105 100 L55 120" stroke="#334155" strokeWidth="3.5" />
                    <path d="M52 120 L108 120" stroke="#1E293B" strokeWidth="4" />
                  </motion.g>

                  {/* Layer 5: Floating Outage Indicator "z z Z" Elements */}
                  <motion.text
                    x="88"
                    y="58"
                    fontFamily="sans-serif"
                    fontWeight="900"
                    fontSize="13"
                    fill="#475569"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: [0, 1, 0.8], y: [10, -2, -4] }}
                    transition={{ delay: 0.7, duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
                  >
                    z
                  </motion.text>
                  <motion.text
                    x="97"
                    y="47"
                    fontFamily="sans-serif"
                    fontWeight="900"
                    fontSize="16"
                    fill="#334155"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: [0, 1, 0.9], y: [12, -4, -7] }}
                    transition={{ delay: 0.9, duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
                  >
                    z
                  </motion.text>
                  <motion.text
                    x="108"
                    y="36"
                    fontFamily="sans-serif"
                    fontWeight="900"
                    fontSize="22"
                    fill="#0B2B5C"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: [0, 1, 1], y: [15, -6, -10] }}
                    transition={{ delay: 1.1, duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
                  >
                    Z
                  </motion.text>
                </svg>
              </motion.div>
            </div>

            {/* Brand Reveal Typography */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="space-y-2.5"
            >
              {/* Title */}
              <div className="flex items-center justify-center">
                <span className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                  CurrentCa
                </span>
                <motion.span
                  animate={{
                    scale: [1, 1.25, 1],
                    filter: [
                      'drop-shadow(0 0 4px #F59E0B)',
                      'drop-shadow(0 0 16px #F59E0B)',
                      'drop-shadow(0 0 4px #F59E0B)',
                    ],
                  }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="text-4xl sm:text-5xl font-black text-amber-400 inline-flex items-center mx-0.5"
                >
                  ⚡
                </motion.span>
                <span className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                  t
                </span>
              </div>

              {/* Subtitle with tracking expansion */}
              <motion.p
                initial={{ letterSpacing: '0.05em', opacity: 0 }}
                animate={{ letterSpacing: '0.18em', opacity: 1 }}
                transition={{ delay: 1.15, duration: 0.7 }}
                className="text-xs sm:text-sm font-extrabold text-amber-300 uppercase"
              >
                Weather Report For Blackouts
              </motion.p>

              <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
                Real-time outage forecasting, dead-zone warnings & offline lifestyle guidance.
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
