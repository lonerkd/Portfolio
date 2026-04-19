import React, { useRef, useEffect, useState } from 'react';
import { motion, animate, useAnimation } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

/* ══════════════════════════════════════
   CinematicNav - Apple Style
   Hold to fast scroll, tap to next section
   ══════════════════════════════════════ */

export default function CinematicNav({ sections, activeSection, scrollToSection }) {
  const scrollSpeed = 2.5; // Significantly slower for info consumption
  const tapThreshold = 250;
  
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const requestRef = useRef(null);
  const pointerDownTime = useRef(0);
  const isHolding = useRef(false);
  const scrollTimeout = useRef(null);
  
  const ringControls = useAnimation();

  useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, []);

  const smoothScrollFrame = () => {
    if (isHolding.current) {
      window.scrollBy({ top: scrollSpeed, behavior: 'auto' });
      requestRef.current = requestAnimationFrame(smoothScrollFrame);
    }
  };

  const handlePointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    
    setIsPressed(true);
    pointerDownTime.current = Date.now();
    isHolding.current = true;
    
    // Animate ring filling up to indicate hold action
    ringControls.start({
      scale: 1.3,
      borderWidth: '3px',
      borderColor: 'rgba(var(--ambient-r),var(--ambient-g),var(--ambient-b),0.8)',
      transition: { duration: 0.8, ease: 'easeOut' }
    });

    scrollTimeout.current = setTimeout(() => {
      if (isHolding.current) {
        requestRef.current = requestAnimationFrame(smoothScrollFrame);
      }
    }, tapThreshold);
  };

  const handlePointerUp = () => {
    setIsPressed(false);
    
    // Reset ring
    ringControls.start({
      scale: isHovered ? 1.1 : 1,
      borderWidth: '1px',
      borderColor: 'rgba(var(--ambient-r),var(--ambient-g),var(--ambient-b),0.15)',
      transition: { duration: 0.3, ease: 'easeOut' }
    });

    if (!isHolding.current) return;
    isHolding.current = false;
    
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    if (requestRef.current) cancelAnimationFrame(requestRef.current);

    const duration = Date.now() - pointerDownTime.current;
    if (duration < tapThreshold) {
      goToNextSection();
    }
  };

  const handlePointerLeave = () => {
    setIsPressed(false);
    setIsHovered(false);
    isHolding.current = false;
    
    ringControls.start({
      scale: 1,
      borderWidth: '1px',
      borderColor: 'rgba(var(--ambient-r),var(--ambient-g),var(--ambient-b),0.15)',
      transition: { duration: 0.3 }
    });

    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
    if (!isPressed) {
      ringControls.start({
        scale: 1.1,
        borderColor: 'rgba(var(--ambient-r),var(--ambient-g),var(--ambient-b),0.4)',
        transition: { duration: 0.3 }
      });
    }
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
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerLeave}
        onPointerLeave={handlePointerLeave}
        onPointerEnter={handlePointerEnter}
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* Apple-style frosted base button */}
        <motion.button
          animate={{ scale: isPressed ? 0.9 : 1 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: isPressed 
              ? 'rgba(var(--ambient-r),var(--ambient-g),var(--ambient-b),0.2)' 
              : 'rgba(10,10,10,0.6)',
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
            animate={{ y: isPressed ? 0 : [0, 3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown 
              size={20} 
              style={{ 
                transform: isAtBottom ? 'rotate(180deg)' : 'none',
                color: isHovered || isPressed 
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
