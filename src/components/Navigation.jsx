import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { HERO_TAGLINE } from '../data/content';

/* ══════════════════════════════════════
   Navigation
   Apple-style frosted glass nav bar
   ══════════════════════════════════════ */

const NAV_ITEMS = [
  { id: 'pitch', label: 'Why Me' },
  { id: 'story', label: 'Story' },
  { id: 'work', label: 'Work' },
  { id: 'writing', label: 'Writing' },
  { id: 'contact', label: 'Contact' },
];

export default function Navigation({ isScrolled, activeSection, scrollToSection }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleNavClick = (id) => {
    scrollToSection(id);
    setMobileOpen(false);
  };

  return (
    <>
      <motion.nav
        className={`nav ${isScrolled ? 'nav--scrolled' : ''}`}
        initial={{ y: -56, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Logo / Name */}
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          style={{
            fontFamily: 'var(--display)',
            fontSize: '1.1rem',
            letterSpacing: 3,
            color: 'var(--fg)',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <span style={{ color: 'var(--ambient)', transition: 'color 0.6s' }}>PO.</span>
        </motion.button>

        {/* Centered Misfits Cavern stamp */}
        <motion.div
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: 'var(--mono)',
            fontSize: 9,
            letterSpacing: 5,
            textTransform: 'uppercase',
            color: 'rgb(var(--ambient-r),var(--ambient-g),var(--ambient-b))',
            transition: 'color 0.6s',
            zIndex: 2,
          }}
        >
          {HERO_TAGLINE}
        </motion.div>

        {/* Desktop Links */}
        <ul className="nav__links">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <button
                className={`nav__link ${activeSection === item.id ? 'nav__link--active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Mobile Toggle */}
        <button
          className="nav__mobile-toggle"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <span />
          <span style={{ width: 14 }} />
          <span />
        </button>
      </motion.nav>

      {/* Mobile Panel */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-panel glass-dark"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button
              className="mobile-panel__close"
              onClick={() => setMobileOpen(false)}
              whileTap={{ scale: 0.9 }}
              aria-label="Close menu"
            >
              <X size={24} />
            </motion.button>

            {NAV_ITEMS.map((item, i) => (
              <motion.button
                key={item.id}
                className="mobile-panel__link"
                onClick={() => handleNavClick(item.id)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                {item.label}
              </motion.button>
            ))}

            {/* Ambient glow behind mobile panel */}
            <div style={{
              position: 'absolute',
              bottom: '20%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 300,
              height: 300,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(var(--ambient-r), var(--ambient-g), var(--ambient-b), 0.08) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
