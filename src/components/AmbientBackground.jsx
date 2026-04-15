import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/* ══════════════════════════════════════
   AmbientBackground
   Reactive gradient orbs that respond to
   mouse, scroll, and active video color
   ══════════════════════════════════════ */

export default function AmbientBackground() {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    let raf;
    const handleMouseMove = (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        setMousePos({
          x: (e.clientX / window.innerWidth) * 100,
          y: (e.clientY / window.innerHeight) * 100,
        });
        raf = null;
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0,
      pointerEvents: 'none',
      zIndex: 0,
      overflow: 'hidden',
    }}>
      {/* Primary cursor-following orb */}
      <div style={{
        position: 'absolute',
        width: '60vw', height: '60vw',
        maxWidth: 800, maxHeight: 800,
        left: `${mousePos.x}%`,
        top: `${mousePos.y}%`,
        transform: 'translate(-50%, -50%)',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(var(--ambient-r), var(--ambient-g), var(--ambient-b), 0.03) 0%, transparent 60%)',
        transition: 'left 1.5s cubic-bezier(0.16, 1, 0.3, 1), top 1.5s cubic-bezier(0.16, 1, 0.3, 1), background 0.6s',
        filter: 'blur(40px)',
      }} />

      {/* Slow-drifting secondary orb (top-left) */}
      <motion.div
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -40, 20, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          width: '45vw', height: '45vw',
          maxWidth: 600, maxHeight: 600,
          top: '10%', left: '5%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(var(--ambient-r), var(--ambient-g), var(--ambient-b), 0.025) 0%, transparent 55%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Slow-drifting tertiary orb (bottom-right) */}
      <motion.div
        animate={{
          x: [0, -40, 30, 0],
          y: [0, 30, -20, 0],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          width: '50vw', height: '50vw',
          maxWidth: 700, maxHeight: 700,
          bottom: '5%', right: '5%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(var(--ambient-r), var(--ambient-g), var(--ambient-b), 0.02) 0%, transparent 50%)',
          filter: 'blur(80px)',
        }}
      />
    </div>
  );
}
