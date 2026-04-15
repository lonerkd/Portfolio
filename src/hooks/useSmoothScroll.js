import { useState, useEffect, useCallback, useRef } from 'react';

/* ══════════════════════════════════════
   useSmoothScroll
   Scroll progress + active section tracker
   ══════════════════════════════════════ */

export function useSmoothScroll(sectionIds = []) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const rafRef = useRef(null);

  const handleScroll = useCallback(() => {
    if (rafRef.current) return;

    rafRef.current = requestAnimationFrame(() => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      
      setScrollProgress(Math.min(Math.max(progress, 0), 1));
      setIsScrolled(scrollTop > 60);

      // Find active section
      let current = '';
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.4) {
            current = id;
          }
        }
      }
      setActiveSection(current);

      rafRef.current = null;
    });
  }, [sectionIds]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll]);

  const scrollToSection = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) {
      const navHeight = 56;
      const top = el.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, []);

  return {
    scrollProgress,
    activeSection,
    isScrolled,
    scrollToSection,
  };
}
