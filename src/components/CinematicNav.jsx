import React, { useRef, useEffect } from 'react';
import { motion, animate } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

/* ══════════════════════════════════════
   CinematicNav
   Hold for slow cinematic scroll,
   Tap to magnetize to the next section
   ══════════════════════════════════════ */

export default function CinematicNav({ sections, activeSection, scrollToSection }) {
  const scrollSpeed = 3; // Pixels per frame for hold-to-scroll
  const tapThreshold = 250; // ms
  
  const requestRef = useRef(null);
  const pointerDownTime = useRef(0);
  const isHolding = useRef(false);

  // Clean up animation frames
  useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const smoothScrollFrame = () => {
    if (isHolding.current) {
      window.scrollBy({ top: scrollSpeed, behavior: 'instant' });
      requestRef.current = requestAnimationFrame(smoothScrollFrame);
    }
  };

  const handlePointerDown = (e) => {
    // Only primary button/touch
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    
    pointerDownTime.current = Date.now();
    isHolding.current = true;
    requestRef.current = requestAnimationFrame(smoothScrollFrame);
  };

  const handlePointerUp = () => {
    if (!isHolding.current) return;
    isHolding.current = false;
    if (requestRef.current) cancelAnimationFrame(requestRef.current);

    const duration = Date.now() - pointerDownTime.current;
    if (duration < tapThreshold) {
      // It was a tap, magnetize to next section
      goToNextSection();
    }
  };

  const handlePointerLeave = () => {
    if (isHolding.current) {
      isHolding.current = false;
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
  };

  const goToNextSection = () => {
    if (!sections || sections.length === 0) return;
    
    // Find next section
    let currentIndex = sections.indexOf(activeSection);
    
    // If we're above the first section (currentIndex = -1), go to the first
    let nextIndex = currentIndex === -1 ? 0 : currentIndex + 1;
    
    if (nextIndex < sections.length) {
      const targetId = sections[nextIndex];
      const el = document.getElementById(targetId);
      
      if (el) {
        const navHeight = 56;
        const top = el.getBoundingClientRect().top + window.scrollY - navHeight;
        
        // Custom slow "magnetize" scroll using framer-motion's animate function
        animate(window.scrollY, top, {
          type: "spring",
          stiffness: 40,
          damping: 15,
          mass: 1.2,
          onUpdate: (latest) => window.scrollTo({ top: latest, behavior: 'instant' })
        });
      }
    }
  };

  // Hide the button if we are in the last section and near the bottom
  const isAtBottom = activeSection === sections[sections.length - 1];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ 
        opacity: isAtBottom ? 0 : 1, 
        scale: isAtBottom ? 0.8 : 1,
        y: isAtBottom ? 20 : 0
      }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'fixed',
        bottom: 40,
        right: 40,
        zIndex: 9000,
        pointerEvents: isAtBottom ? 'none' : 'auto'
      }}
    >
      <motion.button
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerLeave}
        onPointerLeave={handlePointerLeave}
        onContextMenu={(e) => e.preventDefault()}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none',
          width: 54,
          height: 54,
          borderRadius: '50%',
          background: 'rgba(var(--ambient-r),var(--ambient-g),var(--ambient-b),0.08)',
          border: '1px solid rgba(var(--ambient-r),var(--ambient-g),var(--ambient-b),0.25)',
          color: 'var(--fg)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          cursor: 'none',
          outline: 'none',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          transition: 'background 0.3s, border-color 0.3s'
        }}
      >
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={22} style={{ color: 'rgb(var(--ambient-r),var(--ambient-g),var(--ambient-b))' }} />
        </motion.div>
        
        {/* Subtle ring effect on hover */}
        <motion.div 
          style={{
            position: 'absolute', inset: -6, borderRadius: '50%',
            border: '1px solid rgba(var(--ambient-r),var(--ambient-g),var(--ambient-b),0.1)',
            pointerEvents: 'none'
          }}
        />
      </motion.button>
      
      {/* Label for context (optional, can be removed if too cluttered) */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: '100%',
          right: '50%',
          transform: 'translateX(50%)',
          marginBottom: 12,
          fontFamily: 'var(--mono)',
          fontSize: 8,
          letterSpacing: 2,
          textTransform: 'uppercase',
          color: 'var(--fg-muted)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          textAlign: 'center'
        }}
      >
        Hold/Tap
      </motion.div>
    </motion.div>
  );
}