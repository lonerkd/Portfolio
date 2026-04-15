import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Twitter, ExternalLink, FileText, ChevronRight, Check, ChevronDown, Instagram, Tv } from 'lucide-react';

import { useColorExtractor } from './hooks/useColorExtractor';
import { useSmoothScroll } from './hooks/useSmoothScroll';

import CustomCursor from './components/CustomCursor';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import CinematicNav from './components/CinematicNav';
import VideoCard3D from './components/VideoCard';
import VideoOverlay from './components/VideoOverlay';
import ScrollProgress from './components/ScrollProgress';
import AmbientBackground from './components/AmbientBackground';
import PhotoField from './components/PhotoField';

/* ═══ DATA ═══ */
const VIDEOS = [
  { id: '10m',      title: '10 Million',             cat: 'Music Video',    role: 'DP / Editor',                     year: '2026', desc: 'Shot, lit, and edited solo.',    yt: '3frfHolmYkE',  did: '10A2uzDxrEEgx-6tiS3M_qbhAq72dglZt', feat: true },
  { id: 'black',    title: 'Black Stuff',             cat: 'Music Video',    role: 'DP / Editor',                     year: '2025', desc: 'Dark aesthetics, deep narrative weight.',                    yt: 'NqcGtFr95oM',  did: '1KHdETMZDHqrRzkL7Ook-61KHxFwcGnKB', feat: true },
  { id: 'intv',     title: 'Live Interview Show',     cat: 'Live Multi-Cam', role: 'Camera Op / Director',            year: '2025', desc: 'Directing multiple camera operators in real time.',  yt: 'rctvfSJsO9Y', did: '1A7dgksrR-9KJ6TyxfO6Ch3TOc2bqbL0t' },
  { id: 'sports',   title: 'Live Sports Show Intro',  cat: 'Live Multi-Cam', role: 'Director / Editor',               year: '2025', desc: 'Live broadcast opener. Motion graphics meets live energy.',           yt: 'gWYoZh9kl9I',  did: null },
  { id: 'cook',     title: 'Live Cooking Demo',       cat: 'Live Multi-Cam', role: 'Camera Op / Switcher',            year: '2025', desc: 'Real-time switching, no second takes.',                              yt: 'R2IZKAHYmME', did: '13fmSRFNiGZl2b57-cd0qVnjcPx9IDUUZ' },
  { id: 'brief',    title: 'The Briefcase',           cat: 'Short Film',     role: 'Writer / DP',                     year: '2024', desc: 'Crime thriller. Two couriers, one briefcase.',    yt: 'pUZkiH74yTU',  did: '1EM1AVe-50e6IMKL2m8teeakg6aSL3ctr', feat: true },
  { id: 'psa',      title: 'The Grand PSA',           cat: 'Commercial',     role: 'Writer / Director / DP / Editor', year: '2025', desc: 'Wrote, directed, shot, and graded.',             yt: 'Z9hXm2u4cZw',  did: '1Mmk_nM_WXCskja0NEIa6PlM51cul-z00' },
  { id: 'audio',    title: 'The Audio Blueprint',     cat: 'Doc Teaser',     role: 'Director / Writer / Editor',      year: '2025', desc: 'Sound design — the secret weapon behind iconic movies.',  yt: 'FiTiVNZxTPs',  did: '1hpS5fIfDRthOgzCD0jda5IcuHiverR8n' },
  { id: 'altitude', title: 'The Pursuit of Altitude', cat: 'Documentary',    role: 'DP / Editor',                     year: '2024', desc: 'Visual storytelling through landscape and movement.',  yt: 'wHwXBw2xk5M', did: '1-bPAYnQROhT9awRMEBWuDCGSw04CtBgE' },
  { id: 'news',     title: 'Banded Peak News Pack',   cat: 'Broadcast',      role: 'Camera Op / Editor',              year: '2024', desc: 'Broadcast news package under deadline.',                                     yt: 'l6JnCA7e3DY',  did: '1iw925ZsP2evEINyDqP6iesQYellQ4Z9u' },
  { id: 'tiktok',   title: 'TikTok Addiction',        cat: 'Doc Teaser',     role: 'Director / Editor',               year: '2024', desc: 'Our relationship with infinite scroll.',                                                  yt: 'KQHjrvuthYE', did: '1o61DVHh8QhTYWKSOQOvs9P4kEoZQqygI' },
  { id: 'fraud',    title: 'Fraud',                   cat: 'Doc Teaser',     role: 'Director / Editor',               year: '2024', desc: 'How fraud operates in plain sight.',                                        yt: 'E6rydhe1PAY', did: '10AfFlmGp1qbqI_9BKSQnYfyTi7o_SFbp' },
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

/* ═══ STATS BAR ═══ */
function StatsBar() {
  const stats = [
    { num: '12', label: 'Projects' },
    { num: '4+', label: 'Years' },
    { num: '5', label: 'Disciplines' },
    { num: '0', label: 'Days Until Available' },
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

/* ═══ PITCH — visual checklist ═══ */
function PitchStrip() {
  const items = ['Creative Vision','Music Video Experience','Camera Obsessed','Full-Time Ready','Stream & Vlog'];
  return (
    <section id="pitch" style={{ padding:'40px 20px 20px', maxWidth:900, margin:'0 auto' }}>
      <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.7 }}
        style={{ display:'flex', flexWrap:'wrap', gap:10, justifyContent:'center' }}>
        {items.map((item, i) => (
          <motion.div key={i}
            initial={{ opacity:0, scale:0.9 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }}
            transition={{ delay:i*0.06, duration:0.5, ease:[0.16,1,0.3,1] }}
            style={{
              display:'flex', alignItems:'center', gap:8,
              padding:'10px 18px', borderRadius:'var(--radius-full)',
              background:'rgba(var(--ambient-r),var(--ambient-g),var(--ambient-b),0.08)',
              border:'1px solid rgba(var(--ambient-r),var(--ambient-g),var(--ambient-b),0.18)',
              transition:'all 0.6s',
            }}>
            <Check size={12} style={{ color:'rgb(var(--ambient-r),var(--ambient-g),var(--ambient-b))', transition:'color 0.6s' }} />
            <span style={{ fontFamily:'var(--mono)', fontSize:9, letterSpacing:2, textTransform:'uppercase', color:'var(--fg)' }}>{item}</span>
          </motion.div>
        ))}
      </motion.div>
      <motion.p initial={{ opacity:0 }} whileInView={{ opacity:0.35 }} viewport={{ once:true }} transition={{ delay:0.4 }}
        style={{ textAlign:'center', marginTop:16, fontFamily:'var(--serif)', fontSize:'0.95rem', fontStyle:'italic', color:'var(--fg-muted)' }}>
        You said you need all five. I've got all five.
      </motion.p>
    </section>
  );
}

/* ═══ STORY — expanded personal narrative, comes early ═══ */
function StorySection() {
  const [expanded, setExpanded] = useState(false);
  return (
    <section id="story" className="section" style={{ paddingTop:60, paddingBottom:60 }}>
      <div className="section__inner" style={{ maxWidth:800 }}>
        <SectionLabel text="The Narrative" />
        <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.8 }}
          style={{ fontFamily:'var(--serif)', fontSize:'clamp(1.1rem,3vw,1.28rem)', lineHeight:1.88, color:'var(--fg-muted)' }}>

          <motion.p initial={{ opacity:0, y:20, filter:'blur(4px)' }} whileInView={{ opacity:1, y:0, filter:'blur(0px)' }}
            viewport={{ once:true }} transition={{ duration:0.9, ease:[0.16,1,0.3,1] }}
            style={{ marginBottom:24 }}>
            I'm from a family of Yale and Columbia grads, multinational business owners. My path was set — business, law, or medicine. When I chose a camera over a courtroom at 17, nobody understood. When I dropped out of film school at 19, even fewer did.
          </motion.p>

          <motion.p initial={{ opacity:0, y:20, filter:'blur(4px)' }} whileInView={{ opacity:1, y:0, filter:'blur(0px)' }}
            viewport={{ once:true }} transition={{ duration:0.9, delay:0.05, ease:[0.16,1,0.3,1] }}
            style={{ marginBottom:24 }}>
            I didn't drop out because it was too hard. <span style={{ color:'var(--fg)', fontWeight:500 }}>I dropped out to prove this wasn't just a degree for me — it was my vocation.</span> The institution couldn't move fast enough for what I needed to build.
          </motion.p>

          <motion.p initial={{ opacity:0, y:20, filter:'blur(4px)' }} whileInView={{ opacity:1, y:0, filter:'blur(0px)' }}
            viewport={{ once:true }} transition={{ duration:0.9, delay:0.1, ease:[0.16,1,0.3,1] }}
            style={{ marginBottom:24 }}>
            Since then I've been in the trenches — shooting music videos solo from concept to color grade, directing live multi-cam productions where there are no second takes, building broadcast news packages under real deadlines, writing a 133-page screenplay that I submitted to A24 and Proximity Media.
          </motion.p>

          <AnimatePresence>
            {expanded && (
              <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }} transition={{ duration:0.5, ease:[0.16,1,0.3,1] }}>
                <p style={{ marginBottom:24 }}>
                  I've done every job on set because I wanted to understand the whole machine, not just one gear. Camera, lighting, editing, writing, directing — I do all of it so that when I'm behind your stream camera, I'm not just holding a rig. <span style={{ color:'var(--fg)', fontWeight:500 }}>I'm framing history.</span>
                </p>
                <p style={{ marginBottom:24 }}>
                  I've also been a writer my whole career — I have a show bible, screenplays, production books. I understand narrative. I understand what makes a moment worth remembering. That instinct doesn't turn off because we're live.
                </p>
                <p style={{ color:'var(--fg)', fontWeight:500 }}>
                  I'm not looking for a job. I'm looking for the right mission. I've watched you build for years — I know this is it.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            onClick={() => setExpanded(!expanded)}
            whileHover={{ x:4 }} whileTap={{ scale:0.97 }}
            style={{ marginTop:16, fontFamily:'var(--mono)', fontSize:9, letterSpacing:3, textTransform:'uppercase', color:'rgb(var(--ambient-r),var(--ambient-g),var(--ambient-b))', display:'flex', alignItems:'center', gap:6, cursor:'none', transition:'color 0.6s' }}>
            {expanded ? 'Less' : 'The full story'} <ChevronDown size={12} style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition:'transform 0.3s' }} />
          </motion.button>
        </motion.div>

        {/* Decorative line */}
        <motion.div initial={{ scaleX:0 }} whileInView={{ scaleX:1 }} viewport={{ once:true }} transition={{ duration:1.4, ease:[0.16,1,0.3,1] }}
          style={{ height:1, transformOrigin:'left', background:'linear-gradient(90deg, rgb(var(--ambient-r),var(--ambient-g),var(--ambient-b)), transparent)', marginTop:32, transition:'background 0.6s' }} />
      </div>
    </section>
  );
}

/* ═══ WRITING — Femme Fatale cinematic feature + compact grid ═══ */
const OTHER_WRITING = [
  { type: 'Production Book', title: 'Studio Music Video', sub: 'Frank Ocean "Chanel"', did: '174wk77-9dBwOoJlMvROLpIsnf-kByrC6' },
  { type: 'Doc One Sheet', title: 'The Audio Blueprint', sub: 'Sound design doc', did: '1UvAxDRvO_6MvAAlUEFzVVTkou1ZNoxY-' },
  { type: 'PSA Script', title: 'A Stage for Every Story', sub: 'The Grand Theatre', did: '1JQpQAEyNJmQlRnt2FVXDvjIZRaN_hNWf' },
  { type: 'Short Film Script', title: 'The Briefcase', sub: 'Crime thriller', did: '1ht--f7NM3X5LVPyaoA0uxoTlnAlZTMHJ' },
];

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
              Political Noir · Limited Series
            </p>

            <div style={{
              fontFamily:'var(--serif)', fontSize:'clamp(0.9rem,2.5vw,1.05rem)', lineHeight:1.82,
              fontStyle:'italic', color:'var(--fg-muted)',
              borderLeft:'2px solid rgb(var(--ambient-r),var(--ambient-g),var(--ambient-b))',
              paddingLeft:20, maxWidth:600, transition:'border-color 0.6s',
            }}>
              A deconstruction of narrative control set between Port-au-Prince in 1957 and a Parisian television studio. <span style={{ color:'var(--fg)' }}>Femme Fatale</span> follows Iris Beaumont — a woman who survives not with weapons, but with the stories she chooses to tell.
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
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:10 }}>
          {OTHER_WRITING.map((w, i) => (
            <motion.a key={i} href={`https://drive.google.com/file/d/${w.did}/view`} target="_blank" rel="noopener noreferrer"
              className="card" initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              transition={{ delay:i*0.06, duration:0.5 }} whileHover={{ y:-4, transition:{ duration:0.25 } }}
              style={{ textDecoration:'none', display:'flex', flexDirection:'column', justifyContent:'space-between', padding:'20px 18px', minHeight:110, cursor:'none' }}>
              <div>
                <span className="pill" style={{ fontSize:7 }}>{w.type}</span>
                <h4 style={{ fontFamily:'var(--display)', fontSize:'1.2rem', letterSpacing:2, marginTop:10 }}>{w.title}</h4>
                <p style={{ fontFamily:'var(--mono)', fontSize:9, color:'var(--fg-subtle)', marginTop:4, letterSpacing:1 }}>{w.sub}</p>
              </div>
              <span style={{ display:'inline-flex', alignItems:'center', gap:4, marginTop:12, fontSize:8, letterSpacing:3, fontFamily:'var(--mono)', color:'var(--fg-subtle)', textTransform:'uppercase' }}>
                READ <ChevronRight size={10} />
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══ CONTACT ═══ */
const CONTACT_LINKS = [
  { label:'Email Me',             href:'mailto:peterolowude@icloud.com',                                                      icon:<Mail size={15} />,           primary: true },
  { label:'X / Twitter',          href:'https://x.com/lonerfss',                                                              icon:<Twitter size={15} /> },
  { label:'Instagram',            href:'https://www.instagram.com/lonerkid',                                                   icon:<Instagram size={15} /> },
  { label:'Twitch',               href:'https://www.twitch.tv/lonerfs',                                                       icon:<Tv size={15} /> },
  { label:'Full Drive Portfolio',  href:'https://drive.google.com/drive/folders/10kpdBuTKIWpCrARqTNSCW3OtyWzQnAg0',           icon:<ExternalLink size={15} /> },
];

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
    <section id="contact" className="section" style={{ textAlign:'center', overflow:'visible', paddingTop:80 }}>
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', background:'radial-gradient(ellipse at 50% 50%, rgba(var(--ambient-r),var(--ambient-g),var(--ambient-b),0.09) 0%, transparent 55%)', transition:'background 0.6s' }} />
      <div style={{ position:'relative', zIndex:2 }}>
        <motion.div initial={{ opacity:0, scale:0.9, filter:'blur(10px)' }} whileInView={{ opacity:1, scale:1, filter:'blur(0px)' }}
          viewport={{ once:true }} transition={{ duration:1, ease:[0.16,1,0.3,1] }}
          style={{ fontFamily:'var(--display)', fontSize:'clamp(4rem,18vw,12rem)', lineHeight:0.84, letterSpacing:-3 }}>
          I'M<br />
          <span style={{ color:'rgb(var(--ambient-r),var(--ambient-g),var(--ambient-b))', transition:'color 0.6s' }}>YOUR</span><br />
          GUY
        </motion.div>
        <motion.p initial={{ opacity:0, y:14 }} whileInView={{ opacity:0.4, y:0 }} viewport={{ once:true }} transition={{ delay:0.15, duration:0.6 }}
          style={{ marginTop:24, fontFamily:'var(--serif)', fontSize:'1.05rem', fontStyle:'italic', color:'var(--fg-muted)', maxWidth:340, margin:'24px auto 0', lineHeight:1.7 }}>
          DM me directly. Let's get to work.
        </motion.p>
        <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:0.2, duration:0.7 }}
          style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12, marginTop:36 }}>
          {CONTACT_LINKS.map((l,i) => (
            <motion.div key={i} initial={{ opacity:0, y:15 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:0.3+i*0.1 }}
              style={{ width:'100%', display:'flex', justifyContent:'center' }}>
              <MagBtn {...l} />
            </motion.div>
          ))}
        </motion.div>
        <motion.p initial={{ opacity:0 }} whileInView={{ opacity:0.3 }} viewport={{ once:true }} transition={{ delay:0.7 }}
          style={{ marginTop:40, fontFamily:'var(--mono)', fontSize:9, letterSpacing:3, textTransform:'uppercase', lineHeight:2.2 }}>
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
        <PitchStrip />

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
          © 2026 Peter Olowude · Misfits Cavern Productions
        </footer>

        <VideoOverlay video={activeVideo} dominantColor={activeVideoColor} onClose={handleVideoClose} />
      </div>
    </>
  );
}
