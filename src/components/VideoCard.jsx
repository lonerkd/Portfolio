import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { thumbUrl, thumbFallback } from '../App';

/* ══════════════════════════════════════
   VideoCard — Clean Apple-style Bento Box
   ══════════════════════════════════════ */

export default function VideoCard({ video, onClick, extractColor, setAmbientColor, resetColor, featured = false }) {
  const [isHovered, setIsHovered] = useState(false);
  const [dominantColor, setDominantColor] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const cardRef = useRef(null);

  // Extract color on mount
  useEffect(() => {
    if (!extractColor) return;
    const url = thumbUrl(video);
    if (url) extractColor(video.id, url).then(setDominantColor);
  }, [video, extractColor]);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    setMousePos({ x: x * 100, y: y * 100 });
  }, []);

  const handleEnter = () => {
    setIsHovered(true);
    if (dominantColor && setAmbientColor) setAmbientColor(dominantColor);
  };

  const handleLeave = () => {
    setIsHovered(false);
    if (resetColor) resetColor();
  };

  const dc = dominantColor;
  const glowAlpha = dc ? `rgba(${dc.r},${dc.g},${dc.b},` : 'rgba(255,255,255,';

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`card ${featured ? 'card--featured' : ''}`}
      onClick={() => onClick(video, dominantColor)}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onMouseMove={handleMouseMove}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      style={{
        cursor: 'none',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: featured ? '400px' : '280px',
        position: 'relative',
        overflow: 'hidden',
        background: '#0a0a0a',
        borderColor: isHovered ? `${glowAlpha}0.3)` : 'rgba(255,255,255,0.06)',
        boxShadow: isHovered 
          ? `0 20px 40px rgba(0,0,0,0.6), 0 0 60px ${glowAlpha}0.15)` 
          : '0 10px 30px rgba(0,0,0,0.4)',
        transition: 'border-color 0.6s ease, box-shadow 0.6s ease',
      }}
    >
      {/* Background Image Container */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <motion.img
          src={thumbUrl(video)}
          alt={video.title}
          loading="lazy"
          animate={{ 
            scale: isHovered ? 1.05 : 1,
            filter: isHovered ? 'brightness(0.5) blur(2px)' : 'brightness(0.7) blur(0px)'
          }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: '100%', height: '100%', 
            objectFit: 'cover', 
            objectPosition: video.objectPosition || 'center',
            display: 'block',
          }}
          onError={e => {
            if (!e.target.dataset.fb) { e.target.dataset.fb = '1'; e.target.src = thumbFallback(video); }
            else e.target.style.opacity = '0';
          }}
        />
      </div>

      {/* Subtle bottom gradient for text readability */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
        pointerEvents: 'none'
      }} />

      {/* Mouse tracking soft glow overlay */}
      <motion.div
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: dc
            ? `radial-gradient(circle 400px at ${mousePos.x}% ${mousePos.y}%, ${glowAlpha}0.15), transparent 80%)`
            : 'none',
          mixBlendMode: 'screen'
        }}
      />

      {/* Category Pill (Top Right) */}
      <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 10 }}>
        <span style={{
          display: 'inline-block',
          padding: '6px 14px',
          borderRadius: '20px',
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.08)',
          fontFamily: 'var(--mono)',
          fontSize: '9px',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: 'var(--fg)',
        }}>
          {video.cat}
        </span>
      </div>

      {/* Content Container (Bottom) */}
      <div style={{ 
        position: 'absolute', 
        bottom: 0, left: 0, right: 0, 
        padding: '30px',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end'
      }}>
        
        {/* Title */}
        <motion.h3
          animate={{ y: isHovered ? -4 : 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'var(--sans)',
            fontWeight: 600,
            fontSize: featured ? 'clamp(1.8rem, 3vw, 2.8rem)' : 'clamp(1.4rem, 2vw, 2rem)',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            color: 'var(--fg)',
            marginBottom: '8px'
          }}
        >
          {video.title}
        </motion.h3>

        {/* Metadata */}
        <motion.div
          animate={{ opacity: isHovered ? 0.9 : 0.6 }}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px',
            fontFamily: 'var(--mono)', fontSize: '10px', 
            letterSpacing: '1px', textTransform: 'uppercase',
            color: 'var(--fg)'
          }}
        >
          <span>{video.role}</span>
          <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'currentColor', opacity: 0.5 }} />
          <span>{video.year}</span>
        </motion.div>

        {/* Expandable Description (Only for featured/large cards on hover) */}
        <AnimatePresence>
          {isHovered && featured && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <p style={{
                fontFamily: 'var(--sans)',
                fontWeight: 400,
                fontSize: '0.95rem',
                lineHeight: 1.5,
                color: 'var(--fg-muted)',
                maxWidth: '90%'
              }}>
                {video.desc}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Center Play Button (Frosted Glass) */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <motion.div
          animate={{
            scale: isHovered ? 1 : 0.9,
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 10
          }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: 64, height: 64,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
          }}
        >
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" style={{ marginLeft: 3 }}>
            <polygon points="6,4 20,12 6,20" fill="rgba(255,255,255,0.9)" />
          </svg>
        </motion.div>
      </div>

    </motion.div>
  );
}