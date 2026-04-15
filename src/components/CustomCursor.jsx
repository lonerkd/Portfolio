import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ══════════════════════════════════════
   CustomCursor — Film reel cursor
   ══════════════════════════════════════ */

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [state, setState] = useState('default'); // default | hover | play | click
  const posRef = useRef({ x: -100, y: -100 });
  const ringPosRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef(null);

  useEffect(() => {
    // Hide native cursor
    document.documentElement.style.cursor = 'none';

    const move = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
    };

    const checkTarget = (e) => {
      const el = e.target.closest('button, a, [data-cursor="play"], [onClick], .card, video, iframe');
      if (e.target.closest('[data-cursor="play"], .video-card')) setState('play');
      else if (el) setState('hover');
      else setState('default');
    };

    const mousedown = () => setState(s => s === 'play' ? 'click-play' : 'click');
    const mouseup = () => checkTarget({ target: document.elementFromPoint(posRef.current.x, posRef.current.y) });

    // Smooth ring follow
    const animate = () => {
      const lerp = (a, b, t) => a + (b - a) * t;
      ringPosRef.current.x = lerp(ringPosRef.current.x, posRef.current.x, 0.12);
      ringPosRef.current.y = lerp(ringPosRef.current.y, posRef.current.y, 0.12);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPosRef.current.x}px, ${ringPosRef.current.y}px) translate(-50%, -50%)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    window.addEventListener('mousemove', move, { passive: true });
    window.addEventListener('mouseover', checkTarget, { passive: true });
    window.addEventListener('mousedown', mousedown);
    window.addEventListener('mouseup', mouseup);

    return () => {
      document.documentElement.style.cursor = '';
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', checkTarget);
      window.removeEventListener('mousedown', mousedown);
      window.removeEventListener('mouseup', mouseup);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const isPlay = state === 'play' || state === 'click-play';
  const isHover = state === 'hover' || state === 'click';
  const isClick = state === 'click' || state === 'click-play';

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed', zIndex: 99998, pointerEvents: 'none',
          width: isPlay ? 0 : isHover ? 8 : 6,
          height: isPlay ? 0 : isHover ? 8 : 6,
          borderRadius: '50%',
          background: `rgb(var(--ambient-r), var(--ambient-g), var(--ambient-b))`,
          transition: 'width 0.2s, height 0.2s, background 0.3s',
          willChange: 'transform',
          top: 0, left: 0,
        }}
      />

      {/* Ring */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed', zIndex: 99997, pointerEvents: 'none',
          width: isPlay ? 80 : isHover ? 48 : 28,
          height: isPlay ? 80 : isHover ? 48 : 28,
          borderRadius: '50%',
          border: `1.5px solid rgba(var(--ambient-r), var(--ambient-g), var(--ambient-b), ${isPlay ? 0.6 : 0.4})`,
          background: isPlay ? `rgba(var(--ambient-r), var(--ambient-g), var(--ambient-b), 0.08)` : 'transparent',
          transition: 'width 0.35s cubic-bezier(0.34,1.56,0.64,1), height 0.35s cubic-bezier(0.34,1.56,0.64,1), border-color 0.3s, background 0.3s, transform 0.3s',
          willChange: 'transform',
          top: 0, left: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: isClick ? 'translate(-50%, -50%) scale(0.85)' : 'translate(-50%, -50%) scale(1)',
        }}
      >
        {isPlay && (
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 8, letterSpacing: 2, textTransform: 'uppercase',
            color: `rgb(var(--ambient-r), var(--ambient-g), var(--ambient-b))`,
            userSelect: 'none',
          }}>
            PLAY
          </span>
        )}
      </div>
    </>
  );
}
