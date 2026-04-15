import React, { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { ArrowDown, MessageCircle } from 'lucide-react';

const HERO_ACTIONS = [
  { label: 'See My Work', section: 'work' },
  { label: 'Why Me', section: 'pitch' },
  { label: 'Contact', section: 'contact' },
];
const DM_LINKS = [
  { icon: <MessageCircle size={11} />, label: 'DM on X', href: 'https://x.com/messages/compose?recipient_id=lonerfss', directHref: 'https://x.com/lonerfss' },
  { icon: <MessageCircle size={11} />, label: 'DM on IG', href: 'https://ig.me/m/lonerkid', directHref: 'https://instagram.com/lonerkid' },
];

export default function Hero({ scrollToSection }) {
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

        {/* Built for PBM tag */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 0.7, y: 0 }}
          transition={{ duration: 0.8, delay: 0.05 }}
          style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: 5, textTransform: 'uppercase', color: 'rgb(var(--ambient-r),var(--ambient-g),var(--ambient-b))', marginBottom: 10, transition: 'color 0.6s' }}
        >
          Built for @plaqueboymax
        </motion.div>

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

        {/* Nav buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.8 }}
          style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 32, flexWrap: 'wrap' }}
        >
          {HERO_ACTIONS.map((a, i) => (
            <motion.button key={i}
              onClick={() => scrollToSection(a.section)}
              whileHover={{ y: -2, scale: 1.03 }} whileTap={{ scale: 0.97 }}
              style={{
                padding: '12px 24px', borderRadius: 'var(--radius-full)',
                fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: 2.5, textTransform: 'uppercase',
                color: i === 0 ? '#080808' : 'var(--fg)',
                background: i === 0 ? 'rgb(var(--ambient-r),var(--ambient-g),var(--ambient-b))' : 'rgba(255,255,255,0.06)',
                border: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.1)',
                cursor: 'none', transition: 'all 0.4s var(--ease-expo)',
                fontWeight: i === 0 ? 500 : 400,
              }}
            >{a.label}</motion.button>
          ))}
        </motion.div>

        {/* DM links */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.7 }}
          style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}
        >
          {DM_LINKS.map((d, i) => (
            <motion.a key={i} href={d.directHref} target="_blank" rel="noopener noreferrer"
              whileHover={{ y: -1 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '8px 16px', borderRadius: 'var(--radius-full)',
                fontFamily: 'var(--mono)', fontSize: 8, letterSpacing: 2, textTransform: 'uppercase',
                color: 'var(--fg-muted)', textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.06)',
                cursor: 'none', transition: 'all 0.3s',
              }}
            >{d.icon} {d.label}</motion.a>
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
