import React, { useState, useEffect, useRef } from 'react';
import { Play, FileText, ArrowDown, ExternalLink, ChevronRight, X, Film, Pen, Eye, ArrowLeft, Instagram, Mail, Twitter } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView } from 'framer-motion';

/* ═══ IMAGE HELPERS ═══ */
const IMG = (id, w = 600) => `https://lh3.googleusercontent.com/d/${id}=w${w}`;
const IMG_FB = (id, w = 600) => `https://drive.google.com/thumbnail?id=${id}&sz=w${w}`;

function Img({ id, alt = '', style = {} }) {
  return (
    <img src={IMG(id, 800)} alt={alt} loading="lazy"
      style={{ objectFit: 'cover', display: 'block', ...style }}
      onError={e => {
        if (!e.target.dataset.fb) { e.target.dataset.fb = '1'; e.target.src = IMG_FB(id, 800); }
        else e.target.style.opacity = '0';
      }}
    />
  );
}

/* ═══ DATA ═══ */
const VIDEOS = [
  { id: '10m', title: '10 Million', cat: 'Music Video', role: 'DP / Editor', year: '2026', desc: 'High-energy visual rhythm. Every cut lands on the beat, every frame tells a story of ambition.', did: '10A2uzDxrEEgx-6tiS3M_qbhAq72dglZt', thumb: null, feat: true },
  { id: 'brief', title: 'The Briefcase', cat: 'Short Film', role: 'Writer / DP', year: '2024', desc: 'A crime thriller about two couriers, a mysterious briefcase, and a deal that has to go right.', did: '1EM1AVe-50e6IMKL2m8teeakg6aSL3ctr', thumb: null, feat: true },
  { id: 'audio', title: 'The Audio Blueprint', cat: 'Doc Teaser', role: 'Director / Writer / Editor', year: '2025', desc: 'The invisible art of sound design — why audio is the secret weapon behind iconic movie moments.', did: '1hpS5fIfDRthOgzCD0jda5IcuHiverR8n', thumb: null },
  { id: 'psa', title: 'The Grand PSA', cat: 'Commercial', role: 'Writer / Director / DP / Editor', year: '2025', desc: 'A love letter to The Grand Theatre. Wrote, directed, shot, and graded the final cut.', did: '1Mmk_nM_WXCskja0NEIa6PlM51cul-z00', thumb: null },
  { id: 'altitude', title: 'The Pursuit of Altitude', cat: 'Documentary', role: 'DP / Editor', year: '2024', desc: 'Chasing elevation, literal and metaphorical. Visual storytelling through landscape and movement.', did: '1-bPAYnQROhT9awRMEBWuDCGSw04CtBgE', thumb: null },
  { id: 'cook', title: 'Live Cooking Demo', cat: 'Live Multi-Cam', role: 'Camera Op / Switcher', year: '2025', desc: 'Live multi-camera production. Real-time switching, no second takes.', did: '13fmSRFNiGZl2b57-cd0qVnjcPx9IDUUZ', thumb: null },
  { id: 'intv', title: 'Live Interview Show', cat: 'Live Multi-Cam', role: 'Camera Op / Director', year: '2025', desc: 'Sit-down interview. Directing multiple camera operators in real time.', did: '1A7dgksrR-9KJ6TyxfO6Ch3TOc2bqbL0t', thumb: null },
  { id: 'news', title: 'Banded Peak News Pack', cat: 'Broadcast', role: 'Camera Op / Editor', year: '2024', desc: 'Professional broadcast news package under deadline pressure.', did: '1iw925ZsP2evEINyDqP6iesQYellQ4Z9u', thumb: null },
  { id: 'tiktok', title: 'TikTok Addiction', cat: 'Doc Teaser', role: 'Director / Editor', year: '2024', desc: 'Examining our relationship with infinite scroll.', did: '1o61DVHh8QhTYWKSOQOvs9P4kEoZQqygI', thumb: null },
  { id: 'fraud', title: 'Fraud', cat: 'Doc Teaser', role: 'Director / Editor', year: '2024', desc: 'Deception as a system. How fraud operates in plain sight.', did: '10AfFlmGp1qbqI_9BKSQnYfyTi7o_SFbp', thumb: null },
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
];

/* ═══ SEEDED RNG ═══ */
function sR(seed) { let s = seed; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }

/* ═══ PARALLAX PHOTO ATMOSPHERE ═══ */
function PhotoAtmosphere({ scrollY }) {
  const rng = sR(777);
  const items = PHOTOS.map((id, i) => ({
    id, x: rng() * 82 + 5, y: rng() * 160 + 10,
    rot: (rng() - 0.5) * 28, w: 80 + rng() * 100,
    z: Math.floor(rng() * 10), speed: 0.05 + rng() * 0.1,
  }));

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', opacity: 0.18 }}>
      {items.map((p, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
            width: p.w, height: p.w * 0.68, zIndex: p.z,
            y: useTransform(scrollY, [0, 5000], [0, -5000 * p.speed]),
            rotate: p.rot,
          }}
        >
          <div style={{
            width: '100%', height: '100%', background: '#111',
            border: '1px solid rgba(240,236,228,0.1)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            padding: 1, overflow: 'hidden',
          }}>
            <img src={IMG(p.id, 300)} alt="" loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'grayscale(0.5) contrast(1.1)' }}
              onError={e => { e.target.style.display = 'none'; }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ═══ VIDEO CARD ═══ */
function VCard({ v, onClick }) {
  const thumbId = v.thumb || v.did;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative', overflow: 'hidden',
        aspectRatio: '16/9', background: '#0e0e0e',
        border: '1px solid rgba(255,255,255,0.03)',
        cursor: 'pointer',
      }}
      onClick={() => onClick(v)}
    >
      <motion.div
        animate={{ scale: isHovered ? 1.05 : 1, opacity: isHovered ? 0.6 : 0.45 }}
        transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <Img id={thumbId} alt={v.title} style={{ width: '100%', height: '100%' }} />
      </motion.div>

      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(transparent 40%, rgba(0,0,0,0.95) 100%)',
      }} />

      <div style={{
        position: 'absolute', top: 20, right: 20, zIndex: 5,
        fontSize: 8, letterSpacing: 4, textTransform: 'uppercase',
        color: 'var(--accent)', fontFamily: 'var(--mono)',
      }}>{v.cat}</div>

      <div style={{
        position: 'absolute', inset: 0, display: 'flex',
        alignItems: 'center', justifyContent: 'center', zIndex: 5,
      }}>
        <motion.div
          animate={{
            scale: isHovered ? 1.1 : 1,
            backgroundColor: isHovered ? 'rgba(255,60,0,0.2)' : 'rgba(255,60,0,0)',
            borderColor: isHovered ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)',
          }}
          style={{
            width: 64, height: 64, borderRadius: '50%',
            border: '1px solid',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Play size={24} fill="#fff" color="#fff" style={{ marginLeft: 4 }} />
        </motion.div>
      </div>

      <div style={{
        position: 'absolute', bottom: 0, left: 0, padding: 24, zIndex: 5, width: '100%',
      }}>
        <motion.h3
          animate={{ x: isHovered ? 10 : 0 }}
          style={{
            fontFamily: 'var(--display)', fontSize: '2rem',
            letterSpacing: 2, lineHeight: 1, color: 'var(--fg)',
          }}
        >{v.title}</motion.h3>
        <motion.p
          animate={{ x: isHovered ? 10 : 0 }}
          style={{
            fontSize: 9, fontFamily: 'var(--mono)', letterSpacing: 3,
            color: 'rgba(255,255,255,0.4)', marginTop: 8, textTransform: 'uppercase',
          }}
        >{v.role} · {v.year}</motion.p>
      </div>
    </motion.div>
  );
}

/* ═══ VIDEO DETAIL — full-screen overlay, mobile-optimized ═══ */
function VideoDetail({ v, onClose }) {
  // FIXED: useEffect must be called before any early return
  useEffect(() => {
    if (!v) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [v]);

  if (!v) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9000,
      background: 'var(--bg)', overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
    }}>
      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10, padding: '14px 16px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'rgba(8,8,8,0.92)', backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}>
        <button onClick={onClose} style={{
          background: 'none', border: 'none', color: 'var(--fg)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6, padding: '8px 0',
          fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
        }}>
          <ArrowLeft size={18} /> Back
        </button>
      </div>

      <div style={{ padding: '0 16px 60px' }}>
        {/* Player */}
        <div style={{
          aspectRatio: '16/9', background: '#000', marginTop: 12,
          border: '1px solid rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden',
        }}>
          <iframe
            src={`https://drive.google.com/file/d/${v.did}/preview`}
            width="100%" height="100%"
            allow="autoplay; encrypted-media" allowFullScreen
            style={{ border: 'none' }}
            title={v.title}
          />
        </div>

        {/* Info */}
        <div style={{ marginTop: 20 }}>
          <span style={{
            fontSize: 9, letterSpacing: 4, textTransform: 'uppercase',
            color: 'var(--accent)', fontFamily: 'var(--mono)',
          }}>{v.cat}</span>
          <h2 style={{
            fontFamily: 'var(--display)', fontSize: '2.2rem',
            letterSpacing: 2, marginTop: 4, lineHeight: 1,
          }}>{v.title}</h2>
          <p style={{
            fontFamily: 'var(--serif)', fontSize: 15, lineHeight: 1.7,
            color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', marginTop: 10,
          }}>{v.desc}</p>

          <div style={{
            marginTop: 16, paddingTop: 14,
            borderTop: '1px solid rgba(255,255,255,0.06)',
            fontFamily: 'var(--mono)', fontSize: 10, lineHeight: 2.4,
            color: 'rgba(255,255,255,0.4)',
          }}>
            <div><span style={{ color: 'rgba(255,255,255,0.2)', marginRight: 8 }}>ROLE</span> {v.role}</div>
            <div><span style={{ color: 'rgba(255,255,255,0.2)', marginRight: 8 }}>YEAR</span> {v.year}</div>
            <div><span style={{ color: 'rgba(255,255,255,0.2)', marginRight: 8 }}>BY</span> Peter Olowude</div>
          </div>

          <a href={`https://drive.google.com/file/d/${v.did}/view`}
            target="_blank" rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              marginTop: 20, padding: '14px 24px',
              fontSize: 10, fontFamily: 'var(--mono)', letterSpacing: 3,
              textTransform: 'uppercase', color: 'var(--fg)',
              border: '1px solid rgba(255,255,255,0.2)',
              textDecoration: 'none',
            }}
          >
            <ExternalLink size={13} /> Watch Full Quality
          </a>
        </div>
      </div>
    </div>
  );
}

/* ═══ SECTION LABEL ═══ */
function SectionLabel({ text }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32, padding: '0 16px' }}>
      <motion.div
        initial={{ width: 0 }}
        animate={isInView ? { width: 40 } : {}}
        transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
        style={{ height: 1, background: 'var(--accent)' }}
      />
      <motion.span
        initial={{ opacity: 0, x: -10 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{ fontSize: 9, letterSpacing: 6, textTransform: 'uppercase', color: 'var(--accent)', fontFamily: 'var(--mono)' }}
      >{text}</motion.span>
    </div>
  );
}

/* ═══ APP ═══ */
export default function App() {
  const [activeVideo, setActiveVideo] = useState(null);
  const { scrollYProgress } = useScroll();
  const scrollY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const s = document.createElement('style');
    s.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');

      :root {
        --display: 'Bebas Neue', sans-serif;
        --mono: 'DM Mono', monospace;
        --serif: 'Cormorant Garamond', serif;
        --bg: #080808;
        --fg: #f0ece4;
        --accent: #ff3c00;
      }

      * { margin: 0; padding: 0; box-sizing: border-box; }
      html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
      body { overflow-x: hidden; background: var(--bg); }
      ::selection { background: rgba(255,60,0,0.4); }

      @keyframes slideUp {
        from { opacity: 0; transform: translateY(28px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes marquee {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
      }
      @keyframes grain {
        0%,100%{transform:translate(0,0)}
        10%{transform:translate(-5%,-10%)}
        30%{transform:translate(7%,-25%)}
        50%{transform:translate(-15%,10%)}
        70%{transform:translate(0%,15%)}
        90%{transform:translate(-10%,10%)}
      }
    `;
    document.head.appendChild(s);

    // Viewport meta for mobile
    let meta = document.querySelector('meta[name="viewport"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
      document.head.appendChild(meta);
    }

    return () => s.remove();
  }, []);

  return (
    <div style={{
      background: 'var(--bg)', color: 'var(--fg)',
      fontFamily: 'var(--mono)', minHeight: '100vh',
      overflowX: 'hidden',
    }}>

      {/* GRAIN */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9998, pointerEvents: 'none', opacity: 0.02,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        animation: 'grain 0.5s steps(6) infinite',
      }} />

      {/* ═══════════════════════════════════
          HERO — full viewport, photos behind
         ═══════════════════════════════════ */}
      <section style={{
        minHeight: '100svh', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        position: 'relative', overflow: 'hidden', padding: '0 20px',
      }}>
        <PhotoAtmosphere scrollY={scrollY} />

        {/* Radial glow */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 50% 50%, rgba(255,60,0,0.07) 0%, transparent 60%)',
        }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 3, textAlign: 'center', width: '100%', animation: 'slideUp 0.8s ease-out' }}>
          {/* Name */}
          <p style={{
            fontSize: 10, letterSpacing: 6, textTransform: 'uppercase',
            color: 'rgba(240,236,228,0.4)', marginBottom: 20,
            fontFamily: 'var(--mono)',
          }}>Peter Olowude</p>

          <div style={{
            fontFamily: 'var(--display)',
            fontSize: 'clamp(3rem, 16vw, 10rem)',
            lineHeight: 0.88, letterSpacing: -1,
          }}>
            <motion.span
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ WebkitTextStroke: '1.5px var(--fg)', color: 'transparent', display: 'inline-block' }}
            >I DON'T</motion.span>
            <br />
            <motion.span
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              style={{ color: 'var(--accent)', display: 'inline-block' }}
            >JUST FILM</motion.span>
          </div>

          <p style={{
            fontFamily: 'var(--serif)',
            fontSize: 'clamp(0.95rem, 3.5vw, 1.4rem)',
            fontWeight: 300, fontStyle: 'italic',
            letterSpacing: 0.5, marginTop: 18, opacity: 0.5,
            animation: 'slideUp 0.8s ease-out 0.15s both',
            padding: '0 10px',
          }}>
            I build worlds. I write stories.<br />
            I hold the camera like it owes me something.
          </p>

          <div style={{
            display: 'flex', gap: 14, justifyContent: 'center', marginTop: 28,
            animation: 'slideUp 0.8s ease-out 0.3s both', flexWrap: 'wrap',
          }}>
            {[
              { i: <Film size={11} />, l: 'Cinematography' },
              { i: <Pen size={11} />, l: 'Writing' },
              { i: <Eye size={11} />, l: 'Creative Direction' },
            ].map((t, i) => (
              <span key={i} style={{
                fontSize: 8, letterSpacing: 3, textTransform: 'uppercase',
                color: 'rgba(240,236,228,0.25)', display: 'flex', alignItems: 'center', gap: 4,
              }}>{t.i} {t.l}</span>
            ))}
          </div>
        </div>

        <a href="#work" style={{
          position: 'absolute', bottom: 28, color: 'var(--fg)', opacity: 0.18,
          textDecoration: 'none', zIndex: 3,
        }}><ArrowDown size={16} /></a>
      </section>

      {/* ═══════════════════════════════════
          WORK — stacked cards, single column on mobile
         ═══════════════════════════════════ */}
      <section id="work" style={{ padding: '64px 0 48px' }}>
        <SectionLabel text={`The Work — ${VIDEOS.length} Projects`} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '0 16px' }}>
          {VIDEOS.map(v => (
            <VCard key={v.id} v={v} onClick={setActiveVideo} />
          ))}
        </div>
      </section>

      {/* ═══ MARQUEE ═══ */}
      <div style={{
        padding: '32px 0', overflow: 'hidden',
        borderTop: '1px solid rgba(255,255,255,0.03)',
        borderBottom: '1px solid rgba(255,255,255,0.03)',
        background: 'rgba(255,60,0,0.02)',
      }}>
        <motion.div
          animate={{ x: [0, -2000] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          style={{ display: 'flex', gap: 60, whiteSpace: 'nowrap' }}
        >
          {[...Array(6)].map((_, idx) => (
            <React.Fragment key={idx}>
              {['CINEMATOGRAPHY', 'DIRECTING', 'MUSIC VIDEOS', 'CREATIVE DIRECTION',
                'EDITING', 'STORYTELLING', 'WRITING', 'LIVE MULTI-CAM',
              ].map((s, i) => (
                <span key={i} style={{
                  fontFamily: 'var(--display)', fontSize: '1.2rem', letterSpacing: 8, flexShrink: 0,
                  color: i % 2 === 0 ? 'var(--accent)' : 'var(--fg)',
                  opacity: i % 2 === 0 ? 1 : 0.1,
                }}>{s}</span>
              ))}
            </React.Fragment>
          ))}
        </motion.div>
      </div>

      {/* ═══════════════════════════════════
          WRITING — with excerpts, mobile stacked
         ═══════════════════════════════════ */}
      <section id="writing" style={{ padding: '64px 16px 48px' }}>
        <SectionLabel text="The Writing" />

        {/* FEMME FATALE — featured */}
        <div style={{
          border: '1px solid rgba(255,255,255,0.05)', padding: '28px 20px',
          marginBottom: 2, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, right: 0, width: 200, height: 200,
            background: 'radial-gradient(circle, rgba(255,60,0,0.06) 0%, transparent 70%)',
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <span style={{ fontSize: 8, letterSpacing: 5, textTransform: 'uppercase', color: 'var(--accent)' }}>
              Screenplay · Draft 9 · 133 Pages
            </span>
            <h3 style={{
              fontFamily: 'var(--display)', fontSize: '2.4rem',
              letterSpacing: 2, marginTop: 4, fontStyle: 'italic',
            }}>Femme Fatale</h3>
            <p style={{
              fontSize: 9, letterSpacing: 2, color: 'rgba(255,255,255,0.2)',
              marginTop: 3, textTransform: 'uppercase',
            }}>Political Noir · Limited Series · For A24 / Proximity Media</p>

            {/* Logline */}
            <div style={{
              fontFamily: 'var(--serif)', fontSize: '0.95rem', lineHeight: 1.75,
              fontStyle: 'italic', color: 'rgba(255,255,255,0.45)',
              borderLeft: '2px solid var(--accent)', paddingLeft: 16,
              marginTop: 20,
            }}>
              A deconstruction of narrative control and the fabrication of reality. Set between Port-au-Prince in 1957 and a Parisian television studio, <span style={{ color: 'var(--fg)' }}>Femme Fatale</span> follows Iris Beaumont — a woman who survives not with weapons, but with the stories she chooses to tell.
            </div>

            {/* Scene Excerpts */}
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                { label: 'Opening', text: 'A MAKEUP ARTIST works on IRIS BEAUMONT\'s face. Her eyes open. Fixed on the mirror. On the monitor above: a close-up of her own face from a press shoot. She watches herself watching herself.' },
                { label: 'The Market', text: 'Two MEN come through. Civilian clothes. Dark glasses. Machetes at their belts. "Too pretty for this market, little bird." Iris meets his gaze. She doesn\'t give him anything.' },
                { label: 'The Invitation', text: 'A POSTER on the wall. A Black woman in white feathers caught mid-arc — arms wide, face up. LES ÉTOILES DE PARIS. "Auditions tonight. Eight o\'clock. We leave for Paris in two weeks."' },
              ].map((ex, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.02)', padding: '16px 14px',
                  borderLeft: '2px solid rgba(255,60,0,0.15)',
                }}>
                  <span style={{
                    fontSize: 7, letterSpacing: 4, textTransform: 'uppercase',
                    color: 'var(--accent)', display: 'block', marginBottom: 6,
                  }}>{ex.label}</span>
                  <p style={{
                    fontFamily: 'var(--serif)', fontSize: 13, lineHeight: 1.65,
                    color: 'rgba(255,255,255,0.38)', fontStyle: 'italic',
                  }}>&quot;{ex.text}&quot;</p>
                </div>
              ))}
            </div>

            <a href="https://drive.google.com/file/d/1cIynCQgJtWfLRpb5xZzgQw0rHMKauSO9/view"
              target="_blank" rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                marginTop: 20, padding: '14px 20px',
                fontSize: 9, fontFamily: 'var(--mono)', letterSpacing: 3,
                textTransform: 'uppercase', color: 'var(--fg)',
                border: '1px solid rgba(255,255,255,0.2)',
                textDecoration: 'none',
              }}
            >
              <FileText size={12} /> Read Full Script
            </a>
          </div>
        </div>

        {/* Other Writing */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[
            { type: 'Production Book', title: 'Studio Music Video', excerpt: 'Full production book for a Frank Ocean "Chanel" music video. Shot lists, cam plans, choreography — targeted at the introspective aesthetic Frank Ocean\'s music portrays.', did: '174wk77-9dBwOoJlMvROLpIsnf-kByrC6' },
            { type: 'Documentary One Sheet', title: 'The Audio Blueprint', excerpt: 'A witty 5-minute documentary that dives into the unseen magic of sound design in film, mixing eye-catching visuals with real expert insights to show why audio is the secret sauce behind the most influential movie moments.', did: '1UvAxDRvO_6MvAAlUEFzVVTkou1ZNoxY-' },
            { type: 'PSA Script', title: 'A Stage for Every Story', excerpt: 'For over a century, The Grand Theatre has been more than just a stage… it\'s been the heartbeat of art and creativity in Calgary. A living archive of creativity, built on generations of talent.', did: '1JQpQAEyNJmQlRnt2FVXDvjIZRaN_hNWf' },
            { type: 'Short Film Screenplay', title: 'The Briefcase', excerpt: '"Stop stressing man. We ain\'t gonna mess up." — "No. Cuz you said that last time, and last time it was a shit show. People died." — A confident chuckle. "Heh, ya they did."', did: '1ht--f7NM3X5LVPyaoA0uxoTlnAlZTMHJ' },
          ].map((w, i) => (
            <a key={i} href={`https://drive.google.com/file/d/${w.did}/view`}
              target="_blank" rel="noopener noreferrer"
              style={{
                textDecoration: 'none', color: 'inherit', display: 'block',
                border: '1px solid rgba(255,255,255,0.04)', padding: '20px 18px',
                background: '#0c0c0c',
              }}
            >
              <span style={{ fontSize: 8, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--accent)' }}>{w.type}</span>
              <h4 style={{ fontFamily: 'var(--display)', fontSize: '1.15rem', letterSpacing: 2, marginTop: 4 }}>{w.title}</h4>
              <p style={{
                fontFamily: 'var(--serif)', fontSize: 13, lineHeight: 1.6,
                color: 'rgba(255,255,255,0.33)', fontStyle: 'italic', marginTop: 8,
              }}>&quot;{w.excerpt}&quot;</p>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                marginTop: 10, fontSize: 8, letterSpacing: 3, color: 'rgba(255,255,255,0.2)',
              }}>READ <ChevronRight size={9} /></span>
            </a>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════
          STORY
         ═══════════════════════════════════ */}
      <section id="story" style={{ padding: '80px 16px', maxWidth: 800, margin: '0 auto' }}>
        <SectionLabel text="The Narrative" />

        <div style={{
          fontFamily: 'var(--serif)', fontSize: 'clamp(1.1rem, 3vw, 1.25rem)', lineHeight: 1.8,
          color: 'rgba(255,255,255,0.45)', padding: '0 4px',
        }}>
          {[
            "It began a couple months before I dropped out of film school.",
            "At 19, I was overwhelmed and realizing that the institution was a structure I no longer needed to validate my vision. I didn't drop out because it was too hard — I dropped out to prove this wasn't just a degree for me. <span style='color: var(--fg); font-weight: 600;'>It was my vocation.</span>",
            "From a family of Yale and Columbia grads, multinational business owners — my path was set. Business, law, or medicine. When I chose to chase a camera instead of a courtroom, the disappointment was palpable. But I embraced it.",
            "I've spent years in the dark writing scripts like <span style='color: var(--accent); font-style: italic;'>Femme Fatale</span> — a 133-page screenplay submitted to A24 and Proximity Media. I've shot music videos, directed live multi-cam shows, built news packages, created documentaries. I've done every job on set because I wanted to understand the whole machine, not just one gear.",
            "<span style='color: var(--fg); font-weight: 400;'>I believe in the vision being built here. I have the work to show I can do it, and the dedication to ensure it's done right.</span>"
          ].map((p, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              style={{ marginBottom: 32 }}
              dangerouslySetInnerHTML={{ __html: p }}
            />
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════
          CONTACT
         ═══════════════════════════════════ */}
      <section id="contact" style={{
        padding: '100px 16px 120px', textAlign: 'center', position: 'relative',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 50% 50%, rgba(255,60,0,0.06) 0%, transparent 65%)',
        }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
            style={{
              fontFamily: 'var(--display)',
              fontSize: 'clamp(3.5rem, 16vw, 9rem)',
              lineHeight: 0.85, letterSpacing: -2,
            }}
          >
            LET'S<br /><span style={{ color: 'var(--accent)' }}>BUILD</span><br />SOMETHING
          </motion.div>

          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 12, marginTop: 48,
          }}>
            {[
              { l: 'Email', h: 'mailto:peterolowude@gmail.com', i: <Mail size={14} /> },
              { l: 'X / Twitter', h: 'https://twitter.com/5stariah', i: <Twitter size={14} /> },
              { l: 'View Everything', h: 'https://drive.google.com/drive/folders/10kpdBuTKIWpCrARqTNSCW3OtyWzQnAg0', i: <ExternalLink size={14} /> },
            ].map((link, i) => (
              <motion.a
                key={i}
                href={link.h}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,60,0,0.05)', borderColor: 'var(--accent)' }}
                whileTap={{ scale: 0.98 }}
                style={{
                  fontSize: 10, fontFamily: 'var(--mono)', letterSpacing: 4,
                  textTransform: 'uppercase', color: 'var(--fg)',
                  textDecoration: 'none', border: '1px solid rgba(255,255,255,0.15)',
                  padding: '16px 32px', width: '100%', maxWidth: 320,
                  textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  transition: 'border-color 0.3s ease',
                }}
              >
                {link.i} {link.l}
              </motion.a>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.4 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            style={{
              marginTop: 40, fontFamily: 'var(--serif)',
              fontSize: '0.95rem', fontStyle: 'italic',
            }}
          >
            Available immediately · Calgary, AB<br />Ready to relocate · Full time
          </motion.p>
        </div>
      </section>

      <footer style={{
        textAlign: 'center', padding: '16px 16px 32px',
        fontSize: 7, letterSpacing: 4, textTransform: 'uppercase', opacity: 0.08,
      }}>
        © 2026 Peter Olowude · Misfits Cavern Productions
      </footer>

      {/* Video Detail Overlay */}
      <VideoDetail v={activeVideo} onClose={() => setActiveVideo(null)} />
    </div>
  );
}
