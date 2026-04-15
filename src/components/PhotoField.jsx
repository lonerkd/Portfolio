import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

/* ══════════════════════════════════════
   PhotoField — fixed full-page parallax photo background
   Spans the entire site, grid-distributed so photos
   don't cluster. Reacts to mouse position.
   ══════════════════════════════════════ */

const IMG = (id, w = 400) => `https://lh3.googleusercontent.com/d/${id}=w${w}`;

// Shuffled for variety — no similar photos adjacent
const PHOTOS = [
  '1E_vf5yeYCtRaB8CMGIrkJu5zBNT-MRLO',
  '1d73j2enoH-IkFGAXRG6JsX1lK2N_tWP4',
  '1wcmVwR9mWMHv9WP9nWHBX9RpI5rPjXge',
  '1QAY4u44Ltse_FSbtj2lvSnxXon0yg0Wj',
  '1s8gA48BIhJddg-Mk2Ns_bfjb0rP5l6v5',
  '124P4ZdzSU_ow_CeafQjuCuLXU5kZ_sZx',
  '1owmYc9lTuoas80z6uX68Zh5gjWc_HFzm',
  '1ILTYjQTcZrHA5jXsWOcLcUVvHRUxf5_G',
  '1KwIxNlnl2vUuH6Wo57LToYa2b9Sj7Bhm',
  '1gHeCdlcsgxFsJY4WwgU8Br-SZl_tz1IP',
  '1VRjE0VIvLoDaOdGfPAvx8Z_5NRlzxutw',
  '1s_Jvg7pOvxdgNnBXY1wVVHv7XzV5XYp9',
  '1tfFCE5ORbHwHb_HFIS3SeYGoXcQRpdfS',
  '1XldskBnYHylvXLu1Bgeaj7zsgKl7AAaQ',
  '1Quwts5Lrg1rHZn-whJLkm2T_MoWTPBDB',
  '1CfevkaSmrmpUEaetdGnM8quZAQBV6fLB',
  '1GuvBsMJ80PCEgGlhFwHerkgxJPHXgmIT',
  '1fKjkXrPXUlgGUTREDiSG7Z43kjjxVdV2',
];

function sR(s) { return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }

function PhotoItem({ photo, mouseX, mouseY }) {
  const x = useTransform(mouseX, [-1, 1], [-photo.px * 30, photo.px * 30]);
  const y = useTransform(mouseY, [-1, 1], [-photo.py * 20, photo.py * 20]);

  return (
    <motion.div style={{
      position: 'absolute',
      left: `${photo.left}%`, top: `${photo.top}px`,
      width: photo.w, height: photo.w * 0.65,
      zIndex: photo.z, x, y, rotate: photo.rot,
    }}>
      <div style={{
        width: '100%', height: '100%', borderRadius: 6,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
      }}>
        <img src={IMG(photo.id)} alt="" loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(0.4) contrast(1.1)' }}
          onError={e => { e.target.style.display = 'none'; }}
        />
      </div>
    </motion.div>
  );
}

export default function PhotoField() {
  const [pageHeight, setPageHeight] = useState(5000);
  const rng = sR(42);

  useEffect(() => {
    const update = () => setPageHeight(document.body.scrollHeight);
    update();
    const obs = new ResizeObserver(update);
    obs.observe(document.body);
    return () => obs.disconnect();
  }, []);

  // Grid-based distribution: divide page into rows, place 2-3 photos per row
  // This ensures even spread from top to bottom with no clustering
  const rowCount = Math.max(8, Math.floor(pageHeight / 600));
  const rowHeight = pageHeight / rowCount;

  const photos = PHOTOS.map((id, i) => {
    const row = i % rowCount;
    const colSide = i % 2 === 0; // alternate left/right sides
    return {
      id,
      left: colSide ? (rng() * 30 + 2) : (rng() * 30 + 62), // left or right side
      top: row * rowHeight + rng() * rowHeight * 0.6, // within row, some jitter
      rot: (rng() - 0.5) * 18,
      w: 70 + rng() * 90,
      z: Math.floor(rng() * 5),
      px: rng() * 0.6 + 0.2,
      py: rng() * 0.6 + 0.2,
    };
  });

  const mouseX = useSpring(0, { stiffness: 40, damping: 25 });
  const mouseY = useSpring(0, { stiffness: 40, damping: 25 });

  useEffect(() => {
    const handleMove = (e) => {
      mouseX.set((e.clientX / window.innerWidth) * 2 - 1);
      mouseY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, [mouseX, mouseY]);

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: pageHeight,
      pointerEvents: 'none', zIndex: 0, overflow: 'hidden',
      opacity: 0.1,
    }}>
      {photos.map((p, i) => (
        <PhotoItem key={i} photo={p} mouseX={mouseX} mouseY={mouseY} />
      ))}
    </div>
  );
}
