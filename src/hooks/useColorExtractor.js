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
      let best = { score: 0, color: null };
      
      for (let i = 0; i < data.length; i += 12) {
        const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
        if (a < 128) continue;
        
        const max = Math.max(r,g,b), min = Math.min(r,g,b);
        const l = (max+min)/2;
        
        // Very dark or very light colors are ignored
        if (l < 20 || l > 240) continue; 
        
        const sat = max===min ? 0 : l>127 ? (max-min)/(510-max-min) : (max-min)/(max+min);
        
        const key = `${Math.round(r/24)*24},${Math.round(g/24)*24},${Math.round(b/24)*24}`;
        if (!buckets[key]) buckets[key] = { r, g, b, count: 0, sat: 0 };
        
        buckets[key].count++;
        buckets[key].sat = Math.max(buckets[key].sat, sat);
        
        // Base score: relies on frequency and saturation
        let score = buckets[key].sat * 1.5 * Math.sqrt(buckets[key].count);
        
        // If it's a very vibrant color, give it a massive boost
        if (sat > 0.5) score *= 2;
        
        // Penalize likely skin tones or warm grays (r > g > b, lowish sat)
        if (r > g && g > b && sat < 0.6 && r < 200) {
          score *= 0.3; // Reduce priority of muddy browns/skin tones
        }

        if (score > best.score) {
          best = { score, color: { r: buckets[key].r, g: buckets[key].g, b: buckets[key].b } };
        }
      }
      
      // If we found a color, make sure it has at least *some* minimum lightness for the UI 
      if (best.color) {
        // Boost lightness artificially if it's too dark for UI visibility
        let { r, g, b } = best.color;
        const max = Math.max(r,g,b);
        if (max < 100) {
          const multiplier = 100 / max;
          r = Math.min(255, Math.round(r * multiplier));
          g = Math.min(255, Math.round(g * multiplier));
          b = Math.min(255, Math.round(b * multiplier));
        }
        resolve({ r, g, b });
      } else {
        resolve(DEFAULT_COLOR);
      }
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

  const isRainbowActive = useRef(false);

  const triggerRainbow = useCallback(() => {
    if (transitionRef.current) cancelAnimationFrame(transitionRef.current);
    
    // Toggle rainbow mode
    isRainbowActive.current = !isRainbowActive.current;
    
    if (!isRainbowActive.current) {
      // Revert to active color if turning off
      setAmbientColor(currentRef.current);
      return;
    }

    let startTime = performance.now();
    const duration = 3000; // 3 seconds per full rotation
    
    const hslToRgb = (h, s, l) => {
      s /= 100; l /= 100;
      const k = n => (n + h / 30) % 12;
      const a = s * Math.min(l, 1 - l);
      const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
      return { r: Math.round(255 * f(0)), g: Math.round(255 * f(8)), b: Math.round(255 * f(4)) };
    };

    const tick = (now) => {
      if (!isRainbowActive.current) return;
      
      const elapsed = now - startTime;
      // Spin hue from 0 to 360 endlessly
      const currentHue = ((elapsed / duration) * 360) % 360;
      const c = hslToRgb(currentHue, 100, 50);
      
      const root = document.documentElement;
      root.style.setProperty('--ambient-r', c.r);
      root.style.setProperty('--ambient-g', c.g);
      root.style.setProperty('--ambient-b', c.b);
      root.style.setProperty('--ambient-h', currentHue);
      root.style.setProperty('--ambient-s', '100%');
      root.style.setProperty('--ambient-l', '50%');
      
      transitionRef.current = requestAnimationFrame(tick);
    };
    transitionRef.current = requestAnimationFrame(tick);
  }, [setAmbientColor]);

  useEffect(() => () => {
    if (transitionRef.current) cancelAnimationFrame(transitionRef.current);
    if (videoSamplerRef.current) cancelAnimationFrame(videoSamplerRef.current);
  }, []);

  return {
    activeColor, colorCache,
    setAmbientColor, extractColor, resetColor,
    startLiveFrameSampling, stopLiveFrameSampling, triggerRainbow
  };
}
