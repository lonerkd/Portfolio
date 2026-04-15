import React, { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mail, Twitter, ExternalLink, FileText, ChevronRight } from 'lucide-react';

import { useColorExtractor } from './hooks/useColorExtractor';
import { useSmoothScroll } from './hooks/useSmoothScroll';


import CustomCursor from './components/CustomCursor';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import VideoCard3D from './components/VideoCard';
import VideoOverlay from './components/VideoOverlay';
import ScrollProgress from './components/ScrollProgress';
import AmbientBackground from './components/AmbientBackground';

/* ═══ DATA ═══ */
// yt  = YouTube video ID  → used for embed + thumbnail (preferred)
// did = Google Drive ID   → fallback for videos not yet on YouTube
const VIDEOS = [
  { id: '10m',      title: '10 Million',             cat: 'Music Video',    role: 'DP / Editor',                     year: '2026', desc: 'High-energy visual rhythm. Every cut lands on the beat, every frame tells a story of ambition.',    yt: '3frfHolmYkE',  did: '10A2uzDxrEEgx-6tiS3M_qbhAq72dglZt', feat: true },
  { id: 'brief',    title: 'The Briefcase',           cat: 'Short Film',     role: 'Writer / DP',                     year: '2024', desc: 'A crime thriller about two couriers, a mysterious briefcase, and a deal that has to go right.',    yt: 'pUZkiH74yTU',  did: '1EM1AVe-50e6IMKL2m8teeakg6aSL3ctr', feat: true },
  { id: 'black',    title: 'Black Stuff',             cat: 'Music Video',    role: 'DP / Editor',                     year: '2025', desc: 'Gritty, visceral. A visual language built from contrast and controlled chaos.',                    yt: 'NqcGtFr95oM',  did: null,                                feat: true },
  { id: 'audio',    title: 'The Audio Blueprint',     cat: 'Doc Teaser',     role: 'Director / Writer / Editor',      year: '2025', desc: 'The invisible art of sound design — why audio is the secret weapon behind iconic movie moments.',  yt: 'FiTiVNZxTPs',  did: '1hpS5fIfDRthOgzCD0jda5IcuHiverR8n' },
  { id: 'psa',      title: 'The Grand PSA',           cat: 'Commercial',     role: 'Writer / Director / DP / Editor', year: '2025', desc: 'A love letter to The Grand Theatre. Wrote, directed, shot, and graded the final cut.',             yt: 'Z9hXm2u4cZw',  did: '1Mmk_nM_WXCskja0NEIa6PlM51cul-z00' },
  { id: 'sports',   title: 'Live Sports Show Intro',  cat: 'Live Multi-Cam', role: 'Director / Editor',               year: '2025', desc: 'High-energy live sports broadcast opener. Motion graphics meets live production energy.',           yt: 'gWYoZh9kl9I',  did: null },
  { id: 'news',     title: 'Banded Peak News Pack',   cat: 'Broadcast',      role: 'Camera Op / Editor',              year: '2024', desc: 'Professional broadcast news package under deadline pressure.',                                     yt: 'l6JnCA7e3DY',  did: '1iw925ZsP2evEINyDqP6iesQYellQ4Z9u' },
  { id: 'altitude', title: 'The Pursuit of Altitude', cat: 'Documentary',    role: 'DP / Editor',                     year: '2024', desc: 'Chasing elevation, literal and metaphorical. Visual storytelling through landscape and movement.',  yt: 'wHwXBw2xk5M', did: '1-bPAYnQROhT9awRMEBWuDCGSw04CtBgE' },
  { id: 'cook',     title: 'Live Cooking Demo',       cat: 'Live Multi-Cam', role: 'Camera Op / Switcher',            year: '2025', desc: 'Live multi-camera production. Real-time switching, no second takes.',                              yt: 'R2IZKAHYmME', did: '13fmSRFNiGZl2b57-cd0qVnjcPx9IDUUZ' },
  { id: 'intv',     title: 'Live Interview Show',     cat: 'Live Multi-Cam', role: 'Camera Op / Director',            year: '2025', desc: 'Sit-down interview. Directing multiple camera operators in real time.',                            yt: 'rctvfSJsO9Y', did: '1A7dgksrR-9KJ6TyxfO6Ch3TOc2bqbL0t' },
  { id: 'tiktok',   title: 'TikTok Addiction',        cat: 'Doc Teaser',     role: 'Director / Editor',               year: '2024', desc: 'Examining our relationship with infinite scroll.',                                                  yt: 'KQHjrvuthYE', did: '1o61DVHh8QhTYWKSOQOvs9P4kEoZQqygI' },
  { id: 'fraud',    title: 'Fraud',                   cat: 'Doc Teaser',     role: 'Director / Editor',               year: '2024', desc: 'Deception as a system. How fraud operates in plain sight.',                                        yt: 'E6rydhe1PAY', did: '10AfFlmGp1qbqI_9BKSQnYfyTi7o_SFbp' },
];

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

/* ═══ MARQUEE ═══ */
function Marquee() {
  const skills = ['CINEMATOGRAPHY','DIRECTING','MUSIC VIDEOS','CREATIVE DIRECTION','EDITING','STORYTELLING','WRITING','LIVE MULTI-CAM'];
  return (
    <div style={{ padding:'40px 0', overflow:'hidden', borderTop:'1px solid rgba(255,255,255,0.03)', borderBottom:'1px solid rgba(255,255,255,0.03)', background:'rgba(var(--ambient-r),var(--ambient-g),var(--ambient-b),0.025)', transition:'background 0.6s' }}>
      <motion.div animate={{ x:[0,-2400] }} transition={{ duration:45, repeat:Infinity, ease:'linear' }} style={{ display:'flex', gap:56, whiteSpace:'nowrap' }}>
        {[...Array(7)].map((_,idx) => (
          <React.Fragment key={idx}>
            {skills.map((s,i) => (
              <span key={i} style={{ fontFamily:'var(--display)', fontSize:'1.2rem', letterSpacing:8, flexShrink:0, color: i%2===0 ? 'rgb(var(--ambient-r),var(--ambient-g),var(--ambient-b))' : 'var(--fg)', opacity: i%2===0 ? 0.75 : 0.07, transition:'color 0.6s' }}>{s}</span>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
}

/* ═══ WRITING SECTION ═══ */
const SCENE_EX = [
  { label: 'Opening',        text: "A MAKEUP ARTIST works on IRIS BEAUMONT's face. Her eyes open. Fixed on the mirror. On the monitor above: a close-up of her own face from a press shoot. She watches herself watching herself." },
  { label: 'The Market',     text: 'Two MEN come through. Civilian clothes. Dark glasses. Machetes at their belts. "Too pretty for this market, little bird." Iris meets his gaze. She doesn\'t give him anything.' },
  { label: 'The Invitation', text: 'A POSTER on the wall. A Black woman in white feathers caught mid-arc — arms wide, face up. LES ÉTOILES DE PARIS. "Auditions tonight. Eight o\'clock. We leave for Paris in two weeks."' },
];
const OTHER_WRITING = [
  { type: 'Production Book',       title: 'Studio Music Video',      excerpt: 'Full production book for a Frank Ocean "Chanel" music video. Shot lists, cam plans, choreography.',  did: '174wk77-9dBwOoJlMvROLpIsnf-kByrC6' },
  { type: 'Documentary One Sheet', title: 'The Audio Blueprint',      excerpt: 'A witty 5-minute documentary that dives into the unseen magic of sound design in film.',            did: '1UvAxDRvO_6MvAAlUEFzVVTkou1ZNoxY-' },
  { type: 'PSA Script',            title: 'A Stage for Every Story',  excerpt: 'For over a century, The Grand Theatre has been more than just a stage.',                            did: '1JQpQAEyNJmQlRnt2FVXDvjIZRaN_hNWf' },
  { type: 'Short Film Screenplay', title: 'The Briefcase',            excerpt: '"Stop stressing man. We ain\'t gonna mess up." — "People died." — A confident chuckle. "Heh, ya they did."', did: '1ht--f7NM3X5LVPyaoA0uxoTlnAlZTMHJ' },
];

function WritingSection() {
  return (
    <section id="writing" className="section">
      <div className="section__inner">
        <SectionLabel text="The Writing" />
        <motion.div initial={{ opacity:0, y:50 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:'-80px' }} transition={{ duration:0.8, ease:[0.16,1,0.3,1] }}
          className="card" style={{ padding:'clamp(28px,5vw,48px)', marginBottom:16, overflow:'visible', position:'relative' }}>
          <div style={{ position:'absolute', top:-60, right:-60, width:300, height:300, borderRadius:'50%', pointerEvents:'none', background:'radial-gradient(circle, rgba(var(--ambient-r),var(--ambient-g),var(--ambient-b),0.07) 0%, transparent 60%)' }} />
          <span className="pill pill--accent" style={{ fontSize:7 }}>Screenplay · Draft 9 · 133 Pages</span>
          <h3 style={{ fontFamily:'var(--display)', fontSize:'clamp(2.2rem,6vw,3.5rem)', letterSpacing:2, marginTop:10 }}>Femme Fatale</h3>
          <p style={{ fontSize:9, letterSpacing:2, color:'var(--fg-subtle)', marginTop:4, fontFamily:'var(--mono)', textTransform:'uppercase' }}>Political Noir · Limited Series · For A24 / Proximity Media</p>
          <div style={{ fontFamily:'var(--serif)', fontSize:'clamp(0.9rem,2.5vw,1.05rem)', lineHeight:1.82, fontStyle:'italic', color:'var(--fg-muted)', borderLeft:'2px solid rgb(var(--ambient-r),var(--ambient-g),var(--ambient-b))', paddingLeft:20, marginTop:28, transition:'border-color 0.6s' }}>
            A deconstruction of narrative control and the fabrication of reality. Set between Port-au-Prince in 1957 and a Parisian television studio,{' '}
            <span style={{ color:'var(--fg)' }}>Femme Fatale</span> follows Iris Beaumont — a woman who survives not with weapons, but with the stories she chooses to tell.
          </div>
          <div style={{ marginTop:28, display:'flex', flexDirection:'column', gap:6 }}>
            {SCENE_EX.map((ex,i) => (
              <motion.div key={i} initial={{ opacity:0, x:-20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ delay:i*0.1, duration:0.6 }}
                style={{ background:'rgba(255,255,255,0.018)', padding:'16px 18px', borderLeft:'2px solid rgba(var(--ambient-r),var(--ambient-g),var(--ambient-b),0.18)', borderRadius:'0 6px 6px 0' }}>
                <span style={{ fontSize:7, letterSpacing:4, textTransform:'uppercase', color:'rgb(var(--ambient-r),var(--ambient-g),var(--ambient-b))', display:'block', marginBottom:7, fontFamily:'var(--mono)', transition:'color 0.6s' }}>{ex.label}</span>
                <p style={{ fontFamily:'var(--serif)', fontSize:13, lineHeight:1.7, color:'rgba(255,255,255,0.36)', fontStyle:'italic' }}>&quot;{ex.text}&quot;</p>
              </motion.div>
            ))}
          </div>
          <motion.a href="https://drive.google.com/file/d/1cIynCQgJtWfLRpb5xZzgQw0rHMKauSO9/view"
            target="_blank" rel="noopener noreferrer" className="magnetic-btn"
            whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
            style={{ marginTop:28, display:'inline-flex', textDecoration:'none', cursor:'none' }}>
            <FileText size={13} /> Read Full Script
          </motion.a>
        </motion.div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(270px,1fr))', gap:12 }}>
          {OTHER_WRITING.map((w,i) => (
            <motion.a key={i} href={`https://drive.google.com/file/d/${w.did}/view`} target="_blank" rel="noopener noreferrer"
              className="card" initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              transition={{ delay:i*0.08, duration:0.6 }} whileHover={{ y:-5, transition:{ duration:0.3, ease:[0.16,1,0.3,1] } }}
              style={{ textDecoration:'none', display:'block', padding:'24px 20px', cursor:'none' }}>
              <span className="pill pill--accent" style={{ fontSize:7 }}>{w.type}</span>
              <h4 style={{ fontFamily:'var(--display)', fontSize:'1.25rem', letterSpacing:2, marginTop:10 }}>{w.title}</h4>
              <p style={{ fontFamily:'var(--serif)', fontSize:13, lineHeight:1.65, color:'rgba(255,255,255,0.3)', fontStyle:'italic', marginTop:10 }}>&quot;{w.excerpt}&quot;</p>
              <span style={{ display:'inline-flex', alignItems:'center', gap:4, marginTop:14, fontSize:8, letterSpacing:3, fontFamily:'var(--mono)', color:'var(--fg-subtle)', textTransform:'uppercase' }}>READ <ChevronRight size={10} /></span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══ STORY SECTION ═══ */
const STORY = [
  { plain: "It began a couple months before I dropped out of film school." },
  { pre: "At 19, I was overwhelmed and realizing that the institution was a structure I no longer needed to validate my vision. I didn't drop out because it was too hard — I dropped out to prove this wasn't just a degree for me.", em: "It was my vocation." },
  { plain: "From a family of Yale and Columbia grads, multinational business owners — my path was set. Business, law, or medicine. When I chose to chase a camera instead of a courtroom, the disappointment was palpable. But I embraced it." },
  { pre: "I've spent years in the dark writing scripts like", accent: "Femme Fatale", post: "— a 133-page screenplay submitted to A24 and Proximity Media. I've shot music videos, directed live multi-cam shows, built news packages, created documentaries. I've done every job on set because I wanted to understand the whole machine, not just one gear." },
  { em: "I believe in the vision being built here. I have the work to show I can do it, and the dedication to ensure it's done right." },
];

function StorySection() {
  return (
    <section id="story" className="section">
      <div className="section__inner" style={{ maxWidth:800 }}>
        <SectionLabel text="The Narrative" />
        <div style={{ fontFamily:'var(--serif)', fontSize:'clamp(1.1rem,3vw,1.28rem)', lineHeight:1.88, color:'var(--fg-muted)' }}>
          {STORY.map((p,i) => (
            <motion.p key={i} initial={{ opacity:0, y:28, filter:'blur(4px)' }} whileInView={{ opacity:1, y:0, filter:'blur(0px)' }}
              viewport={{ once:true, margin:'-60px' }} transition={{ duration:0.9, delay:i*0.05, ease:[0.16,1,0.3,1] }} style={{ marginBottom:34 }}>
              {p.plain}
              {p.pre && <>{p.pre} </>}
              {p.accent && <span style={{ color:'rgb(var(--ambient-r),var(--ambient-g),var(--ambient-b))', fontStyle:'italic', transition:'color 0.6s' }}>{p.accent}</span>}
              {p.post && <> {p.post}</>}
              {p.em && <span style={{ color:'var(--fg)', fontWeight:500 }}> {p.em}</span>}
            </motion.p>
          ))}
        </div>
        <motion.div initial={{ scaleX:0 }} whileInView={{ scaleX:1 }} viewport={{ once:true }} transition={{ duration:1.4, ease:[0.16,1,0.3,1] }}
          style={{ height:1, transformOrigin:'left', background:'linear-gradient(90deg, rgb(var(--ambient-r),var(--ambient-g),var(--ambient-b)), transparent)', marginTop:12, transition:'background 0.6s' }} />
      </div>
    </section>
  );
}

/* ═══ CONTACT SECTION ═══ */
const CONTACT_LINKS = [
  { label:'Email',           href:'mailto:peterolowude@gmail.com',                                                      icon:<Mail size={15} /> },
  { label:'X / Twitter',     href:'https://twitter.com/5stariah',                                                        icon:<Twitter size={15} /> },
  { label:'View Everything', href:'https://drive.google.com/drive/folders/10kpdBuTKIWpCrARqTNSCW3OtyWzQnAg0',           icon:<ExternalLink size={15} /> },
];

function MagBtn({ href, icon, label }) {
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
      style={{ width:'100%', maxWidth:340, textDecoration:'none', justifyContent:'center', cursor:'none' }}>
      {icon} {label}
    </motion.a>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="section" style={{ textAlign:'center', overflow:'visible' }}>
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', background:'radial-gradient(ellipse at 50% 50%, rgba(var(--ambient-r),var(--ambient-g),var(--ambient-b),0.09) 0%, transparent 55%)', transition:'background 0.6s' }} />
      <div style={{ position:'relative', zIndex:2 }}>
        <motion.div initial={{ opacity:0, scale:0.9, filter:'blur(10px)' }} whileInView={{ opacity:1, scale:1, filter:'blur(0px)' }}
          viewport={{ once:true }} transition={{ duration:1, ease:[0.16,1,0.3,1] }}
          style={{ fontFamily:'var(--display)', fontSize:'clamp(4rem,18vw,12rem)', lineHeight:0.84, letterSpacing:-3 }}>
          LET'S<br />
          <span style={{ color:'rgb(var(--ambient-r),var(--ambient-g),var(--ambient-b))', transition:'color 0.6s' }}>BUILD</span><br />
          SOMETHING
        </motion.div>
        <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:0.2, duration:0.7 }}
          style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12, marginTop:60 }}>
          {CONTACT_LINKS.map((l,i) => (
            <motion.div key={i} initial={{ opacity:0, y:15 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:0.3+i*0.1 }}
              style={{ width:'100%', display:'flex', justifyContent:'center' }}>
              <MagBtn {...l} />
            </motion.div>
          ))}
        </motion.div>
        <motion.p initial={{ opacity:0 }} whileInView={{ opacity:0.38 }} viewport={{ once:true }} transition={{ delay:0.7 }}
          style={{ marginTop:52, fontFamily:'var(--serif)', fontSize:'1rem', fontStyle:'italic', lineHeight:1.9 }}>
          Available immediately · Calgary, AB<br />Ready to relocate · Full time
        </motion.p>
      </div>
    </section>
  );
}

/* ═══ APP ROOT ═══ */
export default function App() {
  const [activeVideo, setActiveVideo] = useState(null);
  const [activeVideoColor, setActiveVideoColor] = useState(null);

  const { setAmbientColor, extractColor, resetColor } = useColorExtractor();
  const { scrollProgress, activeSection, isScrolled, scrollToSection } = useSmoothScroll(['work','writing','story','contact']);

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
        <ScrollProgress progress={scrollProgress} />
        <div className="grain" />

        <Navigation isScrolled={isScrolled} activeSection={activeSection} scrollToSection={scrollToSection} />
        <Hero scrollToSection={scrollToSection} />

        {/* ── WORK ── */}
        <section id="work" className="section">
          <div className="section__inner">
            <SectionLabel text={`The Work — ${VIDEOS.length} Projects`} />
            <div className="video-grid" style={{ marginBottom:18 }}>
              {featuredVideos.map(v => (
                <VideoCard3D key={v.id} video={v} featured
                  onClick={handleVideoClick} extractColor={extractColor}
                  setAmbientColor={setAmbientColor} resetColor={resetColor} />
              ))}
            </div>
            <div className="video-grid">
              {otherVideos.map(v => (
                <VideoCard3D key={v.id} video={v}
                  onClick={handleVideoClick} extractColor={extractColor}
                  setAmbientColor={setAmbientColor} resetColor={resetColor} />
              ))}
            </div>
          </div>
        </section>

        <Marquee />
        <WritingSection />
        <StorySection />
        <ContactSection />

        <footer style={{ textAlign:'center', padding:'24px 20px 44px', fontSize:7, letterSpacing:4, textTransform:'uppercase', opacity:0.05, fontFamily:'var(--mono)' }}>
          © 2026 Peter Olowude · Misfits Cavern Productions
        </footer>

        <VideoOverlay video={activeVideo} dominantColor={activeVideoColor} onClose={handleVideoClose} />
      </div>
    </>
  );
}
