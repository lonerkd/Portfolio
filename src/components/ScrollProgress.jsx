import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/* ══════════════════════════════════════
   ScrollProgress
   Thin color-reactive progress bar
   ══════════════════════════════════════ */

export default function ScrollProgress({ progress }) {
  // Convert plain number to motion value, then spring it
  const mv = useMotionValue(0);

  React.useEffect(() => {
    mv.set(progress);
  }, [progress, mv]);

  const smoothProgress = useSpring(mv, {
    stiffness: 120,
    damping: 25,
    restDelta: 0.001,
  });

  const scaleX = useTransform(smoothProgress, [0, 1], [0, 1]);

  return (
    <motion.div
      className="scroll-progress"
      style={{ scaleX }}
    />
  );
}
