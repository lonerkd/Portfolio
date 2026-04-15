import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, FileText, ArrowDown, ExternalLink, ChevronRight, X, Film, Pen, Eye, ArrowLeft } from 'lucide-react';

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
  { id: '10m', title: '10 Million', cat: 'Music Video', role: 'DP / Editor', year: '2026', desc: 'High-energy visual rhythm. Every cut lands on the beat, every frame tells a story of ambition. Shot, lit, and edited solo — built to stand alongside any major release.', did: '10A2uzDxrEEgx-6tiS3M_qbhAq72dglZt', thumb: null, feat: true },
  { id: 'blackstuff', title: 'Black Stuff', cat: 'Music Video', role: 'DP / Editor', year: '2025', desc: 'Raw, intentional, and cinematic. A music video that proves dark aesthetics can carry deep narrative weight.', did: '1KHdETMZDHqrRzkL7Ook-61KHxFwcGnKB', thumb: null, feat: true },
  { id: 'intv', title: 'Live Interview Show', cat: 'Live Multi-Cam', role: 'Camera Op / Director', year: '2025', desc: 'Sit-down interview series. Real-time direction across multiple operators — the same instincts needed behind the stream camera.', did: '1A7dgksrR-9KJ6TyxfO6Ch3TOc2bqbL0t', thumb: null },
  { id: 'cook', title: 'Live Cooking Demo', cat: 'Live Multi-Cam', role: 'Camera Op / Switcher', year: '2025', desc: 'Live multi-camera production. Real-time switching, no second takes. Every moment captured clean.', did: '13fmSRFNiGZl2b57-cd0qVnjcPx9IDUUZ', thumb: null },
  { id: 'brief', title: 'The Briefcase', cat: 'Short Film', role: 'Writer / DP', year: '2024', desc: 'A crime thriller about two couriers, a mysterious briefcase, and a deal that has to go right. Proof that cinematic vision doesn\'t need a big budget.', did: '1EM1AVe-50e6IMKL2m8teeakg6aSL3ctr', thumb: null, feat: true },
  { id: 'psa', title: 'The Grand PSA', cat: 'Commercial', role: 'Writer / Director / DP / Editor', year: '2025', desc: 'A love letter to The Grand Theatre. Wrote, directed, shot, and graded the final cut.', did: '1Mmk_nM_WXCskja0NEIa6PlM51cul-z00', thumb: null },
  { id: 'audio', title: 'The Audio Blueprint', cat: 'Doc Teaser', role: 'Director / Writer / Editor', year: '2025', desc: 'The invisible art of sound design — why audio is the secret weapon behind iconic movie moments.', did: '1hpS5fIfDRthOgzCD0jda5IcuHiverR8n', thumb: null },
  { id: 'altitude', title: 'The Pursuit of Altitude', cat: 'Documentary', role: 'DP / Editor', year: '2024', desc: 'Chasing elevation, literal and metaphorical. Visual storytelling through landscape and movement.', did: '1-bPAYnQROhT9awRMEBWuDCGSw04CtBgE', thumb: null },
  { id: 'news', title: 'Banded Peak News Pack', cat: 'Broadcast', role: 'Camera Op / Editor', year: '2024', desc: 'Professional broadcast news package under deadline pressure. Broadcast-grade work, delivered clean.', did: '1iw925ZsP2evEINyDqP6iesQYellQ4Z9u', thumb: null },
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
  const items = PHOTOS.map((id) => ({
    id, x: rng() * 82 + 5, y: rng() * 160 + 10,
    rot: (rng() - 0.5) * 28, w: 80 + rng() * 100,
    z: Math.floor(rng() * 10), speed: 0.015 + rng() * 0.045,
  }));

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', opacity: 0.14 }}>
      {items.map((p, i) => (
        <div key={i} style={{
          position: 'absolute', left: `${p.x}%`, top: `calc(${p.y}% - ${scrollY * p.speed}px)`,
          width: p.w, height: p.w * 0.68, transform: `rotate(${p.rot}deg)`, zIndex: p.z,
          willChange: 'transform',
        }}>
          <div style={{
            width: '100%', height: '100%', background: '#111',
            border: '3px solid rgba(240,236,228,0.18)',
            boxShadow: '2px 4px 14px rgba(0,0,0,0.7)',
            padding: 2, overflow: 'hidden',
          }}>
            <img src={IMG(p.id, 200)} alt="" loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={e => { e.target.style.display = 'none'; }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══ SECTION REVEAL HOOK ═══ */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.dataset.visible = '1'; obs.unobserve(el); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ═══ VIDEO CARD ═══ */
function VCard({ v, onClick, large = false }) {
  const [hovered, setHovered] = useState(false);
  const thumbId = v.thumb || v.did;
  return (
    <div
      style={{
        position: 'relative', overflow: 'hidden',
        aspectRatio: large ? '16/9' : '16/9',
        background: '#0e0e0e',
        border: '1px solid rgba(255,255,255,0.05)',
        cursor: 'pointer',
        transform: hovered ? 'scale(1.02)' : 'scale(1)',
        transition: 'transform 0.3s ease',
      }}
      onClick={() => onClick(v)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Img id={thumbId} alt={v.title} style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        opacity: hovered ? 0.65 : 0.45,
        transition: 'opacity 0.3s ease',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(transparent 25%, rgba(0,0,0,0.9) 100%)',
      }} />

      <div style={{
        position: 'absolute', top: 12, right: 12, zIndex: 5,
        fontSize: 8, letterSpacing: 3, textTransform: 'uppercase',
        color: 'var(--accent)', fontFamily: 'var(--mono)',
      }}>{v.cat}</div>

      <div style={{
        position: 'absolute', inset: 0, display: 'flex',
        alignItems: 'center', justifyContent: 'center', zIndex: 5,
      }}>
        <div style={{
          width: large ? 64 : 52, height: large ? 64 : 52, borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: hovered ? 'rgba(255,60,0,0.25)' : 'rgba(255,60,0,0.08)',
          transition: 'background 0.3s ease',
        }}>
          <Play size={large ? 24 : 20} fill="#fff" color="#fff" style={{ marginLeft: 3 }} />
        </div>
      </div>

      <div style={{
        position: 'absolute', bottom: 0, left: 0, padding: large ? 20 : 16, zIndex: 5, width: '100%',
      }}>
        <h3 style={{
          fontFamily: 'var(--display)', fontSize: large ? '2rem' : '1.5rem',
          letterSpacing: 2, lineHeight: 1, color: 'var(--fg)',
        }}>{v.title}</h3>
        <p style={{
          fontSize: 9, fontFamily: 'var(--mono)', letterSpacing: 2,
          color: 'rgba(255,255,255,0.35)', marginTop: 4, textTransform: 'uppercase',
        }}>{v.role} · {v.year}</p>
        {hovered && (
          <p style={{
            fontFamily: 'var(--serif)', fontSize: 12, lineHeight: 1.55,
            color: 'rgba(255,255,255,0.55)', fontStyle: 'italic', marginTop: 8,
            animation: 'fadeIn 0.2s ease-out',
          }}>{v.desc}</p>
        )}
      </div>
    </div>
  );
}

/* ═══ VIDEO DETAIL — full-screen overlay ═══ */
function VideoDetail({ v, onClose }) {
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
      animation: 'slideInBottom 0.35s cubic-bezier(0.16,1,0.3,1)',
    }}>
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

      <div style={{ padding: '0 16px 100px' }}>
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
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28, padding: '0 16px' }}>
      <div style={{ width: 28, height: 1, background: 'var(--accent)' }} />
      <span style={{ fontSize: 9, letterSpacing: 5, textTransform: 'uppercase', color: 'var(--accent)', fontFamily: 'var(--mono)' }}>{text}</span>
    </div>
  );
}

/* ═══ REVEAL WRAPPER ═══ */
function Reveal({ children, delay = 0, style = {} }) {
  const ref = useReveal();
  return (
    <div ref={ref} style={{
      opacity: 0, transform: 'translateY(28px)',
      transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
      ...style,
    }}
    data-reveal
    >
      {children}
    </div>
  );
}

/* ═══ FLOATING BOTTOM NAV ═══ */
function BottomNav({ activeSection }) {
  const navItems = [
    { id: 'work', label: 'WORK' },
    { id: 'writing', label: 'WRITING' },
    { id: 'story', label: 'STORY' },
    { id: 'contact', label: 'CONTACT' },
  ];

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{
      position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
      zIndex: 8000,
      background: 'rgba(8,8,8,0.75)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 100,
      padding: '10px 16px',
      display: 'flex', gap: 4,
      boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
    }}>
      {navItems.map(item => (
        <button
          key={item.id}
          onClick={() => scrollTo(item.id)}
          style={{
            background: activeSection === item.id ? 'var(--accent)' : 'transparent',
            border: 'none',
            borderRadius: 100,
            padding: '8px 16px',
            cursor: 'pointer',
            fontFamily: 'var(--mono)',
            fontSize: 9,
            letterSpacing: 3,
            color: activeSection === item.id ? '#080808' : 'rgba(240,236,228,0.4)',
            transition: 'all 0.25s ease',
            whiteSpace: 'nowrap',
            fontWeight: activeSection === item.id ? 500 : 400,
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

/* ═══ STATS BAR ═══ */
function StatsBar() {
  const ref = useReveal();
  const stats = [
    { n: '11', label: 'Projects' },
    { n: '4+', label: 'Years' },
    { n: '5', label: 'Disciplines' },
    { n: '0', label: 'Days Until Available' },
  ];
  return (
    <div ref={ref} data-reveal style={{
      opacity: 0, transform: 'translateY(28px)',
      transition: 'opacity 0.6s ease, transform 0.6s ease',
      borderTop: '1px solid rgba(255,255,255,0.04)',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
      padding: '32px 16px',
      display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 24,
    }}>
      {stats.map((s, i) => (
        <div key={i} style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: 'var(--display)',
            fontSize: 'clamp(2.4rem, 8vw, 4rem)',
            lineHeight: 1, color: 'var(--accent)',
            letterSpacing: -1,
          }}>{s.n}</div>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: 8,
            letterSpacing: 4, textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.25)', marginTop: 6,
          }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
}

/* ═══ CATEGORY FILTER PILLS ═══ */
const CATS = ['ALL', 'Music Video', 'Live Multi-Cam', 'Short Film', 'Commercial', 'Doc Teaser', 'Documentary', 'Broadcast'];

/* ═══ APP ═══ */
export default function App() {
  const [activeVideo, setActiveVideo] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Section tracking for nav */
  useEffect(() => {
    const sections = ['work', 'writing', 'story', 'contact'];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.3 }
    );
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  /* Reveal observer */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.target.dataset.reveal !== undefined) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    const elements = document.querySelectorAll('[data-reveal]');
    elements.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  });

  /* Inject styles */
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
      @keyframes slideInBottom {
        from { opacity: 0; transform: translateY(60px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
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

      .writing-scroll::-webkit-scrollbar { height: 2px; }
      .writing-scroll::-webkit-scrollbar-track { background: transparent; }
      .writing-scroll::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 2px; }

      .filter-pill:hover { background: rgba(255,60,0,0.15) !important; color: var(--fg) !important; }
    `;
    document.head.appendChild(s);

    let meta = document.querySelector('meta[name="viewport"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
      document.head.appendChild(meta);
    }

    return () => s.remove();
  }, []);

  const featuredVideos = VIDEOS.filter(v => v.feat && v.cat === 'Music Video');
  const filteredVideos = activeFilter === 'ALL'
    ? VIDEOS
    : VIDEOS.filter(v => v.cat === activeFilter);
  const nonFeaturedFiltered = activeFilter === 'ALL'
    ? VIDEOS.filter(v => !v.feat)
    : filteredVideos.filter(v => !v.feat || v.cat !== 'Music Video');

  const writingItems = [
    { type: 'Show Bible', title: 'Misfits Cavern', excerpt: 'Full show bible for an original series. Character arcs, episode breakdowns, world-building, tone guides.', did: '1xx9bJWGSEekWqqVmpVS64k7KWo276lVZ' },
    { type: 'Production Book', title: 'Studio Music Video', excerpt: 'Full production book for a Frank Ocean "Chanel" music video. Shot lists, cam plans, choreography.', did: '174wk77-9dBwOoJlMvROLpIsnf-kByrC6' },
    { type: 'Documentary One Sheet', title: 'The Audio Blueprint', excerpt: 'A witty 5-minute documentary about the unseen magic of sound design in film.', did: '1UvAxDRvO_6MvAAlUEFzVVTkou1ZNoxY-' },
    { type: 'PSA Script', title: 'A Stage for Every Story', excerpt: 'For over a century, The Grand Theatre has been the heartbeat of art and creativity in Calgary.', did: '1JQpQAEyNJmQlRnt2FVXDvjIZRaN_hNWf' },
    { type: 'Short Film Script', title: 'The Briefcase', excerpt: '"Stop stressing man. We ain\'t gonna mess up." — "No. Cuz you said that last time, and last time it was a shit show."', did: '1ht--f7NM3X5LVPyaoA0uxoTlnAlZTMHJ' },
  ];

  const pitchItems = [
    { req: 'Creative Vision', proof: 'Every project started as a concept in my head. I bring the idea, the look, the execution.' },
    { req: 'Music Video Experience', proof: '10 Million and Black Stuff — shot, lit, edited solo. Study the frames.' },
    { req: 'Passionate About Camera', proof: 'I dropped out of film school to prove this isn\'t a degree. It\'s my vocation.' },
    { req: 'Full-Time Ready', proof: 'Available immediately. Ready to relocate. I go wherever the camera goes.' },
    { req: 'Stream & Daily Content', proof: 'Live multi-cam productions across cooking shows, interview series, sports. Real moments, no staging.' },
  ];

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

      {/* FLOATING BOTTOM NAV */}
      <BottomNav activeSection={activeSection} />

      {/* ═══ HERO ═══ */}
      <section style={{
        minHeight: '100svh', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        position: 'relative', overflow: 'hidden', padding: '0 20px',
      }}>
        <PhotoAtmosphere scrollY={scrollY} />

        <div style={{
          position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 50% 50%, rgba(255,60,0,0.07) 0%, transparent 60%)',
        }} />

        <div style={{ position: 'relative', zIndex: 3, textAlign: 'center', width: '100%', animation: 'slideUp 0.8s ease-out' }}>
          <p style={{
            fontSize: 9, letterSpacing: 5, textTransform: 'uppercase',
            color: 'var(--accent)', marginBottom: 12,
            fontFamily: 'var(--mono)', opacity: 0.7,
          }}>Built for @plaqueboymax</p>

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
            <span style={{ WebkitTextStroke: '1.5px var(--fg)', color: 'transparent' }}>I DON&apos;T</span>
            <br />
            <span style={{ color: 'var(--accent)' }}>JUST FILM</span>
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
              { i: <Film size={11} />, l: 'Music Videos' },
              { i: <Eye size={11} />, l: 'Stream / Vlog' },
              { i: <Pen size={11} />, l: 'Creative Direction' },
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

      {/* ═══ STATS BAR ═══ */}
      <StatsBar />

      {/* ═══ PITCH SECTION ═══ */}
      <section style={{ padding: '64px 16px 48px', maxWidth: 900, margin: '0 auto' }}>
        <Reveal>
          <SectionLabel text="Why I'm Your Cameraman" />
        </Reveal>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 2, marginBottom: 28,
        }}>
          {pitchItems.map((item, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <div style={{
                border: '1px solid rgba(255,255,255,0.04)',
                background: '#0a0a0a', padding: '24px 20px',
                position: 'relative', overflow: 'hidden',
                minHeight: 120,
              }}>
                {/* Ghost number */}
                <div style={{
                  position: 'absolute', top: -10, right: 12,
                  fontFamily: 'var(--display)',
                  fontSize: '5rem', lineHeight: 1,
                  color: 'rgba(255,255,255,0.03)',
                  userSelect: 'none', pointerEvents: 'none',
                }}>{String(i + 1).padStart(2, '0')}</div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                  <p style={{
                    fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: 3,
                    textTransform: 'uppercase', color: 'var(--fg)', marginBottom: 8,
                  }}>{item.req}</p>
                  <p style={{
                    fontFamily: 'var(--serif)', fontSize: 13, lineHeight: 1.65,
                    color: 'rgba(255,255,255,0.4)', fontStyle: 'italic',
                  }}>{item.proof}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3}>
          <div style={{
            borderLeft: '2px solid var(--accent)', paddingLeft: 20,
            fontFamily: 'var(--serif)', fontSize: '1rem', lineHeight: 1.85,
            color: 'rgba(255,255,255,0.45)', fontStyle: 'italic',
          }}>
            <p style={{ marginBottom: 14 }}>
              Max — I&apos;ve watched how you build. The way your content moves, the way it sits between raw and refined. You don&apos;t just need someone who can hold a camera. You need someone who can feel a room, anticipate a moment, and make sure it lives forever in the frame.
            </p>
            <p style={{ color: 'var(--fg)', fontStyle: 'normal', fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: 2 }}>
              That&apos;s what I do. Scroll down.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ═══ WORK SECTION ═══ */}
      <section id="work" style={{ padding: '64px 0 48px' }}>
        <Reveal style={{ padding: '0 16px' }}>
          <SectionLabel text={`The Work — ${VIDEOS.length} Projects`} />
        </Reveal>

        {/* Category filter pills */}
        <Reveal delay={0.1} style={{ padding: '0 16px', marginBottom: 24 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {CATS.map(cat => (
              <button
                key={cat}
                className="filter-pill"
                onClick={() => setActiveFilter(cat)}
                style={{
                  background: activeFilter === cat ? 'var(--accent)' : 'rgba(255,255,255,0.04)',
                  border: '1px solid',
                  borderColor: activeFilter === cat ? 'var(--accent)' : 'rgba(255,255,255,0.08)',
                  borderRadius: 100,
                  padding: '7px 14px',
                  cursor: 'pointer',
                  fontFamily: 'var(--mono)',
                  fontSize: 8, letterSpacing: 3,
                  textTransform: 'uppercase',
                  color: activeFilter === cat ? '#080808' : 'rgba(255,255,255,0.35)',
                  transition: 'all 0.2s ease',
                }}
              >{cat}</button>
            ))}
          </div>
        </Reveal>

        {/* Featured music videos — large 2-col */}
        {(activeFilter === 'ALL' || activeFilter === 'Music Video') && (
          <Reveal delay={0.15} style={{ padding: '0 16px', marginBottom: 2 }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 2, marginBottom: 2,
            }}>
              {featuredVideos.map(v => (
                <VCard key={v.id} v={v} onClick={setActiveVideo} large />
              ))}
            </div>
          </Reveal>
        )}

        {/* Remaining videos — tighter 2-col grid */}
        <Reveal delay={0.2} style={{ padding: '0 16px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 2,
          }}>
            {nonFeaturedFiltered.map(v => (
              <VCard key={v.id} v={v} onClick={setActiveVideo} />
            ))}
          </div>
          {filteredVideos.length === 0 && (
            <p style={{
              textAlign: 'center', padding: '40px 0',
              fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: 3,
              color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase',
            }}>No projects in this category yet</p>
          )}
        </Reveal>
      </section>

      {/* ═══ MARQUEE ═══ */}
      <div style={{
        padding: '24px 0', overflow: 'hidden',
        borderTop: '1px solid rgba(255,255,255,0.03)',
        borderBottom: '1px solid rgba(255,255,255,0.03)',
      }}>
        <div style={{
          display: 'flex', gap: 36,
          animation: 'marquee 25s linear infinite', whiteSpace: 'nowrap',
        }}>
          {['CINEMATOGRAPHY', 'MUSIC VIDEOS', 'STREAM CAMERA', 'CREATIVE DIRECTION',
            'EDITING', 'STORYTELLING', 'WRITING', 'LIVE MULTI-CAM', 'VLOG / DAILY CONTENT', 'DIRECTING',
            'CINEMATOGRAPHY', 'MUSIC VIDEOS', 'STREAM CAMERA', 'CREATIVE DIRECTION',
            'EDITING', 'STORYTELLING', 'WRITING', 'LIVE MULTI-CAM', 'VLOG / DAILY CONTENT', 'DIRECTING',
          ].map((s, i) => (
            <span key={i} style={{
              fontFamily: 'var(--display)', fontSize: '0.95rem', letterSpacing: 5, flexShrink: 0,
              opacity: i % 2 === 0 ? 1 : 0.12,
              color: i % 2 === 0 ? 'var(--accent)' : 'var(--fg)',
            }}>{s}</span>
          ))}
        </div>
      </div>

      {/* ═══ WRITING SECTION ═══ */}
      <section id="writing" style={{ padding: '64px 0 48px' }}>
        <Reveal style={{ padding: '0 16px' }}>
          <SectionLabel text="The Writing" />
        </Reveal>

        {/* FEMME FATALE — featured hero */}
        <Reveal delay={0.1} style={{ padding: '0 16px', marginBottom: 16 }}>
          <div style={{
            border: '1px solid rgba(255,255,255,0.05)', padding: '28px 20px',
            position: 'relative', overflow: 'hidden',
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

              <div style={{
                fontFamily: 'var(--serif)', fontSize: '0.95rem', lineHeight: 1.75,
                fontStyle: 'italic', color: 'rgba(255,255,255,0.45)',
                borderLeft: '2px solid var(--accent)', paddingLeft: 16,
                marginTop: 20,
              }}>
                A deconstruction of narrative control and the fabrication of reality. Set between Port-au-Prince in 1957 and a Parisian television studio, <span style={{ color: 'var(--fg)' }}>Femme Fatale</span> follows Iris Beaumont — a woman who survives not with weapons, but with the stories she chooses to tell.
              </div>

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

              <a href="https://drive.google.com/file/d/15UV22p-90rGDGfhROKqiIxELp87vCsik/view"
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
                <FileText size={12} /> Read Latest Draft
              </a>
            </div>
          </div>
        </Reveal>

        {/* Scroll indicator */}
        <Reveal delay={0.15} style={{ padding: '0 16px', marginBottom: 10 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            fontFamily: 'var(--mono)', fontSize: 8, letterSpacing: 4,
            color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase',
          }}>
            <span>← scroll →</span>
          </div>
        </Reveal>

        {/* Horizontal scroll row */}
        <div
          className="writing-scroll"
          style={{
            display: 'flex', gap: 2, overflowX: 'auto',
            padding: '0 16px 16px',
            scrollbarWidth: 'thin',
            cursor: 'grab',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {writingItems.map((w, i) => (
            <a key={i} href={`https://drive.google.com/file/d/${w.did}/view`}
              target="_blank" rel="noopener noreferrer"
              style={{
                textDecoration: 'none', color: 'inherit',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                minWidth: 280, height: 200,
                border: '1px solid rgba(255,255,255,0.04)',
                background: '#0c0c0c',
                padding: '20px 18px',
                flexShrink: 0,
                position: 'relative', overflow: 'hidden',
              }}
            >
              {/* Ghost number */}
              <div style={{
                position: 'absolute', bottom: -10, right: 8,
                fontFamily: 'var(--display)', fontSize: '4.5rem',
                color: 'rgba(255,255,255,0.03)', userSelect: 'none',
                lineHeight: 1,
              }}>{String(i + 1).padStart(2, '0')}</div>

              <div style={{ position: 'relative', zIndex: 1 }}>
                <span style={{ fontSize: 8, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--accent)', display: 'block', marginBottom: 6 }}>{w.type}</span>
                <h4 style={{ fontFamily: 'var(--display)', fontSize: '1.15rem', letterSpacing: 2 }}>{w.title}</h4>
                <p style={{
                  fontFamily: 'var(--serif)', fontSize: 12, lineHeight: 1.6,
                  color: 'rgba(255,255,255,0.33)', fontStyle: 'italic', marginTop: 8,
                }}>&quot;{w.excerpt}&quot;</p>
              </div>

              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                fontSize: 8, letterSpacing: 3, color: 'rgba(255,255,255,0.2)',
                position: 'relative', zIndex: 1,
              }}>READ <ChevronRight size={9} /></span>
            </a>
          ))}
        </div>
      </section>

      {/* ═══ STORY SECTION ═══ */}
      <section id="story" style={{ padding: '64px 16px 48px', maxWidth: 700, margin: '0 auto' }}>
        <Reveal>
          <SectionLabel text="The Narrative" />
        </Reveal>

        <Reveal delay={0.1}>
          <div style={{
            fontFamily: 'var(--serif)', fontSize: '1.05rem', lineHeight: 1.9,
            color: 'rgba(255,255,255,0.5)', padding: '0 4px',
          }}>
            <p style={{ marginBottom: 18 }}>It began a couple months before I dropped out of film school.</p>
            <p style={{ marginBottom: 18 }}>At 19, I was overwhelmed and realizing that the institution was a structure I no longer needed to validate my vision. I didn&apos;t drop out because it was too hard — I dropped out to prove this wasn&apos;t just a degree for me. <span style={{ color: 'var(--fg)', fontWeight: 600 }}>It was my vocation.</span></p>
            <p style={{ marginBottom: 18 }}>From a family of Yale and Columbia grads, multinational business owners — my path was set. Business, law, or medicine. When I chose to chase a camera instead of a courtroom, the disappointment was palpable. But I embraced it.</p>
            <p style={{ marginBottom: 18 }}>I&apos;ve spent years in the dark writing scripts like <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>Femme Fatale</span> — a 133-page screenplay submitted to A24 and Proximity Media. I&apos;ve shot music videos, directed live multi-cam shows, built broadcast news packages, created documentaries. I&apos;ve done every job on set because I wanted to understand the whole machine, not just one gear. That means when I&apos;m behind your stream camera, I&apos;m not just holding a rig — I&apos;m framing history.</p>
            <p style={{ marginBottom: 18 }}>I&apos;ve also been a writer my whole career — I have a show bible, screenplays, production books. I understand narrative. I understand what makes a moment worth remembering. That instinct doesn&apos;t turn off because we&apos;re live.</p>
            <p style={{ color: 'var(--fg)', fontWeight: 400 }}>I&apos;m not looking for a job. I&apos;m looking for the right mission. I&apos;ve watched you build for years — I know this is it. The work below exists to prove I can move with you at that level.</p>
          </div>
        </Reveal>
      </section>

      {/* ═══ CONTACT SECTION ═══ */}
      <section id="contact" style={{
        padding: '80px 16px 120px', textAlign: 'center', position: 'relative',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 50% 50%, rgba(255,60,0,0.04) 0%, transparent 55%)',
        }} />
        <Reveal style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            fontFamily: 'var(--display)',
            fontSize: 'clamp(2.8rem, 14vw, 7rem)',
            lineHeight: 0.9, letterSpacing: -1,
          }}>
            I&apos;M<br /><span style={{ color: 'var(--accent)' }}>YOUR</span><br />GUY
          </div>

          <p style={{
            marginTop: 20, fontFamily: 'var(--serif)',
            fontSize: '1rem', fontStyle: 'italic',
            color: 'rgba(255,255,255,0.4)', maxWidth: 340, margin: '20px auto 0',
            lineHeight: 1.7,
          }}>
            DM me or reach out to @yharca directly. I&apos;m available immediately and ready to relocate.
          </p>

          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 10, marginTop: 32,
          }}>
            {[
              { l: 'Email Me', h: 'mailto:peterolowude@gmail.com' },
              { l: 'X / Twitter', h: 'https://twitter.com/5stariah' },
              { l: 'Full Drive Portfolio', h: 'https://drive.google.com/drive/folders/10kpdBuTKIWpCrARqTNSCW3OtyWzQnAg0' },
            ].map((l, i) => (
              <a key={i} href={l.h} target="_blank" rel="noopener noreferrer"
                style={{
                  fontSize: 10, fontFamily: 'var(--mono)', letterSpacing: 4,
                  textTransform: 'uppercase', color: i === 0 ? '#080808' : 'var(--fg)',
                  textDecoration: 'none',
                  border: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.2)',
                  background: i === 0 ? 'var(--accent)' : 'transparent',
                  padding: '16px 32px', width: '100%', maxWidth: 300,
                  textAlign: 'center', fontWeight: i === 0 ? 500 : 400,
                }}
              >{l.l}</a>
            ))}
          </div>

          <p style={{
            marginTop: 28, fontFamily: 'var(--serif)',
            fontSize: '0.9rem', fontStyle: 'italic', opacity: 0.28,
          }}>
            Available immediately · Calgary, AB<br />Ready to relocate · Full time · Passport ready
          </p>
        </Reveal>
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
