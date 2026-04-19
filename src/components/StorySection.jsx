import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { STORY_PARAGRAPHS, STORY_EXPANDED_PARAGRAPHS } from '../data/content';
import SectionLabel from './SectionLabel';

export default function StorySection() {
  const [expanded, setExpanded] = useState(false);
  return (
    <section id="story" className="section" style={{ paddingTop:60, paddingBottom:60 }}>
      <div className="section__inner" style={{ maxWidth:800 }}>
        <SectionLabel text="The Narrative" />
        <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.8 }}
          style={{ fontFamily:'var(--serif)', fontSize:'clamp(1.1rem,3vw,1.28rem)', lineHeight:1.88, color:'var(--fg-muted)' }}>

          {STORY_PARAGRAPHS.map((p, i) => (
            <motion.p key={i} initial={{ opacity:0, y:20, filter:'blur(4px)' }} whileInView={{ opacity:1, y:0, filter:'blur(0px)' }}
              viewport={{ once:true }} transition={{ duration:0.9, delay:i*0.05, ease:[0.16,1,0.3,1] }}
              style={{ marginBottom:24 }}>
              {p}
            </motion.p>
          ))}

          <AnimatePresence>
            {expanded && (
              <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }} transition={{ duration:0.5, ease:[0.16,1,0.3,1] }}>
                {STORY_EXPANDED_PARAGRAPHS.map((p, i) => (
                  <p key={i} style={{ marginBottom:24 }}>
                    {p}
                  </p>
                ))}
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
