import React, { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { ArrowDown, MessageCircle } from 'lucide-react';
import { HERO_TAGLINE, HERO_TITLE_1, HERO_TITLE_2, HERO_SUBTEXT_1 } from '../data/content';

const HERO_ACTIONS = [
  { label: 'See My Work', section: 'work' },
  { label: 'Contact', section: 'contact' },
];
const DM_LINKS = [
  { icon: <MessageCircle size={11} />, label: 'DM on X', directHref: 'https://x.com/lonerfss' },
  { icon: <MessageCircle size={11} />, label: 'DM on IG', directHref: 'https://www.instagram.com/lonerkid' },
];

export default function Hero({ scrollToSection, isScrolled, triggerRainbow }) {
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
      <div style={{ position: 'relative', zIndex: 3, width: '100%', maxWidth: 1000, textAlign: 'center', paddingBottom: '60px' }}>

        {/* Misfits Cavern Logo (Perfectly Centered) */}
        <motion.button
          onClick={() => triggerRainbow && triggerRainbow()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: 'block',
            width: '100%',
            maxWidth: '800px', // Increased size
            height: '350px', // Increased size
            margin: '0 auto',
            backgroundColor: 'var(--fg)',
            WebkitMask: 'url(/logo.svg) no-repeat center',
            mask: 'url(/logo.svg) no-repeat center',
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
            filter: 'drop-shadow(0px 10px 30px rgba(var(--ambient-r),var(--ambient-g),var(--ambient-b),0.4))',
            transition: 'filter 0.7s ease, transform 0.3s ease',
            cursor: 'pointer',
            userSelect: 'none',
            outline: 'none'
          }}
        />

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
            {HERO_SUBTEXT_1}
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
    </section>
  );
}
