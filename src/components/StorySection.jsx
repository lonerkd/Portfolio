import React from 'react';
import { motion } from 'framer-motion';

/* ══════════════════════════════════════
   StorySection
   Progressive reveal narrative
   ══════════════════════════════════════ */

const PARAGRAPHS = [
  "It began a couple months before I dropped out of film school.",
  { text: "At 19, I was overwhelmed and realizing that the institution was a structure I no longer needed to validate my vision. I didn't drop out because it was too hard — I dropped out to prove this wasn't just a degree for me.", highlight: "It was my vocation." },
  "From a family of Yale and Columbia grads, multinational business owners — my path was set. Business, law, or medicine. When I chose to chase a camera instead of a courtroom, the disappointment was palpable. But I embraced it.",
  { text: "I've spent years in the dark writing scripts like", accent: "Femme Fatale", after: "— a 133-page screenplay submitted to A24 and Proximity Media. I've shot music videos, directed live multi-cam shows, built news packages, created documentaries. I've done every job on set because I wanted to understand the whole machine, not just one gear." },
  { text: "", highlight: "I believe in the vision being built here. I have the work to show I can do it, and the dedication to ensure it's done right." },
];

export default function StorySection() {
  return (
    <section id="story" className="section" style={{ overflow: 'visible' }}>
      <div className="section__inner" style={{ maxWidth: 780 }}>
        {/* Section indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{
            display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48,
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 40 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ height: 1, background: 'var(--ambient)', transition: 'background 0.6s' }}
          />
          <span style={{
            fontSize: 9, letterSpacing: 5, textTransform: 'uppercase',
            color: 'var(--ambient)', fontFamily: 'var(--mono)',
            transition: 'color 0.6s',
          }}>
            The Narrative
          </span>
        </motion.div>

        {/* Paragraphs with progressive reveal */}
        <div style={{
          fontFamily: 'var(--serif)',
          fontSize: 'clamp(1.1rem, 3vw, 1.3rem)',
          lineHeight: 1.85,
          color: 'var(--fg-muted)',
        }}>
          {PARAGRAPHS.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{
                duration: 0.9,
                delay: i * 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{ marginBottom: 36 }}
            >
              {typeof p === 'string' ? (
                <p>{p}</p>
              ) : (
                <p>
                  {p.text}
                  {p.accent && (
                    <span style={{
                      color: 'var(--ambient)',
                      fontStyle: 'italic',
                      fontWeight: 600,
                      transition: 'color 0.6s',
                    }}>
                      {' '}{p.accent}{' '}
                    </span>
                  )}
                  {p.after}
                  {p.highlight && (
                    <span style={{
                      color: 'var(--fg)',
                      fontWeight: 500,
                      display: p.text ? 'inline' : 'block',
                    }}>
                      {p.text ? ' ' : ''}{p.highlight}
                    </span>
                  )}
                </p>
              )}
            </motion.div>
          ))}
        </div>

        {/* Decorative pull-quote line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(var(--ambient-r), var(--ambient-g), var(--ambient-b), 0.15), transparent)',
            marginTop: 20,
            transformOrigin: 'left',
          }}
        />
      </div>
    </section>
  );
}
