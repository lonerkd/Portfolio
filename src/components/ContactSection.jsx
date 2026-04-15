import React, { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Mail, Twitter, ExternalLink } from 'lucide-react';

/* ══════════════════════════════════════
   ContactSection
   Magnetic buttons + ambient CTA
   ══════════════════════════════════════ */

const LINKS = [
  { label: 'Email', href: 'mailto:peterolowude@gmail.com', icon: <Mail size={15} /> },
  { label: 'X / Twitter', href: 'https://twitter.com/5stariah', icon: <Twitter size={15} /> },
  { label: 'View Everything', href: 'https://drive.google.com/drive/folders/10kpdBuTKIWpCrARqTNSCW3OtyWzQnAg0', icon: <ExternalLink size={15} /> },
];

function MagneticButton({ children, href }) {
  const btnRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    btnRef.current.style.setProperty('--mouse-x', `${x}%`);
    btnRef.current.style.setProperty('--mouse-y', `${y}%`);
  }, []);

  return (
    <motion.a
      ref={btnRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="magnetic-btn"
      onMouseMove={handleMouseMove}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.97 }}
      style={{
        width: '100%', maxWidth: 340,
        textDecoration: 'none',
        justifyContent: 'center',
      }}
    >
      {children}
    </motion.a>
  );
}

export default function ContactSection() {
  return (
    <section id="contact" className="section" style={{ textAlign: 'center' }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 50% 50%, rgba(var(--ambient-r), var(--ambient-g), var(--ambient-b), 0.07) 0%, transparent 60%)',
      }} />

      <div style={{ position: 'relative', zIndex: 2 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.92, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'var(--display)',
            fontSize: 'clamp(3.5rem, 16vw, 10rem)',
            lineHeight: 0.85,
            letterSpacing: -2,
          }}
        >
          LET'S<br />
          <span style={{ color: 'var(--ambient)', transition: 'color 0.6s' }}>BUILD</span><br />
          SOMETHING
        </motion.div>

        {/* Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.7 }}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 12, marginTop: 56,
          }}
        >
          {LINKS.map((link, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
              style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
            >
              <MagneticButton href={link.href}>
                {link.icon} {link.label}
              </MagneticButton>
            </motion.div>
          ))}
        </motion.div>

        {/* Availability */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.4 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          style={{
            marginTop: 48,
            fontFamily: 'var(--serif)',
            fontSize: '0.95rem',
            fontStyle: 'italic',
            lineHeight: 1.8,
          }}
        >
          Available immediately · Calgary, AB<br />
          Ready to relocate · Full time
        </motion.p>
      </div>
    </section>
  );
}
