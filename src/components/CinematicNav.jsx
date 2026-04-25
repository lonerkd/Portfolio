import React, { useRef, useEffect, useState } from 'react';
import { motion, animate, useAnimation } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

/* ══════════════════════════════════════
   CinematicNav - Apple Style
   Hold to fast scroll, tap to next section
   ══════════════════════════════════════ */

export default function CinematicNav({ sections, activeSection, scrollToSection }) {
  const [isHovered, setIsHovered] = useState(false);
  const ringControls = useAnimation();

  const handlePointerLeave = () => {
    setIsHovered(false);
    ringControls.start({
      scale: 1,
      borderWidth: '1px',
      borderColor: 'rgba(var(--ambient-r),var(--ambient-g),var(--ambient-b),0.15)',
      transition: { duration: 0.3 }
    });
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
    ringControls.start({
      scale: 1.1,
      borderColor: 'rgba(var(--ambient-r),var(--ambient-g),var(--ambient-b),0.4)',
      transition: { duration: 0.3 }
    });
  };

  const goToNextSection = () => {
    if (!sections || sections.length === 0) return;
    
    const navHeight = 80; // Updated nav height
    const currentScroll = window.scrollY;
    
    // Find the first section whose top is at least 100px below current scroll
    const nextSectionId = sections.find(id => {
      const el = document.getElementById(id);
      if (!el) return false;
      const top = el.getBoundingClientRect().top + currentScroll - navHeight;
      return top > currentScroll + 50; // Threshold to ensure we don't snap to same section
    });

    if (nextSectionId) {
      const el = document.getElementById(nextSectionId);
      const top = el.getBoundingClientRect().top + currentScroll - navHeight;
      
      animate(currentScroll, top, {
        type: "spring",
        stiffness: 45,
        damping: 20,
        mass: 1,
        onUpdate: (latest) => window.scrollTo({ top: latest, behavior: 'auto' })
      });
    } else {
      // If no next section, maybe we are at the end? Do nothing or scroll to top?
      // User said "intelligently navigate perfectly to highlight whatever section is nearby"
    }
  };

  const isAtBottom = activeSection === sections[sections.length - 1];

  const handleBottomClick = () => {
    if (isAtBottom) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      goToNextSection();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        y: 0
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
      <div 
        style={{ position: 'relative', width: 54, height: 54 }}
        onClick={handleBottomClick}
        onPointerLeave={handlePointerLeave}
        onPointerEnter={handlePointerEnter}
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* Apple-style frosted base button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: 'rgba(10,10,10,0.6)',
            border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            cursor: 'none',
            outline: 'none',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            transition: 'background 0.3s ease',
            position: 'relative',
            zIndex: 2
          }}
        >
          <motion.div
            animate={{ y: [0, 3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown 
              size={20} 
              style={{ 
                transform: isAtBottom ? 'rotate(180deg)' : 'none',
                color: isHovered 
                  ? 'rgb(var(--ambient-r),var(--ambient-g),var(--ambient-b))' 
                  : 'rgba(255,255,255,0.7)',
                transition: 'color 0.3s ease, transform 0.3s ease'
              }} 
            />
          </motion.div>
        </motion.button>
        
        {/* Dynamic expanding ring */}
        <motion.div 
          animate={ringControls}
          initial={{ scale: 1, borderWidth: '1px', borderColor: 'rgba(var(--ambient-r),var(--ambient-g),var(--ambient-b),0.15)' }}
          style={{
            position: 'absolute', inset: -4, borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 1
          }}
        />
      </div>
    </motion.div>
  );
}
