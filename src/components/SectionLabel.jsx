import React from 'react';
import { motion } from 'framer-motion';

export default function SectionLabel({ text }) {
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