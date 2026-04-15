import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { Film, Pen, Eye, ArrowDown } from 'lucide-react';

/* ══════════════════════════════════════
   Hero V2 — Kinetic 3D parallax hero
   Text layers move at different depths
   following the mouse position
   ══════════════════════════════════════ */

const IMG = (id, w = 600) => `https://lh3.googleusercontent.com/d/${id}=w${w}`;

const PHOTOS = [
  '1E_vf5yeYCtRaB8CMGIrkJu5zBNT-MRLO', '1owmYc9lTuoas80z6uX68Zh5gjWc_HFzm',
  '1tfFCE5ORbHwHb_HFIS3SeYGoXcQRpdfS', '1KwIxNlnl2vUuH6Wo57LToYa2b9Sj7Bhm',
  '1wcmVwR9mWMHv9WP9nWHBX9RpI5rPjXge', '1VRjE0VIvLoDaOdGfPAvx8Z_5NRlzxutw',
  '1s8gA48BIhJddg-Mk2Ns_bfjb0rP5l6v5', '1CfevkaSmrmpUEaetdGnM8quZAQBV6fLB',
  '1d73j2enoH-IkFGAXRG6JsX1lK2N_tWP4', '1GuvBsMJ80PCEgGlhFwHerkgxJPHXgmIT',
  '1QAY4u44Ltse_FSbtj2lvSnxXon0yg0Wj', '1Quwts5Lrg1rHZn-whJLkm2T_MoWTPBDB',
  '1ILTYjQTcZrHA5jXsWOcLcUVvHRUxf5_G', '124P4ZdzSU_ow_CeafQjuCuLXU5kZ_sZx',
  '1s_Jvg7pOvxdgNnBXY1wVVHv7XzV5XYp9', '1XldskBnYHylvXLu1Bgeaj7zsgKl7AAaQ',
  '1gHeCdlcsgxFsJY4WwgU8Br-SZl_tz1IP', '1fKjkXrPXUlgGUTREDiSG7Z43kjjxVdV2',
];

function sR(s) { return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }

// Parallax photo item — its own component (hooks rule)
function ParallaxPhoto({ photo, mouseX, mouseY }) {
  const x = useTransform(mouseX, [-1, 1], [-photo.px * 40, photo.px * 40]);
  const y = useTransform(mouseY, [-1, 1], [-photo.py * 30, photo.py * 30]);

  return (
    <motion.div style={{
      position: 'absolute',
      left: `${photo.left}%`, top: `${photo.top}%`,
      width: photo.w, height: photo.w * 0.68,
      zIndex: photo.z, x, y, rotate: photo.rot,
    }}>
      <div style={{
        width: '100%', height: '100%', borderRadius: 6,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
      }}>
        <img src={IMG(photo.id, 400)} alt="" loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(0.35) contrast(1.15)' }}
          onError={e => { e.target.style.display = 'none'; }}
        />
      </div>
    </motion.div>
  );
}

const SKILLS = [
  { icon: <Film size={11} />, label: 'Cinematography' },
  { icon: <Pen size={11} />, label: 'Writing' },
  { icon: <Eye size={11} />, label: 'Creative Direction' },
];

export default function Hero({ scrollToSection }) {
  const rng = sR(777);
  const photos = PHOTOS.map(id => ({
    id,
    left: rng() * 84 + 4, top: rng() * 160 + 8,
    rot: (rng() - 0.5) * 24, w: 80 + rng() * 120,
    z: Math.floor(rng() * 8),
    px: rng() * 0.8 + 0.2,
    py: rng() * 0.8 + 0.2,
  }));

  const mouseX = useSpring(0, { stiffness: 60, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 60, damping: 20 });

  // Text parallax at different depths
  const tx0 = useTransform(mouseX, [-1, 1], ['-20px', '20px']);
  const ty0 = useTransform(mouseY, [-1, 1], ['-10px', '10px']);
  const tx1 = useTransform(mouseX, [-1, 1], ['12px', '-12px']);
  const ty1 = useTransform(mouseY, [-1, 1], ['6px', '-6px']);
  const tx2 = useTransform(mouseX, [-1, 1], ['-6px', '6px']);

  useEffect(() => {
    const handleMove = (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      mouseX.set(nx);
      mouseY.set(ny);
    };
    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, [mouseX, mouseY]);

  return (
    <section style={{
      minHeight: '100svh', position: 'relative',
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center',
      overflow: 'hidden', padding: '0 24px',
    }}>
      {/* Parallax photo field */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.14 }}>
        {photos.map((p, i) => (
          <ParallaxPhoto key={i} photo={p} mouseX={mouseX} mouseY={mouseY} />
        ))}
      </div>

      {/* Pulsing ambient orb */}
      <motion.div
        animate={{ scale: [1, 1.25, 1], opacity: [0.06, 0.14, 0.06] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', width: '80vw', height: '80vw',
          maxWidth: 1000, maxHeight: 1000,
          borderRadius: '50%', pointerEvents: 'none',
          background: 'radial-gradient(circle, rgba(var(--ambient-r),var(--ambient-g),var(--ambient-b),0.22) 0%, transparent 65%)',
        }}
      />

      {/* ── KINETIC TEXT ── */}
      <div style={{ position: 'relative', zIndex: 3, width: '100%', maxWidth: 1000, textAlign: 'center' }}>

        {/* Name tagline — depth 0 */}
        <motion.div style={{ x: tx0, y: ty0 }}>
          <motion.span
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="pill pill--accent"
            style={{ display: 'inline-flex', marginBottom: 24 }}
          >
            Peter Olowude
          </motion.span>
        </motion.div>

        {/* "I DON'T" — depth 1 (opposite direction) */}
        <motion.div style={{ x: tx1 }}>
          <motion.div
            initial={{ opacity: 0, x: -80, filter: 'blur(12px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: 'var(--display)',
              fontSize: 'clamp(4rem, 18vw, 13rem)',
              lineHeight: 0.85, letterSpacing: -2,
              WebkitTextStroke: '1.5px rgba(240,236,228,0.85)',
              color: 'transparent',
              userSelect: 'none',
            }}
          >
            I DON'T
          </motion.div>
        </motion.div>

        {/* "JUST FILM" — depth 2 */}
        <motion.div style={{ x: tx0, y: ty1 }}>
          <motion.div
            initial={{ opacity: 0, x: 80, filter: 'blur(12px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.1, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: 'var(--display)',
              fontSize: 'clamp(4rem, 18vw, 13rem)',
              lineHeight: 0.85, letterSpacing: -2,
              color: 'rgb(var(--ambient-r),var(--ambient-g),var(--ambient-b))',
              transition: 'color 0.7s',
              userSelect: 'none',
            }}
          >
            JUST FILM
          </motion.div>
        </motion.div>

        {/* Tagline — depth 0 */}
        <motion.div style={{ x: tx2, marginTop: 32 }}>
          <motion.p
            initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
            animate={{ opacity: 0.5, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.65 }}
            style={{
              fontFamily: 'var(--serif)',
              fontSize: 'clamp(1rem, 3vw, 1.4rem)',
              fontStyle: 'italic', fontWeight: 300,
            }}
          >
            I build worlds. I write stories.<br />
            I hold the camera like it owes me something.
          </motion.p>
        </motion.div>

        {/* Skills pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.8 }}
          style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 28, flexWrap: 'wrap' }}
        >
          {SKILLS.map((s, i) => (
            <span key={i} className="pill" style={{ fontSize: 8 }}>{s.icon} {s.label}</span>
          ))}
        </motion.div>
      </div>

      {/* Breathing scroll indicator */}
      <motion.button
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        onClick={() => scrollToSection('work')}
        style={{
          position: 'absolute', bottom: 36, zIndex: 4,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
          background: 'none', border: 'none', color: 'var(--fg)', cursor: 'none',
        }}
      >
        <motion.div
          animate={{ opacity: [0.15, 0.5, 0.15], y: [0, 10, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
        >
          <span style={{ fontFamily: 'var(--mono)', fontSize: 7, letterSpacing: 4, textTransform: 'uppercase' }}>
            Scroll
          </span>
          <ArrowDown size={13} />
        </motion.div>
      </motion.button>
    </section>
  );
}
