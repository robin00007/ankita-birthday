'use client';

import { motion } from 'framer-motion';
import type { SiteConfig } from '@/lib/config';

interface Props { config: SiteConfig; }

export default function Timeline({ config }: Props) {
  return (
    <section id="s-timeline" className="section sec-timeline">
      <div className="sec-inner">
        <motion.h2 className="section-title" initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.9}}>
          Our Story
        </motion.h2>
        <motion.p className="section-sub" initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.9,delay:0.1}}>
          The journey that brought us here
        </motion.p>
        <div className="timeline">
          {config.timeline.map((ev, i) => (
            <motion.div
              key={i}
              className={`tl-item tl-${ev.side}`}
              initial={{ opacity: 0, x: ev.side === 'left' ? -60 : 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <div className="tl-content">
                <div className="tl-tag">{ev.tag}</div>
                <h3 className="tl-title">{ev.title}</h3>
                <p className="tl-text">{ev.text}</p>
              </div>
              <div className="tl-dot">{ev.dot}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
