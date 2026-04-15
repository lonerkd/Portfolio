import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { thumbUrl, thumbFallback } from '../App';

/* ══════════════════════════════════════
   VideoCard3D — 3D tilt + color bloom
   ══════════════════════════════════════ */

export default function VideoCard3D({ video, onClick, extractColor, setAmbientColor, resetColor, featured = false }) {
  const [isHovered, setIsHovered] = useState(false);
  const [dominantColor, setDominantColor] = useState(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const cardRef = useRef(null);
  const rafRef = useRef(null);
  const targetRot = useRef({ x: 0, y: 0 });
  const currentRot = useRef({ x: 0, y: 0 });

  // Extract color on mount — uses YouTube thumbnail if available
  useEffect(() => {
    if (!extractColor) return;
    const url = thumbUrl(video);
    if (url) extractColor(video.id, url).then(setDominantColor);
  }, [video, extractColor]);

  // 3D tilt with lerp
  const animateTilt = useCallback(() => {
    const lerp = (a, b, t) => a + (b - a) * t;
    currentRot.current.x = lerp(currentRot.current.x, targetRot.current.x, 0.1);
    currentRot.current.y = lerp(currentRot.current.y, targetRot.current.y, 0.1);
    setRotation({ x: currentRot.current.x, y: currentRot.current.y });
    if (isHovered) rafRef.current = requestAnimationFrame(animateTilt);
  }, [isHovered]);

  useEffect(() => {
    if (isHovered) rafRef.current = requestAnimationFrame(animateTilt);
    else {
      targetRot.current = { x: 0, y: 0 };
      rafRef.current = requestAnimationFrame(animateTilt);
    }
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [isHovered, animateTilt]);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    setMousePos({ x: x * 100, y: y * 100 });
    // Tilt: max ±12deg
    targetRot.current = {
      y: (x - 0.5) * (featured ? 8 : 14),
      x: -(y - 0.5) * (featured ? 6 : 10),
    };
  }, [featured]);

  const handleEnter = () => {
    setIsHovered(true);
    if (dominantColor && setAmbientColor) setAmbientColor(dominantColor);
  };

  const handleLeave = () => {
    setIsHovered(false);
    targetRot.current = { x: 0, y: 0 };
    if (resetColor) resetColor();
  };

  const dc = dominantColor;
  const glowColor = dc ? `rgb(${dc.r},${dc.g},${dc.b})` : 'var(--accent)';
  const glowAlpha = dc ? `rgba(${dc.r},${dc.g},${dc.b},` : 'rgba(255,60,0,';

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1000, cursor: 'none' }}
      data-cursor="play"
    >
      <motion.div
        ref={cardRef}
        className={`video-card card ${featured ? 'card--featured' : ''}`}
        onClick={() => onClick(video, dominantColor)}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onMouseMove={handleMouseMove}
        style={{
          aspectRatio: featured ? '21/9' : '16/9',
          position: 'relative', overflow: 'hidden',
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: isHovered ? 'box-shadow 0.4s, border-color 0.4s' : 'transform 0.6s cubic-bezier(0.16,1,0.3,1), box-shadow 0.6s, border-color 0.6s',
          boxShadow: isHovered
            ? `0 30px 80px rgba(0,0,0,0.5), 0 0 120px ${glowAlpha}0.15), inset 0 1px 0 rgba(255,255,255,0.06)`
            : `0 10px 40px rgba(0,0,0,0.3)`,
          borderColor: isHovered ? `${glowAlpha}0.2)` : 'rgba(255,255,255,0.04)',
          willChange: 'transform',
        }}
      >
        {/* Thumbnail */}
        <motion.div
          animate={{ scale: isHovered ? 1.08 : 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{ position: 'absolute', inset: -1 }}
        >
          <img
            src={thumbUrl(video)}
            alt={video.title}
            loading="lazy"
            style={{
              width: '100%', height: '100%', objectFit: 'cover', display: 'block',
              opacity: isHovered ? 0.6 : 0.38,
              transition: 'opacity 0.7s',
            }}
            onError={e => {
              if (!e.target.dataset.fb) { e.target.dataset.fb = '1'; e.target.src = thumbFallback(video); }
              else e.target.style.opacity = '0';
            }}
          />
        </motion.div>

        {/* Gradient vignette */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(160deg, transparent 20%, rgba(0,0,0,0.9) 100%)',
        }} />

        {/* Cursor-tracking color bloom */}
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: dc
              ? `radial-gradient(ellipse 70% 70% at ${mousePos.x}% ${mousePos.y}%, ${glowAlpha}0.18) 0%, transparent 60%)`
              : 'none',
          }}
        />

        {/* Shimmer edge on hover */}
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0 }}
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: `linear-gradient(135deg, ${glowAlpha}0.06) 0%, transparent 40%, ${glowAlpha}0.04) 100%)`,
          }}
        />

        {/* Category pill */}
        <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 5 }}>
          <span className="pill" style={{
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
            fontSize: 7, letterSpacing: 3,
            borderColor: isHovered ? `${glowAlpha}0.25)` : 'rgba(255,255,255,0.05)',
            color: isHovered ? glowColor : 'var(--fg-muted)',
            transition: 'border-color 0.4s, color 0.4s',
          }}>
            {video.cat}
          </span>
        </div>

        {/* Center play button */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 5,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <motion.div
            animate={{
              scale: isHovered ? 1.15 : 0.85,
              opacity: isHovered ? 1 : 0.5,
            }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: featured ? 88 : 68, height: featured ? 88 : 68,
              borderRadius: '50%',
              background: isHovered ? `${glowAlpha}0.15)` : 'rgba(255,255,255,0.04)',
              border: `1.5px solid ${isHovered ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)'}`,
              backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.4s, border-color 0.4s',
            }}
          >
            {/* Triangle play icon */}
            <svg width={featured ? 24 : 18} height={featured ? 24 : 18} viewBox="0 0 24 24" fill="none">
              <polygon points="6,4 20,12 6,20" fill="rgba(255,255,255,0.9)" />
            </svg>
          </motion.div>
        </div>

        {/* Bottom info */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: featured ? '32px 28px' : '22px 22px', zIndex: 5,
        }}>
          <motion.h3
            animate={{ x: isHovered ? 10 : 0, y: isHovered ? -2 : 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: 'var(--display)',
              fontSize: featured ? 'clamp(2.5rem, 5vw, 4rem)' : 'clamp(1.6rem, 4vw, 2.4rem)',
              letterSpacing: 1, lineHeight: 1, color: 'var(--fg)',
            }}
          >
            {video.title}
          </motion.h3>

          <motion.div
            animate={{ x: isHovered ? 10 : 0, opacity: isHovered ? 0.65 : 0.3 }}
            transition={{ duration: 0.5, delay: 0.04 }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}
          >
            <span style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: 2.5, textTransform: 'uppercase' }}>
              {video.role}
            </span>
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'currentColor', opacity: 0.4, flexShrink: 0 }} />
            <span style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: 2 }}>{video.year}</span>
          </motion.div>

          {/* Description appears on hover for featured */}
          {featured && (
            <motion.p
              animate={{ opacity: isHovered ? 0.5 : 0, y: isHovered ? 0 : 12 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              style={{
                fontFamily: 'var(--serif)', fontSize: 14,
                fontStyle: 'italic', lineHeight: 1.6, marginTop: 10,
                maxWidth: 520,
              }}
            >
              {video.desc}
            </motion.p>
          )}
        </div>

        {/* 3D highlight sheen — follows tilt */}
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0 }}
          style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: `linear-gradient(${135 + rotation.y * 3}deg, rgba(255,255,255,0.04) 0%, transparent 50%)`,
            borderRadius: 'inherit',
          }}
        />
      </motion.div>
    </motion.div>
  );
}
