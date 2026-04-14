import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, FileText, ArrowDown, ExternalLink, ChevronRight, X, Film, Pen, Eye, ArrowLeft, ZoomIn } from 'lucide-react';

/* ═══════════════════════════════════════
   IMAGE HELPERS
   ═══════════════════════════════════════ */
const IMG = (id, w = 800) => `https://lh3.googleusercontent.com/d/${id}=w${w}`;
const IMG_FB = (id, w = 800) => `https://drive.google.com/thumbnail?id=${id}&sz=w${w}`;

function Img({ id, alt = '', style = {}, className = '' }) {
  return (
    <img src={IMG(id, 800)} alt={alt} className={className} loading="lazy"
      style={{ objectFit: 'cover', display: 'block', ...style }}
      onError={e => {
        if (!e.target.dataset.fb) { e.target.dataset.fb = '1'; e.target.src = IMG_FB(id, 800); }
        else e.target.style.opacity = '0';
      }}
    />
  );
}

/* ═══════════════════════════════════════
   DATA
   ═══════════════════════════════════════ */

/* 
 * THUMBNAIL CUSTOMIZATION:
 * Each video has a `thumb` field — set it to any Google Drive image file ID
 * to use a custom still/frame as the thumbnail. If left null, it uses the
 * video's own Drive ID (which may or may not generate a preview).
 * 
 * To change a thumbnail: replace the thumb value with a photo ID from your Drive.
 * Example: thumb: '1E_vf5yeYCtRaB8CMGIrkJu5zBNT-MRLO'
 */
const VIDEOS = [
  {
    id: '10m', title: '10 Million', cat: 'Music Video',
    role: 'Director of Photography / Editor', year: '2026',
    desc: 'High-energy visual rhythm. Every cut lands on the beat, every frame tells a story of ambition.',
    did: '10A2uzDxrEEgx-6tiS3M_qbhAq72dglZt',
    thumb: null, // ← SET YOUR CUSTOM THUMBNAIL DRIVE ID HERE
    stills: [], // ← ADD DRIVE IDS OF BEST STILLS: ['id1', 'id2', ...]
    feat: true,
  },
  {
    id: 'brief', title: 'The Briefcase', cat: 'Short Film',
    role: 'Writer / Cinematographer', year: '2024',
    desc: 'A crime thriller about two couriers, a mysterious briefcase, and a deal that has to go right.',
    did: '1EM1AVe-50e6IMKL2m8teeakg6aSL3ctr',
    thumb: null,
    stills: [],
    feat: true,
  },
  {
    id: 'audio', title: 'The Audio Blueprint', cat: 'Documentary Teaser',
    role: 'Director / Writer / Editor', year: '2025',
    desc: 'The invisible art of sound design in film — why audio is the secret weapon behind iconic movie moments.',
    did: '1hpS5fIfDRthOgzCD0jda5IcuHiverR8n',
    thumb: null, stills: [],
  },
  {
    id: 'psa', title: 'The Grand PSA', cat: 'Commercial / PSA',
    role: 'Writer / Director / DP / Editor', year: '2025',
    desc: 'A love letter to The Grand Theatre. Wrote the script, directed the shoot, graded the final cut.',
    did: '1Mmk_nM_WXCskja0NEIa6PlM51cul-z00',
    thumb: null, stills: [],
  },
  {
    id: 'altitude', title: 'The Pursuit of Altitude', cat: 'Documentary',
    role: 'Cinematographer / Editor', year: '2024',
    desc: 'Chasing elevation, both literal and metaphorical. Visual storytelling through landscape and movement.',
    did: '1-bPAYnQROhT9awRMEBWuDCGSw04CtBgE',
    thumb: null, stills: [],
  },
  {
    id: 'cook', title: 'Live Cooking Demo', cat: 'Live Multi-Cam',
    role: 'Camera Operator / Switcher', year: '2025',
    desc: 'Live multi-camera production. Real-time switching, no second takes, all precision.',
    did: '13fmSRFNiGZl2b57-cd0qVnjcPx9IDUUZ',
    thumb: null, stills: [],
  },
  {
    id: 'intv', title: 'Live Interview Show', cat: 'Live Multi-Cam',
    role: 'Camera Operator / Director', year: '2025',
    desc: 'Sit-down interview format. Directing multiple camera operators in real time.',
    did: '1A7dgksrR-9KJ6TyxfO6Ch3TOc2bqbL0t',
    thumb: null, stills: [],
  },
  {
    id: 'news', title: 'Banded Peak News Pack', cat: 'Broadcast',
    role: 'Camera Operator / Editor', year: '2024',
    desc: 'Professional broadcast news package. Technical precision under deadline pressure.',
    did: '1iw925ZsP2evEINyDqP6iesQYellQ4Z9u',
    thumb: null, stills: [],
  },
  {
    id: 'tiktok', title: 'TikTok Addiction', cat: 'Documentary Teaser',
    role: 'Director / Editor', year: '2024',
    desc: 'A short-form documentary teaser examining our relationship with infinite scroll.',
    did: '1o61DVHh8QhTYWKSOQOvs9P4kEoZQqygI',
    thumb: null, stills: [],
  },
  {
    id: 'fraud', title: 'Fraud', cat: 'Documentary Teaser',
    role: 'Director / Editor', year: '2024',
    desc: 'Deception as a system. A teaser exploring how fraud operates in plain sight.',
    did: '10AfFlmGp1qbqI_9BKSQnYfyTi7o_SFbp',
    thumb: null, stills: [],
  },
];

const PHOTOS = [
  '1E_vf5yeYCtRaB8CMGIrkJu5zBNT-MRLO', '1owmYc9lTuoas80z6uX68Zh5gjWc_HFzm',
  '1tfFCE5ORbHwHb_HFIS3SeYGoXcQRpdfS', '1KwIxNlnl2vUuH6Wo57LToYa2b9Sj7Bhm',
  '1wcmVwR9mWMHv9WP9nWHBX9RpI5rPjXge', '1VRjE0VIvLoDaOdGfPAvx8Z_5NRlzxutw',
  '1s8gA48BIhJddg-Mk2Ns_bfjb0rP5l6v5', '1CfevkaSmrmpUEaetdGnM8quZAQBV6fLB',
  '1d73j2enoH-IkFGAXRG6JsX1lK2N_tWP4', '1GuvBsMJ80PCEgGlhFwHerkgxJPHXgmIT',
  '1QAY4u44Ltse_FSbtj2lvSnxXon0yg0Wj', '1Quwts5Lrg1rHZn-whJLkm2T_MoWTPBDB',
  '1ILTYjQTcZrHA5jXsWOcLcUVvHRUxf5_G', '124P4ZdzSU_ow_CeafQjuCuLXU5kZ_sZx',
  '1s_Jvg7pOvxdgNnBXY1wVVHv7XzV5XYp9', '1XldskBnYHylvXLu1Bgeaj7zsgKl7AAaQ',
  '1gHeCdlcsgxFsJY4WwgU8Br-SZl_tz1IP', '1fKjkXrPXUlgGUTREDiSG7Z43kjjxVdV2',
  '1pkLE02GQm3bS0gCffbHAjQXMy6TosKAK', '1LIqrIaOJwVwtViTN5a3D8Pk5b8Dm8Izo',
  '1thwuXrp_qcITKOlB6V0F5AtSnPatEBzw', '1rfOxvN9ma3_U3Z8D3aQAbnQcJyJR09Mk',
  '1hMl7N5jMfEQs_tS-8kD3Zxj35NN0bYcH', '1aWk5pEw7VbEblKh9McE7lpUq7KZy6Lem',
  '1hRxTsmDVsYWZANPvs6MPIq1pAX0I1zAR', '1_P7XRpC8By7sNrxkmL76otVB4yypAdei',
  '1U1RwG9UiAZvYoUlHSMluCHrjFrJ4_I02',
];

const WRITING_EXCERPTS = {
  femme: {
    title: 'Femme Fatale',
    type: 'Screenplay · Draft 9 · 133 Pages',
    target: 'For A24 / Proximity Media',
    driveId: '1cIynCQgJtWfLRpb5xZzgQw0rHMKauSO9',
    excerpts: [
      { label: 'Opening', text: 'A MAKEUP ARTIST works on IRIS BEAUMONT\'s face. Iris sits still in the chair. Her eyes open. Fixed on the mirror. She watches her reflection as she\'s being dolled. On the monitor above: a live signal. Then a close-up of her own face from a press shoot. She watches herself watching herself.' },
      { label: 'The Market', text: 'Two MEN come through. Civilian clothes. Dark glasses. Machetes at their belts. The man with the mangoes turns. He looks at Iris. "Too pretty for this market, little bird." Iris meets his gaze. She doesn\'t give him anything.' },
      { label: 'The Invitation', text: 'A POSTER on the wall. A Black woman in white feathers caught mid-arc — arms wide, face up. Stage light behind her. LES ÉTOILES DE PARIS. A touring troupe. "Auditions tonight. Eight o\'clock. We leave for Paris in two weeks."' },
    ],
    logline: 'A deconstruction of narrative control and the fabrication of reality. Set between Port-au-Prince in 1957 and a Parisian television studio, Femme Fatale follows Iris Beaumont — a woman who learns to survive not with weapons, but with the stories she chooses to tell.',
  },
  briefcase: {
    title: 'The Briefcase',
    type: 'Short Film Screenplay',
    driveId: '1ht--f7NM3X5LVPyaoA0uxoTlnAlZTMHJ',
    excerpt: '"Stop stressing man. We ain\'t gonna mess up." — "No. Cuz you said that last time, and last time it was a shit show. People died." — A confident chuckle. "Heh, ya they did."',
  },
  audioBP: {
    title: 'The Audio Blueprint',
    type: 'Documentary One Sheet',
    driveId: '1UvAxDRvO_6MvAAlUEFzVVTkou1ZNoxY-',
    excerpt: 'A witty 5-minute documentary that dives into the unseen magic of sound design in film, mixing eye-catching visuals, a playful sound experiment with real expert insights to show why audio is the secret sauce behind some of the most influential movie moments.',
  },
  psa: {
    title: 'A Stage for Every Story',
    type: 'PSA Script · The Grand Theatre',
    driveId: '1JQpQAEyNJmQlRnt2FVXDvjIZRaN_hNWf',
    excerpt: 'For over a century, The Grand Theatre has been more than just a stage… it\'s been the heartbeat of art and creativity in Calgary. The Grand isn\'t just a theatre, it\'s a living archive of creativity, built on generations of talent.',
  },
  prodBook: {
    title: 'Studio Music Video',
    type: 'Production Book · Chanel by Lamek Arefaine',
    driveId: '174wk77-9dBwOoJlMvROLpIsnf-kByrC6',
    excerpt: 'This music video is targeted at Frank Ocean fans and R&B music listeners. The objective is to create a visually and emotionally striking performance of Chanel — using close-ups, moody lighting, and dynamic movement to add to the song\'s emotional depth.',
  },
};

/* ═══════════════════════════════════════
   SEEDED RNG
   ═══════════════════════════════════════ */
function sRng(seed) { let s = seed; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }

/* ═══════════════════════════════════════
   PARALLAX PHOTO WALL — moves with scroll, hoverable
   ═══════════════════════════════════════ */
function ParallaxPhotoWall({ scrollY = 0, opacity = 0.15, count = 24 }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const rng = sRng(777);
  const items = PHOTOS.slice(0, count).map((id, i) => {
    const speed = 0.02 + rng() * 0.06; // parallax speed
    const x = rng() * 84 + 4;
    const y = rng() * 180 + 5; // spread across more vertical space
    const rot = (rng() - 0.5) * 26;
    const w = 100 + rng() * 130;
    const z = Math.floor(rng() * 15);
    const layer = rng() > 0.5 ? 'front' : 'back';
    return { id, x, y, rot, w, z, speed, layer, i };
  });

  return (
    <>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', opacity, zIndex: 1 }}>
        {items.map((p) => {
          const isHov = hoveredIdx === p.i;
          const yOff = scrollY * p.speed * (p.layer === 'front' ? 1 : 0.5);
          return (
            <div
              key={p.i}
              style={{
                position: 'absolute',
                left: `${p.x}%`,
                top: `calc(${p.y}% - ${yOff}px)`,
                width: p.w, height: p.w * 0.7,
                transform: `rotate(${p.rot}deg) scale(${isHov ? 1.15 : 1})`,
                zIndex: isHov ? 50 : p.z,
                transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1), z-index 0s',
                cursor: 'pointer',
                pointerEvents: 'auto',
                filter: isHov ? 'brightness(1.4)' : 'none',
              }}
              onMouseEnter={() => setHoveredIdx(p.i)}
              onMouseLeave={() => setHoveredIdx(null)}
              onClick={() => setLightbox(p.id)}
            >
              <div style={{
                width: '100%', height: '100%', background: '#111',
                border: `3px solid ${isHov ? 'rgba(255,60,0,0.6)' : 'rgba(240,236,228,0.2)'}`,
                boxShadow: isHov ? '0 8px 32px rgba(255,60,0,0.2)' : '3px 5px 16px rgba(0,0,0,0.8)',
                padding: 3, overflow: 'hidden', transition: 'border-color 0.3s, box-shadow 0.3s',
              }}>
                <Img id={p.id} style={{ width: '100%', height: '100%' }} />
              </div>
              {isHov && (
                <div style={{
                  position: 'absolute', bottom: -24, left: '50%', transform: 'translateX(-50%)',
                  display: 'flex', alignItems: 'center', gap: 4,
                  fontSize: 8, letterSpacing: 2, color: 'rgba(255,60,0,0.8)',
                  textTransform: 'uppercase', whiteSpace: 'nowrap',
                }}>
                  <ZoomIn size={10} /> View
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Photo Lightbox */}
      {lightbox && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 10000,
            background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(24px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
          onClick={() => setLightbox(null)}
        >
          <button onClick={() => setLightbox(null)} style={{
            position: 'absolute', top: 24, right: 24, background: 'none',
            border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
          }}><X size={28} /></button>
          <img
            src={IMG(lightbox, 1600)}
            alt=""
            style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', border: '2px solid rgba(255,255,255,0.08)' }}
            onError={e => { if (!e.target.dataset.fb) { e.target.dataset.fb = '1'; e.target.src = IMG_FB(lightbox, 1600); } }}
          />
        </div>
      )}
    </>
  );
}

/* ═══════════════════════════════════════
   VIDEO CARD
   ═══════════════════════════════════════ */
function VCard({ v, onClick, large }) {
  const [h, setH] = useState(false);
  const thumbId = v.thumb || v.did;

  return (
    <div style={{
      position: 'relative', overflow: 'hidden', cursor: 'pointer',
      aspectRatio: large ? '21/9' : '16/9', background: '#0e0e0e',
      border: '1px solid rgba(255,255,255,0.04)',
      transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)',
      transform: h ? 'scale(1.006)' : 'scale(1)',
      gridColumn: large ? '1/-1' : undefined,
    }}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      onClick={() => onClick(v)}
    >
      <Img id={thumbId} alt={v.title} style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        transition: 'transform 0.8s cubic-bezier(0.16,1,0.3,1), opacity 0.5s',
        transform: h ? 'scale(1.05)' : 'scale(1)', opacity: h ? 0.55 : 0.4,
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: h ? 'linear-gradient(transparent 20%,rgba(0,0,0,0.88) 100%)' : 'linear-gradient(transparent 30%,rgba(0,0,0,0.92) 100%)',
        transition: 'all 0.5s',
      }} />
      <div style={{ position: 'absolute', top: 14, right: 14, zIndex: 10, fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--accent)', fontFamily: 'var(--mono)' }}>{v.cat}</div>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
        <div style={{
          width: large ? 64 : 44, height: large ? 64 : 44, borderRadius: '50%',
          border: `2px solid ${h ? 'var(--accent)' : 'rgba(255,255,255,0.3)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.4s', transform: h ? 'scale(1.1)' : 'scale(1)',
          background: h ? 'rgba(255,60,0,0.1)' : 'transparent',
        }}>
          <Play size={large ? 22 : 15} fill={h ? '#ff3c00' : '#fff'} color={h ? '#ff3c00' : '#fff'} style={{ marginLeft: 3 }} />
        </div>
      </div>
      <div style={{
        position: 'absolute', bottom: 0, left: 0, padding: large ? 24 : 16, zIndex: 10, width: '100%',
        transform: h ? 'translateY(0)' : 'translateY(3px)', transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)',
      }}>
        <h3 style={{ fontFamily: 'var(--display)', fontSize: large ? 'clamp(1.8rem,3.5vw,2.8rem)' : 'clamp(1rem,1.8vw,1.4rem)', letterSpacing: 2, lineHeight: 1, color: 'var(--fg)' }}>{v.title}</h3>
        <p style={{ fontSize: 9, fontFamily: 'var(--mono)', letterSpacing: 2, color: 'rgba(255,255,255,0.3)', marginTop: 3, textTransform: 'uppercase' }}>{v.role} · {v.year}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   VIDEO DETAIL VIEW (replaces simple modal)
   ═══════════════════════════════════════ */
function VideoDetail({ v, onClose }) {
  if (!v) return null;

  useEffect(() => {
    const fn = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', fn); document.body.style.overflow = ''; };
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9000,
      background: 'var(--bg)', overflowY: 'auto',
    }}>
      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10, padding: '16px 32px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'rgba(8,8,8,0.9)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}>
        <button onClick={onClose} style={{
          background: 'none', border: 'none', color: 'var(--fg)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 8,
          fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase',
        }}>
          <ArrowLeft size={16} /> Back to Portfolio
        </button>
        <a href={`https://drive.google.com/file/d/${v.did}/view`} target="_blank" rel="noopener noreferrer" className="link-btn">
          <ExternalLink size={11} /> Full Quality
        </a>
      </div>

      {/* Video Player */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ aspectRatio: '16/9', background: '#000', border: '1px solid rgba(255,255,255,0.06)' }}>
          <iframe
            src={`https://drive.google.com/file/d/${v.did}/preview`}
            width="100%" height="100%"
            allow="autoplay; encrypted-media" allowFullScreen
            title={v.title}
            style={{ border: 'none' }}
          />
        </div>

        {/* Info */}
        <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 40 }}>
          <div>
            <span style={{ fontSize: 9, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--accent)', fontFamily: 'var(--mono)' }}>{v.cat}</span>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(2rem,5vw,3.5rem)', letterSpacing: 2, marginTop: 6 }}>{v.title}</h2>
            <p style={{ fontFamily: 'var(--serif)', fontSize: 16, lineHeight: 1.8, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', marginTop: 12, maxWidth: 600 }}>
              {v.desc}
            </p>
          </div>
          <div style={{ borderLeft: '1px solid rgba(255,255,255,0.06)', paddingLeft: 28 }}>
            <div style={{ fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 8 }}>Credits</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, lineHeight: 2.2, color: 'rgba(255,255,255,0.5)' }}>
              <div><span style={{ color: 'rgba(255,255,255,0.25)' }}>Role:</span> {v.role}</div>
              <div><span style={{ color: 'rgba(255,255,255,0.25)' }}>Year:</span> {v.year}</div>
              <div><span style={{ color: 'rgba(255,255,255,0.25)' }}>By:</span> Peter Olowude</div>
            </div>
          </div>
        </div>

        {/* Best Stills Gallery */}
        {v.stills && v.stills.length > 0 && (
          <div style={{ marginTop: 56 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ width: 28, height: 1, background: 'var(--accent)' }} />
              <span style={{ fontSize: 9, letterSpacing: 5, textTransform: 'uppercase', color: 'var(--accent)' }}>Best Stills</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
              {v.stills.map((sid, i) => (
                <div key={i} style={{ aspectRatio: '16/9', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <Img id={sid} style={{ width: '100%', height: '100%', transition: 'transform 0.5s' }}
                    className="still-img" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Placeholder if no stills yet */}
        {(!v.stills || v.stills.length === 0) && (
          <div style={{
            marginTop: 56, padding: 40, border: '1px dashed rgba(255,255,255,0.08)',
            textAlign: 'center', color: 'rgba(255,255,255,0.15)',
            fontSize: 10, letterSpacing: 3, textTransform: 'uppercase',
          }}>
            Add best stills by putting Drive image IDs in the <code style={{ color: 'var(--accent)' }}>stills</code> array for this video
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════ */
export default function App() {
  const [activeVideo, setActiveVideo] = useState(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const s = document.createElement('style');
    s.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');
      :root{--display:'Bebas Neue',sans-serif;--mono:'DM Mono',monospace;--serif:'Cormorant Garamond',serif;--bg:#080808;--fg:#f0ece4;--accent:#ff3c00}
      *{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}body{overflow-x:hidden;background:var(--bg)}
      ::selection{background:rgba(255,60,0,0.4)}
      ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:var(--bg)}::-webkit-scrollbar-thumb{background:#1a1a1a;border-radius:3px}
      @keyframes slideUp{from{opacity:0;transform:translateY(36px)}to{opacity:1;transform:translateY(0)}}
      @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
      @keyframes grain{0%,100%{transform:translate(0,0)}10%{transform:translate(-5%,-10%)}30%{transform:translate(7%,-25%)}50%{transform:translate(-15%,10%)}70%{transform:translate(0%,15%)}90%{transform:translate(-10%,10%)}}
      .link-btn{font-size:9px;font-family:var(--mono);letter-spacing:3px;text-transform:uppercase;color:var(--fg);text-decoration:none;border:1px solid rgba(255,255,255,0.2);padding:10px 18px;display:inline-flex;align-items:center;gap:7px;transition:all 0.3s;flex-shrink:0;background:transparent;cursor:pointer}
      .link-btn:hover{border-color:var(--accent);color:var(--accent)}
      .cta-btn{font-size:10px;font-family:var(--mono);letter-spacing:4px;text-transform:uppercase;color:var(--fg);text-decoration:none;border:1px solid rgba(255,255,255,0.2);padding:14px 30px;transition:all 0.4s;display:inline-block}
      .cta-btn:hover{background:var(--accent);border-color:var(--accent);color:var(--bg)}
      .still-img:hover{transform:scale(1.05)}
    `;
    document.head.appendChild(s);
    return () => s.remove();
  }, []);

  const feat = VIDEOS.filter(v => v.feat);
  const rest = VIDEOS.filter(v => !v.feat);
  const W = WRITING_EXCERPTS;

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--fg)', fontFamily: 'var(--mono)', minHeight: '100vh' }}>
      {/* GRAIN */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 9998, pointerEvents: 'none', opacity: 0.025, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, animation: 'grain 0.5s steps(6) infinite' }} />

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, width: '100%', padding: '18px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100, mixBlendMode: 'difference' }}>
        <div style={{ fontFamily: 'var(--display)', fontSize: '1.15rem', letterSpacing: 6, color: 'var(--fg)' }}>PETER OLOWUDE</div>
        <div style={{ display: 'flex', gap: 22 }}>
          {['work', 'writing', 'story', 'contact'].map(s => (
            <a key={s} href={`#${s}`} style={{ color: 'var(--fg)', textDecoration: 'none', fontSize: 9, letterSpacing: 4, textTransform: 'uppercase' }}>{s}</a>
          ))}
        </div>
      </nav>

      {/* ═══ HERO with PARALLAX PHOTOS ═══ */}
      <section style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <ParallaxPhotoWall scrollY={scrollY} opacity={0.18} count={24} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 40% 55%,rgba(255,60,0,0.06) 0%,transparent 55%)', zIndex: 2, pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 3, textAlign: 'center', animation: 'slideUp 1s ease-out', pointerEvents: 'none' }}>
          <div style={{ fontFamily: 'var(--display)', fontSize: 'clamp(3.5rem,14vw,11rem)', lineHeight: 0.85, letterSpacing: -2 }}>
            <span style={{ WebkitTextStroke: '2px var(--fg)', color: 'transparent' }}>I DON'T</span><br />
            <span style={{ color: 'var(--accent)' }}>JUST FILM</span>
          </div>
          <p style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(1rem,2.4vw,1.5rem)', fontWeight: 300, fontStyle: 'italic', letterSpacing: 1, marginTop: 22, opacity: 0.5, animation: 'slideUp 1s ease-out 0.2s both' }}>
            I build worlds. I write stories. I hold the camera like it owes me something.
          </p>
          <div style={{ display: 'flex', gap: 18, justifyContent: 'center', marginTop: 32, animation: 'slideUp 1s ease-out 0.35s both' }}>
            {[{ i: <Film size={12} />, l: 'Cinematography' }, { i: <Pen size={12} />, l: 'Writing' }, { i: <Eye size={12} />, l: 'Creative Direction' }].map((t, i) => (
              <span key={i} style={{ fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(240,236,228,0.28)', display: 'flex', alignItems: 'center', gap: 5 }}>{t.i} {t.l}</span>
            ))}
          </div>
        </div>
        <a href="#work" style={{ position: 'absolute', bottom: 32, color: 'var(--fg)', opacity: 0.2, textDecoration: 'none', zIndex: 3 }}><ArrowDown size={18} /></a>
      </section>

      {/* ═══ WORK ═══ */}
      <section id="work" style={{ maxWidth: 1160, margin: '0 auto', padding: '90px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 36 }}>
          <div style={{ width: 32, height: 1, background: 'var(--accent)' }} />
          <span style={{ fontSize: 9, letterSpacing: 6, textTransform: 'uppercase', color: 'var(--accent)' }}>The Work — {VIDEOS.length} Projects</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
          {feat.map(v => <VCard key={v.id} v={v} onClick={setActiveVideo} large={false} />)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 3, marginTop: 3 }}>
          {rest.slice(0, 3).map(v => <VCard key={v.id} v={v} onClick={setActiveVideo} />)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, marginTop: 3 }}>
          {rest.slice(3, 5).map(v => <VCard key={v.id} v={v} onClick={setActiveVideo} />)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 3, marginTop: 3 }}>
          {rest.slice(5).map(v => <VCard key={v.id} v={v} onClick={setActiveVideo} />)}
        </div>
      </section>

      {/* MARQUEE */}
      <div style={{ padding: '32px 0', overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
        <div style={{ display: 'flex', gap: 44, animation: 'marquee 30s linear infinite', whiteSpace: 'nowrap' }}>
          {['CINEMATOGRAPHY', 'DIRECTING', 'MUSIC VIDEOS', 'COLOR GRADING', 'CREATIVE DIRECTION', 'EDITING', 'STORYTELLING', 'LIGHTING', 'WRITING', 'SOUND DESIGN', 'LIVE MULTI-CAM', 'CINEMATOGRAPHY', 'DIRECTING', 'MUSIC VIDEOS', 'COLOR GRADING', 'CREATIVE DIRECTION', 'EDITING', 'STORYTELLING', 'LIGHTING', 'WRITING', 'SOUND DESIGN', 'LIVE MULTI-CAM'].map((s, i) => (
            <span key={i} style={{ fontFamily: 'var(--display)', fontSize: '1.1rem', letterSpacing: 6, flexShrink: 0, opacity: i % 2 === 0 ? 1 : 0.12, color: i % 2 === 0 ? 'var(--accent)' : 'var(--fg)' }}>{s}</span>
          ))}
        </div>
      </div>

      {/* ═══ WRITING — with excerpts ═══ */}
      <section id="writing" style={{ maxWidth: 1000, margin: '0 auto', padding: '90px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 36 }}>
          <div style={{ width: 32, height: 1, background: 'var(--accent)' }} />
          <span style={{ fontSize: 9, letterSpacing: 6, textTransform: 'uppercase', color: 'var(--accent)' }}>The Writing</span>
        </div>

        {/* FEMME FATALE — with scene excerpts */}
        <div style={{ border: '1px solid rgba(255,255,255,0.05)', padding: '40px 44px', marginBottom: 3, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: 280, height: 280, background: 'radial-gradient(circle,rgba(255,60,0,0.05) 0%,transparent 70%)' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 36, position: 'relative', zIndex: 1 }}>
            <div>
              <span style={{ fontSize: 8, letterSpacing: 5, textTransform: 'uppercase', color: 'var(--accent)' }}>{W.femme.type}</span>
              <h3 style={{ fontFamily: 'var(--display)', fontSize: '2.6rem', letterSpacing: 2, marginTop: 5, fontStyle: 'italic' }}>{W.femme.title}</h3>
              <p style={{ fontSize: 9, letterSpacing: 2, color: 'rgba(255,255,255,0.22)', marginTop: 5, textTransform: 'uppercase' }}>{W.femme.target}</p>
              <a href={`https://drive.google.com/file/d/${W.femme.driveId}/view`} target="_blank" rel="noopener noreferrer" className="link-btn" style={{ marginTop: 18 }}>
                <FileText size={11} /> Read Full Script
              </a>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '1.05rem', lineHeight: 1.8, fontStyle: 'italic', color: 'rgba(255,255,255,0.45)', borderLeft: '2px solid var(--accent)', paddingLeft: 20, marginBottom: 24 }}>
                {W.femme.logline}
              </div>
            </div>
          </div>

          {/* Scene Excerpts */}
          <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3 }}>
            {W.femme.excerpts.map((ex, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.02)', padding: 20, borderLeft: '2px solid rgba(255,60,0,0.2)' }}>
                <span style={{ fontSize: 8, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--accent)', display: 'block', marginBottom: 8 }}>{ex.label}</span>
                <p style={{ fontFamily: 'var(--serif)', fontSize: 13, lineHeight: 1.7, color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>
                  {`"${ex.text}"`}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Other Writing — with excerpts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
          {[W.prodBook, W.audioBP, W.psa, W.briefcase].map((w, i) => (
            <a key={i} href={`https://drive.google.com/file/d/${w.driveId}/view`} target="_blank" rel="noopener noreferrer"
              style={{ textDecoration: 'none', color: 'inherit', display: 'block', border: '1px solid rgba(255,255,255,0.03)', padding: 24, transition: 'border-color 0.4s', background: '#0c0c0c' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,60,0,0.3)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.03)'}
            >
              <span style={{ fontSize: 8, letterSpacing: 5, textTransform: 'uppercase', color: 'var(--accent)' }}>{w.type}</span>
              <h4 style={{ fontFamily: 'var(--display)', fontSize: '1.15rem', letterSpacing: 2, marginTop: 5 }}>{w.title}</h4>
              <p style={{ fontFamily: 'var(--serif)', fontSize: 12, lineHeight: 1.6, color: 'rgba(255,255,255,0.35)', fontStyle: 'italic', marginTop: 8, minHeight: 60 }}>
                {`"${w.excerpt}"`}
              </p>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 12, fontSize: 8, letterSpacing: 3, color: 'rgba(255,255,255,0.2)' }}>READ <ChevronRight size={9} /></span>
            </a>
          ))}
        </div>
      </section>

      {/* ═══ STORY ═══ */}
      <section id="story" style={{ maxWidth: 700, margin: '0 auto', padding: '90px 18px', position: 'relative' }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 36 }}>
            <div style={{ width: 32, height: 1, background: 'var(--accent)' }} />
            <span style={{ fontSize: 9, letterSpacing: 6, textTransform: 'uppercase', color: 'var(--accent)' }}>The Narrative</span>
          </div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: '1.12rem', lineHeight: 2, color: 'rgba(255,255,255,0.5)' }}>
            <p style={{ marginBottom: 20 }}>It began a couple months before I dropped out of film school.</p>
            <p style={{ marginBottom: 20 }}>At 19, I was overwhelmed and realizing that the institution was a structure I no longer needed to validate my vision. I didn't drop out because it was too hard — I dropped out to prove this wasn't just a degree for me. <span style={{ color: 'var(--fg)', fontWeight: 600 }}>It was my vocation.</span></p>
            <p style={{ marginBottom: 20 }}>From a family of Yale and Columbia grads, multinational business owners — my path was set. Business, law, or medicine. When I chose to chase a camera instead of a courtroom, the disappointment was palpable. But I embraced it.</p>
            <p style={{ marginBottom: 20 }}>I've spent years in the dark writing scripts like <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>Femme Fatale</span> — a 133-page screenplay submitted to A24 and Proximity Media. I've shot music videos, directed live multi-cam shows, built news packages, created documentaries. I've done every job on set because I wanted to understand the whole machine, not just one gear.</p>
            <p style={{ color: 'var(--fg)', fontWeight: 400 }}>I believe in the vision being built here. I have the work to show I can do it, and the dedication to ensure it's done right.</p>
          </div>
        </div>
      </section>

      {/* ═══ CONTACT ═══ */}
      <section id="contact" style={{ padding: '130px 18px', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%,rgba(255,60,0,0.04) 0%,transparent 55%)' }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ fontFamily: 'var(--display)', fontSize: 'clamp(3rem,10vw,7rem)', lineHeight: 0.9, letterSpacing: -2 }}>
            LET'S<br /><span style={{ color: 'var(--accent)' }}>BUILD</span><br />SOMETHING
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 40, flexWrap: 'wrap' }}>
            {[{ l: 'Email', h: 'mailto:peterolowude@gmail.com' }, { l: 'X / Twitter', h: 'https://twitter.com/5stariah' }, { l: 'Full Drive', h: 'https://drive.google.com/drive/folders/10kpdBuTKIWpCrARqTNSCW3OtyWzQnAg0' }].map((l, i) => (
              <a key={i} href={l.h} target="_blank" rel="noopener noreferrer" className="cta-btn">{l.l}</a>
            ))}
          </div>
          <p style={{ marginTop: 32, fontFamily: 'var(--serif)', fontSize: '1rem', fontStyle: 'italic', opacity: 0.3 }}>
            Available immediately · Calgary, AB · Ready to relocate · Full time
          </p>
        </div>
      </section>

      <footer style={{ textAlign: 'center', padding: 20, fontSize: 8, letterSpacing: 4, textTransform: 'uppercase', opacity: 0.1 }}>
        © 2026 Peter Olowude · Misfits Cavern Productions
      </footer>

      {/* Video Detail Overlay */}
      <VideoDetail v={activeVideo} onClose={() => setActiveVideo(null)} />
    </div>
  );
}
