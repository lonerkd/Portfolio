import { useState, useCallback, useRef, useEffect } from 'react';

/* ══════════════════════════════════════
   useColorExtractor — v3
   YouTube thumbnail color extraction +
   live video frame sampling via canvas
   ══════════════════════════════════════ */

export const DEFAULT_COLOR = { r: 255, g: 60, b: 0 };

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  let h, s, l = (max+min)/2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d/(2-max-min) : d/(max+min);
    switch(max) {
      case r: h = ((g-b)/d+(g<b?6:0))/6; break;
      case g: h = ((b-r)/d+2)/6; break;
      case b: h = ((r-g)/d+4)/6; break;
    }
  }
  return { h: Math.round(h*360), s: Math.round(s*100), l: Math.round(l*100) };
}

function extractDominantColor(imgElement) {
  return new Promise((resolve) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      const size = 80;
      canvas.width = size; canvas.height = size;
      ctx.drawImage(imgElement, 0, 0, size, size);
      const data = ctx.getImageData(0, 0, size, size).data;
      const buckets = {};
      let best = { score: 0, color: DEFAULT_COLOR };
      for (let i = 0; i < data.length; i += 12) {
        const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
        if (a < 128) continue;
        const max = Math.max(r,g,b), min = Math.min(r,g,b);
        const l = (max+min)/2;
        if (l < 40 || l > 235) continue; // Raised minimum lightness so UI remains visible
        const sat = max===min ? 0 : l>127 ? (max-min)/(510-max-min) : (max-min)/(max+min);
        const key = `${Math.round(r/24)*24},${Math.round(g/24)*24},${Math.round(b/24)*24}`;
        if (!buckets[key]) buckets[key] = { r, g, b, count: 0, sat: 0 };
        buckets[key].count++;
        buckets[key].sat = Math.max(buckets[key].sat, sat);
        const score = buckets[key].sat * 1.5 * Math.sqrt(buckets[key].count);
        if (score > best.score) best = { score, color: { r: buckets[key].r, g: buckets[key].g, b: buckets[key].b } };
      }
      resolve(best.color);
    } catch { resolve(DEFAULT_COLOR); }
  });
}

function extractFromUrl(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => extractDominantColor(img).then(resolve);
    img.onerror = () => resolve(DEFAULT_COLOR);
    img.src = url;
    setTimeout(() => resolve(DEFAULT_COLOR), 5000);
  });
}

export function useColorExtractor() {
  const [colorCache, setColorCache] = useState({});
  const [activeColor, setActiveColorState] = useState(DEFAULT_COLOR);
  const transitionRef = useRef(null);
  const currentRef = useRef(DEFAULT_COLOR);
  const videoSamplerRef = useRef(null); // for live video frame sampling

  const animateToColor = useCallback((target) => {
    if (transitionRef.current) cancelAnimationFrame(transitionRef.current);
    const start = { ...currentRef.current };
    const startTime = performance.now();
    const duration = 1200; // Slower, more cinematic transition
    const ease = t => 1 - Math.pow(1-t, 4);
    const tick = (now) => {
      const p = Math.min((now-startTime)/duration, 1);
      const e = ease(p);
      const c = {
        r: Math.round(start.r+(target.r-start.r)*e),
        g: Math.round(start.g+(target.g-start.g)*e),
        b: Math.round(start.b+(target.b-start.b)*e),
      };
      const root = document.documentElement;
      root.style.setProperty('--ambient-r', c.r);
      root.style.setProperty('--ambient-g', c.g);
      root.style.setProperty('--ambient-b', c.b);
      const hsl = rgbToHsl(c.r, c.g, c.b);
      root.style.setProperty('--ambient-h', hsl.h);
      root.style.setProperty('--ambient-s', hsl.s + '%');
      root.style.setProperty('--ambient-l', hsl.l + '%');
      currentRef.current = c;
      if (p < 1) transitionRef.current = requestAnimationFrame(tick);
    };
    transitionRef.current = requestAnimationFrame(tick);
  }, []);

  const setAmbientColor = useCallback((color) => {
    const target = color || DEFAULT_COLOR;
    setActiveColorState(target);
    animateToColor(target);
  }, [animateToColor]);

  // Extract from YouTube thumbnail URL
  const extractColor = useCallback(async (id, url) => {
    if (colorCache[id]) return colorCache[id];
    const color = await extractFromUrl(url);
    setColorCache(prev => ({ ...prev, [id]: color }));
    return color;
  }, [colorCache]);

  // Live video frame sampling — call with a <video> element ref
  // Works when you have direct video element access (not iframe)
  const startLiveFrameSampling = useCallback((videoEl, onColorUpdate) => {
    stopLiveFrameSampling();
    if (!videoEl) return;
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 36;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let frame = 0;

    const sample = () => {
      frame++;
      if (frame % 30 !== 0) { // Sample every 30 RAF frames (~0.5s at 60fps)
        videoSamplerRef.current = requestAnimationFrame(sample);
        return;
      }
      try {
        ctx.drawImage(videoEl, 0, 0, 64, 36);
        extractDominantColor(canvas).then(color => {
          onColorUpdate(color);
          animateToColor(color);
        });
      } catch(e) {}
      videoSamplerRef.current = requestAnimationFrame(sample);
    };
    videoSamplerRef.current = requestAnimationFrame(sample);
  }, [animateToColor]);

  const stopLiveFrameSampling = useCallback(() => {
    if (videoSamplerRef.current) {
      cancelAnimationFrame(videoSamplerRef.current);
      videoSamplerRef.current = null;
    }
  }, []);

  const resetColor = useCallback(() => setAmbientColor(null), [setAmbientColor]);

  useEffect(() => () => {
    if (transitionRef.current) cancelAnimationFrame(transitionRef.current);
    if (videoSamplerRef.current) cancelAnimationFrame(videoSamplerRef.current);
  }, []);

  return {
    activeColor, colorCache,
    setAmbientColor, extractColor, resetColor,
    startLiveFrameSampling, stopLiveFrameSampling,
  };
}
