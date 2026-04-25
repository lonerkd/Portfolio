import React, { useRef, useEffect, useState } from 'react';
import { motion, animate, useAnimation } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

/* ══════════════════════════════════════
   CinematicNav - Apple Style
   Hold to fast scroll, tap to next adaptable frame
   ══════════════════════════════════════ */

export default function CinematicNav({ sections, activeSection, scrollToSection }) {
  const scrollSpeed = 2.5; // Smooth cinematic scroll speed
  const tapThreshold = 250;
  
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  const requestRef = useRef(null);
  const pointerDownTime = useRef(0);
  const isHolding = useRef(false);
  const scrollTimeout = useRef(null);
  
  const ringControls = useAnimation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const documentHeight = document.documentElement.offsetHeight;
      setIsAtBottom(scrollPosition >= documentHeight - 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
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

  const goToNextFrame = () => {
    const navHeight = 80;
    const currentScroll = window.scrollY;

    // Context-driven targets: main sections, individual cards, and bento items
    const frameElements = Array.from(document.querySelectorAll('section, .card, .bento-item'));

    const positions = frameElements.map(el => {
      return el.getBoundingClientRect().top + currentScroll - navHeight - 20;
    });

    // Deduplicate closely spaced positions (group items in the same row) and sort
    const uniquePositions = [...new Set(positions.map(p => Math.round(p / 10) * 10))].sort((a, b) => a - b);

    // Find the next logical stopping point below our current scroll
    const nextPos = uniquePositions.find(pos => pos > currentScroll + 30);

    if (nextPos) {
      animate(currentScroll, nextPos, {
        type: "spring",
        stiffness: 45,
        damping: 20,
        mass: 1,
        onUpdate: (latest) => window.scrollTo({ top: latest, behavior: 'auto' })
      });
    } else {
      // Fallback scroll if no clear frame is found
      animate(currentScroll, currentScroll + window.innerHeight * 0.8, {
        type: "spring",
        stiffness: 45,
        damping: 20,
        mass: 1,
        onUpdate: (latest) => window.scrollTo({ top: latest, behavior: 'auto' })
      });
    }
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
    
    // If it was a quick tap, advance frame
    if (duration < tapThreshold) {
      const isActuallyBottom = window.innerHeight + window.scrollY >= document.documentElement.offsetHeight - 50;
      if (isActuallyBottom) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        goToNextFrame();
      }
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
        pointerEvents: 'auto' // ensure it can be clicked even at the bottom
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
            touchAction: 'none',
            WebkitUserSelect: 'none',
            userSelect: 'none',
            WebkitTouchCallout: 'none',
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