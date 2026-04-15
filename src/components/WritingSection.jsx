import React from 'react';
import { motion, useInView } from 'framer-motion';
import { FileText, ChevronRight } from 'lucide-react';

/* ══════════════════════════════════════
   WritingSection
   Featured screenplay + writing cards
   ══════════════════════════════════════ */

const SectionLabel = ({ text }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div ref={ref} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
      <motion.div
        initial={{ width: 0 }}
        animate={isInView ? { width: 40 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ height: 1, background: 'var(--ambient)', transition: 'background 0.6s' }}
      />
      <motion.span
        initial={{ opacity: 0, x: -10 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{
          fontSize: 9, letterSpacing: 5, textTransform: 'uppercase',
          color: 'var(--ambient)', fontFamily: 'var(--mono)',
          transition: 'color 0.6s',
        }}
      >
        {text}
      </motion.span>
    </div>
  );
};

const SCENE_EXCERPTS = [
  {
    label: 'Opening',
    text: 'A MAKEUP ARTIST works on IRIS BEAUMONT\'s face. Her eyes open. Fixed on the mirror. On the monitor above: a close-up of her own face from a press shoot. She watches herself watching herself.',
  },
  {
    label: 'The Market',
    text: 'Two MEN come through. Civilian clothes. Dark glasses. Machetes at their belts. "Too pretty for this market, little bird." Iris meets his gaze. She doesn\'t give him anything.',
  },
  {
    label: 'The Invitation',
    text: 'A POSTER on the wall. A Black woman in white feathers caught mid-arc — arms wide, face up. LES ÉTOILES DE PARIS. "Auditions tonight. Eight o\'clock. We leave for Paris in two weeks."',
  },
];

const OTHER_WRITING = [
  { type: 'Production Book', title: 'Studio Music Video', excerpt: 'Full production book for a Frank Ocean "Chanel" music video. Shot lists, cam plans, choreography — targeted at the introspective aesthetic Frank Ocean\'s music portrays.', did: '174wk77-9dBwOoJlMvROLpIsnf-kByrC6' },
  { type: 'Documentary One Sheet', title: 'The Audio Blueprint', excerpt: 'A witty 5-minute documentary that dives into the unseen magic of sound design in film, mixing eye-catching visuals with real expert insights to show why audio is the secret sauce behind the most influential movie moments.', did: '1UvAxDRvO_6MvAAlUEFzVVTkou1ZNoxY-' },
  { type: 'PSA Script', title: 'A Stage for Every Story', excerpt: 'For over a century, The Grand Theatre has been more than just a stage… it\'s been the heartbeat of art and creativity in Calgary. A living archive of creativity, built on generations of talent.', did: '1JQpQAEyNJmQlRnt2FVXDvjIZRaN_hNWf' },
  { type: 'Short Film Screenplay', title: 'The Briefcase', excerpt: '"Stop stressing man. We ain\'t gonna mess up." — "No. Cuz you said that last time, and last time it was a shit show. People died." — A confident chuckle. "Heh, ya they did."', did: '1ht--f7NM3X5LVPyaoA0uxoTlnAlZTMHJ' },
];

export default function WritingSection() {
  return (
    <section id="writing" className="section">
      <div className="section__inner">
        <SectionLabel text="The Writing" />

        {/* FEMME FATALE — featured */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="card"
          style={{
            padding: 'clamp(24px, 4vw, 40px)',
            marginBottom: 16,
            position: 'relative',
          }}
        >
          {/* Ambient glow */}
          <div style={{
            position: 'absolute', top: -50, right: -50,
            width: 300, height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(var(--ambient-r), var(--ambient-g), var(--ambient-b), 0.06) 0%, transparent 60%)',
            pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <span className="pill pill--accent" style={{ fontSize: 8 }}>
              Screenplay · Draft 9 · 133 Pages
            </span>

            <h3 style={{
              fontFamily: 'var(--display)',
              fontSize: 'clamp(2rem, 6vw, 3rem)',
              letterSpacing: 2,
              marginTop: 12,
            }}>
              Femme Fatale
            </h3>

            <p style={{
              fontSize: 10, letterSpacing: 2,
              color: 'var(--fg-subtle)',
              marginTop: 4,
              textTransform: 'uppercase',
              fontFamily: 'var(--mono)',
            }}>
              Noir Thriller · Feature Film
            </p>

            {/* Logline */}
            <div style={{
              fontFamily: 'var(--serif)',
              fontSize: 'clamp(0.9rem, 2.5vw, 1.05rem)',
              lineHeight: 1.8,
              fontStyle: 'italic',
              color: 'var(--fg-muted)',
              borderLeft: '2px solid var(--ambient)',
              paddingLeft: 20,
              marginTop: 28,
              transition: 'border-color 0.6s',
            }}>
              A deconstruction of narrative control and the fabrication of reality.
              Set between Port-au-Prince in 1957 and 1960s Paris,{' '}
              <span style={{ color: 'var(--fg)' }}>Femme Fatale</span> follows
              Iris Beaumont — a woman who survives not with weapons, but with the
              stories she chooses to tell.
            </div>

            {/* Scene Excerpts */}
            <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {SCENE_EXCERPTS.map((ex, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    padding: '16px 18px',
                    borderLeft: '2px solid rgba(var(--ambient-r), var(--ambient-g), var(--ambient-b), 0.15)',
                    borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                  }}
                >
                  <span style={{
                    fontSize: 7, letterSpacing: 4, textTransform: 'uppercase',
                    color: 'var(--ambient)', display: 'block', marginBottom: 8,
                    fontFamily: 'var(--mono)',
                    transition: 'color 0.6s',
                  }}>
                    {ex.label}
                  </span>
                  <p style={{
                    fontFamily: 'var(--serif)',
                    fontSize: 13, lineHeight: 1.7,
                    color: 'rgba(255,255,255,0.38)',
                    fontStyle: 'italic',
                  }}>
                    &quot;{ex.text}&quot;
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.a
              href="https://drive.google.com/file/d/1cIynCQgJtWfLRpb5xZzgQw0rHMKauSO9/view"
              target="_blank"
              rel="noopener noreferrer"
              className="magnetic-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                marginTop: 28,
                display: 'inline-flex',
                textDecoration: 'none',
              }}
            >
              <FileText size={13} /> Read Full Script
            </motion.a>
          </div>
        </motion.div>

        {/* Other Writing */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 12,
        }}>
          {OTHER_WRITING.map((w, i) => (
            <motion.a
              key={i}
              href={`https://drive.google.com/file/d/${w.did}/view`}
              target="_blank"
              rel="noopener noreferrer"
              className="card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              whileHover={{ y: -4 }}
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'block',
                padding: '24px 20px',
              }}
            >
              <span className="pill pill--accent" style={{ fontSize: 7 }}>
                {w.type}
              </span>

              <h4 style={{
                fontFamily: 'var(--display)',
                fontSize: '1.2rem',
                letterSpacing: 2,
                marginTop: 10,
              }}>
                {w.title}
              </h4>

              <p style={{
                fontFamily: 'var(--serif)',
                fontSize: 13,
                lineHeight: 1.65,
                color: 'rgba(255,255,255,0.33)',
                fontStyle: 'italic',
                marginTop: 10,
              }}>
                &quot;{w.excerpt}&quot;
              </p>

              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                marginTop: 14,
                fontSize: 8,
                letterSpacing: 3,
                fontFamily: 'var(--mono)',
                color: 'var(--fg-subtle)',
                textTransform: 'uppercase',
              }}>
                READ <ChevronRight size={10} />
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
