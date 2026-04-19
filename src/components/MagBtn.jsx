import React, { useRef } from 'react';
import { motion } from 'framer-motion';

export default function MagBtn({ href, icon, label, primary }) {
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