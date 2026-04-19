import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Twitter, ExternalLink, FileText, ChevronRight, Check, ChevronDown, Instagram, Tv } from 'lucide-react';

import { useColorExtractor } from './hooks/useColorExtractor';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import {
  VIDEOS,
  WRITING_FEATURE,
  OTHER_WRITING,
  STATS_DATA,
  STORY_PARAGRAPHS,
  STORY_EXPANDED_PARAGRAPHS,
  HERO_TAGLINE,
  HERO_TITLE_1,
  HERO_TITLE_2,
  HERO_SUBTEXT_1,
  CONTACT_LINKS,
  FOOTER_TEXT
} from './data/content';

import CustomCursor from './components/CustomCursor';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import CinematicNav from './components/CinematicNav';
import VideoCard3D from './components/VideoCard';
import VideoOverlay from './components/VideoOverlay';
import ScrollProgress from './components/ScrollProgress';
import AmbientBackground from './components/AmbientBackground';
import PhotoField from './components/PhotoField';
import StorySection from './components/StorySection';

/* ═══ HELPERS ═══ */
export function thumbUrl(video) {
  if (video.yt) return `https://img.youtube.com/vi/${video.yt}/maxresdefault.jpg`;
  if (video.did) return `https://lh3.googleusercontent.com/d/${video.did}=w800`;
  return '';
}
export function thumbFallback(video) {
  if (video.yt) return `https://img.youtube.com/vi/${video.yt}/hqdefault.jpg`;
  if (video.did) return `https://drive.google.com/thumbnail?id=${video.did}&sz=w800`;
  return '';
}
export function embedUrl(video) {
  if (video.yt) return `https://www.youtube.com/embed/${video.yt}?autoplay=1&rel=0&modestbranding=1&color=white`;
  if (video.did) return `https://drive.google.com/file/d/${video.did}/preview`;
  return '';
}
export function watchUrl(video) {
  if (video.yt) return `https://youtu.be/${video.yt}`;
  if (video.did) return `https://drive.google.com/file/d/${video.did}/view`;
  return '#';
}

/* ═══ SECTION LABEL ═══ */
function SectionLabel({ text }) {
  return (
    <div className="section-label">
      <motion.div className="section-label__line"
        initial={{ width: 0 }} whileInView={{ width: 40 }} viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.16,1,0.3,1] }}
      />
      <motion.span className="section-label__text"
        initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {text}
      </motion.span>
    </div>
  );
}

/* ═══ STATS BAR ═══ */
function StatsBar() {
  const stats = [
    { num: '12', label: 'Projects' },
    { num: '4+', label: 'Years' },
    { num: '5', label: 'Hats' },
    { num: '2', label: 'Working on Now' },
  ];
  return (
    <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} transition={{ duration:0.8 }}
      style={{ display:'flex', justifyContent:'center', gap:'clamp(20px,6vw,64px)', padding:'44px 20px', borderTop:'1px solid rgba(255,255,255,0.03)', borderBottom:'1px solid rgba(255,255,255,0.03)', background:'rgba(var(--ambient-r),var(--ambient-g),var(--ambient-b),0.02)', transition:'background 0.6s' }}>
      {stats.map((s,i) => (
        <motion.div key={i} initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.08, duration:0.5 }}
          style={{ textAlign:'center' }}>
          <div style={{ fontFamily:'var(--display)', fontSize:'clamp(2rem,6vw,3.5rem)', lineHeight:1, color:'var(--fg)', letterSpacing:1 }}>{s.num}</div>
          <div style={{ fontFamily:'var(--mono)', fontSize:7, letterSpacing:3, textTransform:'uppercase', color:'var(--fg-subtle)', marginTop:6 }}>{s.label}</div>
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ═══ WRITING — Femme Fatale cinematic feature + compact grid ═══ */

function WritingSection() {
  return (
    <section id="writing" className="section" style={{ paddingTop:60, paddingBottom:60 }}>
      <div className="section__inner">
        <SectionLabel text="The Writing" />

        {/* FEMME FATALE — cinematic preview card */}
        <motion.div
          className="card"
          initial={{ opacity:0, y:50 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:'-80px' }}
          transition={{ duration:0.8, ease:[0.16,1,0.3,1] }}
          style={{
            position:'relative', overflow:'hidden', marginBottom:18,
            minHeight:280,
          }}
        >
          {/* Cinematic gradient backdrop */}
          <div style={{
            position:'absolute', inset:0, pointerEvents:'none',
            background:'linear-gradient(135deg, rgba(var(--ambient-r),var(--ambient-g),var(--ambient-b),0.12) 0%, rgba(0,0,0,0.95) 60%)',
            transition:'background 0.6s',
          }} />

          {/* Large ghost title */}
          <div style={{
            position:'absolute', top:-20, right:-10,
            fontFamily:'var(--display)', fontSize:'clamp(6rem,20vw,14rem)',
            lineHeight:0.85, color:'rgba(255,255,255,0.025)', userSelect:'none',
            pointerEvents:'none', letterSpacing:-4,
          }}>FF</div>

          {/* Content */}
          <div style={{ position:'relative', zIndex:1, padding:'clamp(28px,5vw,48px)' }}>
            <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:16 }}>
              <span className="pill pill--accent" style={{ fontSize:7 }}>Screenplay</span>
              <span className="pill" style={{ fontSize:7 }}>133 Pages</span>
              <span className="pill" style={{ fontSize:7 }}>Draft 9</span>
              <span className="pill" style={{ fontSize:7 }}>A24 / Proximity Media</span>
            </div>

            <h3 style={{ fontFamily:'var(--display)', fontSize:'clamp(2.8rem,8vw,5rem)', letterSpacing:2, lineHeight:0.9, marginBottom:16 }}>
              Femme Fatale
            </h3>

            <p style={{ fontFamily:'var(--mono)', fontSize:9, letterSpacing:2, color:'var(--fg-subtle)', textTransform:'uppercase', marginBottom:20 }}>
              Noir Thriller · Feature Film
            </p>

            <div style={{
              fontFamily:'var(--serif)', fontSize:'clamp(0.9rem,2.5vw,1.05rem)', lineHeight:1.82,
              fontStyle:'italic', color:'var(--fg-muted)',
              borderLeft:'2px solid rgb(var(--ambient-r),var(--ambient-g),var(--ambient-b))',
              paddingLeft:20, maxWidth:600, transition:'border-color 0.6s',
            }}>
              A deconstruction of narrative control set between Port-au-Prince in 1957 and 1960s Paris. <span style={{ color:'var(--fg)' }}>Femme Fatale</span> follows Iris Beaumont — a woman who survives not with weapons, but with the story she chooses to tell.
            </div>

            <div style={{ display:'flex', gap:16, marginTop:32, flexWrap:'wrap' }}>
              <motion.a 
                href="https://drive.google.com/file/d/1xx9bJWGSEekWqqVmpVS64k7KWo276lVZ/view"
                target="_blank" rel="noopener noreferrer"
                whileHover={{ y:-2, scale: 1.02 }} whileTap={{ scale: 0.98 }}
                style={{ 
                  display:'flex', alignItems:'center', gap:8, fontFamily:'var(--mono)', fontSize:9, 
                  letterSpacing:3, textTransform:'uppercase', color:'rgb(var(--ambient-r),var(--ambient-g),var(--ambient-b))', 
                  transition:'all 0.4s', textDecoration:'none', cursor:'none',
                  padding: '12px 20px', borderRadius: 'var(--radius-full)',
                  border: '1px solid rgba(var(--ambient-r),var(--ambient-g),var(--ambient-b), 0.3)',
                  background: 'rgba(var(--ambient-r),var(--ambient-g),var(--ambient-b), 0.05)'
                }}
              >
                <FileText size={13} /> View Show Bible <ChevronRight size={10} />
              </motion.a>

              <motion.a 
                href="https://drive.google.com/file/d/15UV22p-90rGDGfhROKqiIxELp87vCsik/view"
                target="_blank" rel="noopener noreferrer"
                whileHover={{ y:-2, scale: 1.02 }} whileTap={{ scale: 0.98 }}
                style={{ 
                  display:'flex', alignItems:'center', gap:8, fontFamily:'var(--mono)', fontSize:9, 
                  letterSpacing:3, textTransform:'uppercase', color:'var(--fg)', 
                  transition:'all 0.4s', textDecoration:'none', cursor:'none',
                  padding: '12px 20px', borderRadius: 'var(--radius-full)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.02)'
                }}
              >
                <FileText size={13} /> Read Latest Draft <ChevronRight size={10} />
              </motion.a>
            </div>
          </div>
        </motion.div>

        {/* Other writing — compact grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:16 }}>
          {OTHER_WRITING.map((w, i) => (
            <motion.a key={i} href={`https://drive.google.com/file/d/${w.did}/view`} target="_blank" rel="noopener noreferrer"
              className="card" initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              transition={{ delay:i*0.06, duration:0.5 }} 
              whileHover={{ 
                y: -6, 
                borderColor: 'rgba(var(--ambient-r),var(--ambient-g),var(--ambient-b),0.5)',
                boxShadow: '0 12px 30px rgba(0,0,0,0.8), 0 0 40px rgba(var(--ambient-r),var(--ambient-g),var(--ambient-b),0.1)'
              }}
              style={{ 
                textDecoration:'none', display:'flex', flexDirection:'column', justifyContent:'space-between', 
                padding:'32px 24px', minHeight:'180px', cursor:'none', 
                background: 'linear-gradient(to bottom right, #111 0%, #080808 100%)',
                border: '1px solid rgba(255,255,255,0.06)',
                transition: 'border-color 0.4s, box-shadow 0.4s'
              }}>
              
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <FileText size={14} style={{ color: 'rgb(var(--ambient-r),var(--ambient-g),var(--ambient-b))', opacity: 0.8 }} />
                  <span className="pill" style={{ fontSize:7, margin: 0, border: 'none', background: 'rgba(255,255,255,0.03)' }}>{w.type}</span>
                </div>
                
                <h4 style={{ fontFamily:'var(--display)', fontSize:'clamp(1.4rem, 3vw, 1.8rem)', letterSpacing:1, lineHeight: 1.1, color: 'var(--fg)' }}>{w.title}</h4>
                <p style={{ fontFamily:'var(--serif)', fontStyle:'italic', fontSize:'1.05rem', color:'var(--fg-muted)', marginTop:8 }}>{w.sub}</p>
              </div>
              
              <motion.span 
                style={{ 
                  display:'inline-flex', alignItems:'center', gap:6, marginTop:24, 
                  fontSize:9, letterSpacing:3, fontFamily:'var(--mono)', 
                  color:'var(--fg)', textTransform:'uppercase', fontWeight: 500
                }}
              >
                Read Document <ChevronRight size={12} style={{ color: 'rgb(var(--ambient-r),var(--ambient-g),var(--ambient-b))' }} />
              </motion.span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══ CONTACT ═══ */

function MagBtn({ href, icon, label, primary }) {
  const ref = useRef(null);
  const handleMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--mouse-x', `${((e.clientX-r.left)/r.width)*100}%`);
    ref.current.style.setProperty('--mouse-y', `${((e.clientY-r.top)/r.height)*100}%`);
  };
  return (
    <motion.a ref={ref} href={href} target="_blank" rel="noopener noreferrer"
      className="magnetic-btn" onMouseMove={handleMove} whileHover={{ y:-3 }} whileTap={{ scale:0.96 }}
      style={{
        width:'100%', maxWidth:340, textDecoration:'none', justifyContent:'center', cursor:'none',
        ...(primary ? { background:'rgb(var(--ambient-r),var(--ambient-g),var(--ambient-b))', color:'#080808', borderColor:'transparent', fontWeight:500, transition:'all 0.6s' } : {}),
      }}>
      {icon} {label}
    </motion.a>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="section" style={{ textAlign:'center', overflow:'visible', paddingTop:120, paddingBottom:160 }}>
      {/* Background Glow */}
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', background:'radial-gradient(ellipse at 50% 50%, rgba(var(--ambient-r),var(--ambient-g),var(--ambient-b),0.09) 0%, transparent 60%)', transition:'background 0.6s' }} />
      
      <div style={{ position:'relative', zIndex:2, display:'flex', flexDirection:'column', alignItems:'center' }}>
        
        <motion.p initial={{ opacity:0, y:14 }} whileInView={{ opacity:0.4, y:0 }} viewport={{ once:true }} transition={{ delay:0.15, duration:0.6 }}
          style={{ fontFamily:'var(--serif)', fontSize:'1.2rem', fontStyle:'italic', color:'var(--fg-muted)', maxWidth:400, margin:'0 auto 40px', lineHeight:1.7 }}>
          Let's build something real.
        </motion.p>

        {/* Primary CTAs using MagBtn for the desired hover effect */}
        <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:0.2, duration:0.7 }}
          style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16, width: '100%', maxWidth: '340px' }}>
          
          <MagBtn 
            href="https://ig.me/m/lonerkid" 
            label="Direct Message" 
            icon={<Instagram size={15} />} 
            primary={true} 
          />
          
          <MagBtn 
            href="mailto:peterolowude@icloud.com" 
            label="Email Me" 
            icon={<Mail size={15} />} 
          />

        </motion.div>

        {/* Other Social Links Row */}
        <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:0.4, duration:0.7 }}
          style={{ display:'flex', justifyContent:'center', gap:24, marginTop:48, flexWrap:'wrap' }}>
          {CONTACT_LINKS.filter(l => l.label !== 'Email Me' && l.label !== 'Instagram').map((l, i) => (
            <motion.a key={i} href={l.href} target="_blank" rel="noopener noreferrer"
              whileHover={{ y: -3, color: 'var(--fg)' }} whileTap={{ scale: 0.95 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 20px', borderRadius: 'var(--radius-full)',
                fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
                color: 'var(--fg-muted)', textDecoration: 'none',
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
                cursor: 'none', transition: 'all 0.3s'
              }}
            >
              {l.icon} {l.label}
            </motion.a>
          ))}
        </motion.div>
        
        <motion.p initial={{ opacity:0 }} whileInView={{ opacity:0.3 }} viewport={{ once:true }} transition={{ delay:0.6 }}
          style={{ marginTop:80, fontFamily:'var(--mono)', fontSize:9, letterSpacing:3, textTransform:'uppercase', lineHeight:2.2 }}>
          Available immediately · Calgary, AB<br />Ready to relocate · Full time · Passport ready
        </motion.p>
      </div>
    </section>
  );
}

/* ═══ SIDE DOT NAV ═══ */
function DotNav({ activeSection }) {
  const sections = ['pitch','story','work','writing','contact'];
  const labels = ['Why Me','Story','Work','Writing','Contact'];
  return (
    <div style={{
      position:'fixed', right:16, top:'50%', transform:'translateY(-50%)',
      zIndex:90, display:'flex', flexDirection:'column', gap:16,
    }}>
      {sections.map((id, i) => (
        <motion.a key={id} href={`#${id}`}
          initial={{ opacity:0, x:10 }} animate={{ opacity:1, x:0 }}
          transition={{ delay:1 + i*0.08, duration:0.5 }}
          style={{
            width: activeSection === id ? 10 : 6,
            height: activeSection === id ? 10 : 6,
            borderRadius:'50%',
            background: activeSection === id ? 'rgb(var(--ambient-r),var(--ambient-g),var(--ambient-b))' : 'rgba(255,255,255,0.15)',
            transition:'all 0.4s var(--ease-expo)',
            cursor:'none',
          }}
          title={labels[i]}
        />
      ))}
    </div>
  );
}

/* ═══ APP ROOT ═══ */
export default function App() {
  const [activeVideo, setActiveVideo] = useState(null);
  const [activeVideoColor, setActiveVideoColor] = useState(null);

  const { setAmbientColor, extractColor, resetColor } = useColorExtractor();
  const { scrollProgress, activeSection, isScrolled, scrollToSection } = useSmoothScroll(['pitch','story','work','writing','contact']);

  const handleVideoClick = useCallback((video, color) => {
    setActiveVideo(video);
    setActiveVideoColor(color);
    if (color) setAmbientColor(color);
  }, [setAmbientColor]);

  const handleVideoClose = useCallback(() => {
    setActiveVideo(null);
    setActiveVideoColor(null);
    resetColor();
  }, [resetColor]);

  const featuredVideos = VIDEOS.filter(v => v.feat);
  const otherVideos = VIDEOS.filter(v => !v.feat);

  return (
    <>
      <CustomCursor />

      <div style={{ background:'var(--bg)', color:'var(--fg)', minHeight:'100vh', overflowX:'hidden', position:'relative' }}>
        <AmbientBackground />
        <PhotoField />
        <ScrollProgress progress={scrollProgress} />
        <div className="grain" />

        <Navigation isScrolled={isScrolled} activeSection={activeSection} scrollToSection={scrollToSection} />
        <CinematicNav sections={['pitch','story','work','writing','contact']} activeSection={activeSection} scrollToSection={scrollToSection} />
        <Hero scrollToSection={scrollToSection} />

<StatsBar />

        {/* ── STORY — early, personal ── */}
        <StorySection />

        {/* ── WORK — the main event ── */}
        <section id="work" className="section">
          <div className="section__inner">
            <SectionLabel text={`The Work — ${VIDEOS.length} Projects`} />

            <div className="bento-grid">
              {VIDEOS.map((v, i) => {
                let bentoClass = 'bento-item--standard';
                // Pattern to create a varied bento box look
                if (v.feat) {
                  bentoClass = 'bento-item--large';
                } else if (i === 2 || i === 8) {
                  bentoClass = 'bento-item--tall';
                } else if (i === 5 || i === 11) {
                  bentoClass = 'bento-item--wide';
                }

                return (
                  <div key={v.id} className={bentoClass}>
                    <VideoCard3D video={v} featured={v.feat || bentoClass === 'bento-item--large'}
                      onClick={handleVideoClick} extractColor={extractColor}
                      setAmbientColor={setAmbientColor} resetColor={resetColor} />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <WritingSection />
        <ContactSection />

        <footer style={{ textAlign:'center', padding:'24px 20px 44px', fontSize:7, letterSpacing:4, textTransform:'uppercase', opacity:0.05, fontFamily:'var(--mono)' }}>
          © 2026 Peter Olowude · Misfits Cavern
        </footer>

        <VideoOverlay 
          video={activeVideo} 
          dominantColor={activeVideoColor} 
          onClose={handleVideoClose} 
          setAmbientColor={setAmbientColor} 
        />
      </div>
    </>
  );
}
