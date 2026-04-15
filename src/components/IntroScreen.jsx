import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ══════════════════════════════════════
   IntroScreen — Cinematic clapboard
   ══════════════════════════════════════ */

export default function IntroScreen({ onDone }) {
  const [phase, setPhase] = useState('count'); // count → slate → fade
  const [count, setCount] = useState(3);

  useEffect(() => {
    const t1 = setTimeout(() => setCount(2), 600);
    const t2 = setTimeout(() => setCount(1), 1200);
    const t3 = setTimeout(() => setPhase('slate'), 1800);
    const t4 = setTimeout(() => setPhase('fade'), 2400);
    const t5 = setTimeout(() => onDone(), 3000);
    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, [onDone]);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            background: '#000',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          {phase === 'count' && (
            <motion.div
              key={count}
              initial={{ scale: 1.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '30vw',
                color: '#fff',
                lineHeight: 1,
                userSelect: 'none',
              }}
            >
              {count}
            </motion.div>
          )}

          {phase === 'slate' && (
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.2, ease: 'easeIn' }}
              style={{
                width: '80vw', maxWidth: 600,
                background: '#111',
                border: '2px solid rgba(255,255,255,0.08)',
                borderRadius: 4,
                overflow: 'hidden',
                fontFamily: "'DM Mono', monospace",
              }}
            >
              {/* Clapboard stripes */}
              <div style={{
                display: 'flex', height: 48, overflow: 'hidden',
              }}>
                {[...Array(16)].map((_, i) => (
                  <div key={i} style={{
                    flex: 1,
                    background: i % 2 === 0 ? '#fff' : '#000',
                    transform: 'skewX(-8deg)',
                    transformOrigin: 'top',
                  }} />
                ))}
              </div>
              <div style={{ padding: '20px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  ['PROD', 'Misfits Cavern'],
                  ['DIR', 'Peter Olowude'],
                  ['SCENE', '001'],
                  ['TAKE', '01'],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div style={{ fontSize: 7, letterSpacing: 3, color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>{k}</div>
                    <div style={{ fontSize: 13, color: '#fff', letterSpacing: 1 }}>{v}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
