import React, { useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, ChevronLeft } from 'lucide-react';
import { embedUrl, watchUrl } from '../App';

/* ══════════════════════════════════════
   VideoOverlay V2 — Cinematic letterbox
   One-click dismiss, swipe-down mobile
   ══════════════════════════════════════ */

export default function VideoOverlay({ video, dominantColor, onClose }) {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const touchStartY = useRef(0);
  const dragY = useRef(0);

  // Lock scroll + ESC
  useEffect(() => {
    if (!video) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [video, onClose]);

  const handleBackdropClick = useCallback((e) => {
    if (e.target === overlayRef.current) onClose();
  }, [onClose]);

  // Swipe to dismiss (mobile)
  const handleTouchStart = (e) => { touchStartY.current = e.touches[0].clientY; };
  const handleTouchMove = (e) => {
    const d = e.touches[0].clientY - touchStartY.current;
    if (d > 0 && contentRef.current) {
      dragY.current = d;
      contentRef.current.style.transform = `translateY(${d * 0.6}px)`;
      contentRef.current.style.opacity = String(Math.max(0.3, 1 - d / 350));
    }
  };
  const handleTouchEnd = () => {
    if (dragY.current > 100) { onClose(); }
    else if (contentRef.current) {
      contentRef.current.style.transform = '';
      contentRef.current.style.opacity = '';
    }
    dragY.current = 0;
  };

  const dc = dominantColor || { r: 255, g: 60, b: 0 };
  const gc = `rgba(${dc.r},${dc.g},${dc.b},`;

  return (
    <AnimatePresence>
      {video && (
        <motion.div
          ref={overlayRef}
          onClick={handleBackdropClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9500,
            background: 'rgba(0,0,0,0.92)',
            backdropFilter: 'blur(24px) saturate(140%)',
            WebkitBackdropFilter: 'blur(24px) saturate(140%)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            cursor: 'none',
          }}
        >
          {/* BIG color wash behind everything */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: `radial-gradient(ellipse 80% 60% at 50% 40%, ${gc}0.18) 0%, transparent 70%)`,
            }}
          />

          {/* Letterbox bars top & bottom */}
          <motion.div
            initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} exit={{ scaleY: 0 }}
            transition={{ duration: 0.4, ease: [0.16,1,0.3,1] }}
            style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 48,
              background: 'rgba(0,0,0,0.8)', transformOrigin: 'top',
              display: 'flex', alignItems: 'center', padding: '0 20px',
              justifyContent: 'space-between', zIndex: 10,
            }}
          >
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: 3,
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)',
                background: 'none', border: 'none', cursor: 'none',
              }}
            >
              <ChevronLeft size={14} /> BACK
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'none', color: 'white',
              }}
            >
              <X size={16} />
            </button>
          </motion.div>

          <motion.div
            initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} exit={{ scaleY: 0 }}
            transition={{ duration: 0.4, ease: [0.16,1,0.3,1] }}
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: 48,
              background: 'rgba(0,0,0,0.8)', transformOrigin: 'bottom', zIndex: 10,
            }}
          />

          {/* Content */}
          <motion.div
            ref={contentRef}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.94, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 30 }}
            transition={{ duration: 0.5, ease: [0.16,1,0.3,1] }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              width: '100%', maxWidth: 1100,
              padding: '60px 20px 60px',
              overflowY: 'auto', maxHeight: '100vh',
              msOverflowStyle: 'none', scrollbarWidth: 'none',
            }}
          >
            {/* Swipe handle */}
            <div style={{
              width: 40, height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.12)',
              margin: '0 auto 24px',
            }} />

            {/* Video player */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              style={{
                aspectRatio: '16/9', background: '#000',
                borderRadius: 12, overflow: 'hidden',
                boxShadow: `0 0 0 1px rgba(255,255,255,0.06), 0 30px 100px rgba(0,0,0,0.7), 0 0 120px ${gc}0.1)`,
              }}
            >
              <iframe
                src={embedUrl(video)}
                width="100%" height="100%"
                allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen
                style={{ border: 'none', display: 'block' }}
                title={video.title}
              />
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              style={{ marginTop: 28, padding: '0 4px' }}
            >
              <span className="pill pill--accent" style={{
                background: `${gc}0.1)`,
                borderColor: `${gc}0.25)`,
                color: `rgb(${dc.r},${dc.g},${dc.b})`,
              }}>
                {video.cat}
              </span>

              <h2 style={{
                fontFamily: 'var(--display)',
                fontSize: 'clamp(2.5rem, 7vw, 5rem)',
                lineHeight: 0.9, letterSpacing: 1, marginTop: 14,
              }}>
                {video.title}
              </h2>

              <p style={{
                fontFamily: 'var(--serif)', fontSize: 16,
                lineHeight: 1.75, color: 'var(--fg-muted)',
                fontStyle: 'italic', marginTop: 14, maxWidth: 580,
              }}>
                {video.desc}
              </p>

              {/* Meta row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                style={{
                  marginTop: 24, paddingTop: 20,
                  borderTop: `1px solid ${gc}0.1)`,
                  display: 'flex', flexWrap: 'wrap', gap: '16px 40px',
                }}
              >
                {[['ROLE', video.role], ['YEAR', video.year], ['BY', 'Peter Olowude']].map(([k, v]) => (
                  <div key={k}>
                    <div style={{ fontSize: 8, letterSpacing: 3, color: 'rgba(255,255,255,0.18)', fontFamily: 'var(--mono)', marginBottom: 5 }}>{k}</div>
                    <div style={{ fontSize: 11, letterSpacing: 2, color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--mono)' }}>{v}</div>
                  </div>
                ))}
              </motion.div>

              <motion.a
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                href={watchUrl(video)}
                target="_blank" rel="noopener noreferrer"
                className="magnetic-btn"
                style={{ marginTop: 28, display: 'inline-flex', textDecoration: 'none' }}
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink size={13} /> {video.yt ? 'Watch on YouTube' : 'Watch Full Quality'}
              </motion.a>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
