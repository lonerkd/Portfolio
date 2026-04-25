import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { HERO_TAGLINE } from '../data/content';

/* ══════════════════════════════════════
   Navigation
   Apple-style frosted glass nav bar
   ══════════════════════════════════════ */

const NAV_ITEMS = [
  { id: 'story', label: 'Story' },
  { id: 'work', label: 'Work' },
  { id: 'writing', label: 'Writing' },
  { id: 'contact', label: 'Contact' },
];

export default function Navigation({ isScrolled, activeSection, scrollToSection, triggerRainbow }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isPulsingPO, setIsPulsingPO] = React.useState(false);
  const [isPulsingMC, setIsPulsingMC] = React.useState(false);

  const handleNavClick = (id) => {
    scrollToSection(id);
    setMobileOpen(false);
  };

  const handlePOClick = () => {
    setIsPulsingPO(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (triggerRainbow) triggerRainbow();
    setTimeout(() => setIsPulsingPO(false), 1500); // Remove class after animation
  };

  const handleMCClick = () => {
    setIsPulsingMC(true);
    setTimeout(() => setIsPulsingMC(false), 1500);
  };

  return (
    <>
      <motion.nav
        className={`nav ${isScrolled ? 'nav--scrolled' : ''}`}
        initial={{ y: -56, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ height: '80px' }} // Taller nav to accommodate bigger logos
      >
        {/* Misfits Cavern Logo Top Left (Replaces PO.) */}
        <motion.button
          onClick={handlePOClick}
          initial={{ opacity: 0, x: -20 }}
          animate={{ 
            opacity: isScrolled ? 1 : 0, 
            x: isScrolled ? 0 : -20,
            display: isScrolled ? 'block' : 'none' // Completely remove from flow when not scrolled
          }}
          transition={{ duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={isPulsingPO ? 'rainbow-pulse' : ''}
          style={{
            position: 'relative',
            zIndex: 2,
            outline: 'none',
            width: '240px', // Further increased size
            height: '100px', // Further increased size
            backgroundColor: 'rgb(var(--ambient-r),var(--ambient-g),var(--ambient-b))',
            WebkitMask: 'url(/logo.svg) no-repeat center left',
            mask: 'url(/logo.svg) no-repeat center left',
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
            pointerEvents: isScrolled ? 'auto' : 'none',
            transition: 'background-color 0.6s'
          }}
        />

        {/* Mobile Toggle (Now used universally as hamburger menu) */}
        <button
          className="nav__mobile-toggle"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          style={{ outline: 'none', cursor: 'none' }}
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
