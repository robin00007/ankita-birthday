'use client';

import { motion } from 'framer-motion';
import type { SiteConfig } from '@/lib/config';
import { assetPath } from '@/lib/assetPath';

const ROTATIONS = [-4, 3, -2, 5, -3, 2];

const PHOTO_MAP: string[] = [
  '/moments/us.jpg',
  '/moments/yourWorldUpHigh.jpg',
  '/moments/myStart.jpg',
  '/moments/goldenHour.jpg',
  '/moments/forever.jpg',
  '/moments/gettingBetterWithTime.jpg',
].map(assetPath);

interface Props { config: SiteConfig; }

export default function Gallery({ config }: Props) {
  return (
    <section id="s-gallery" className="section sec-gallery">
      <div className="sec-inner">
        <motion.h2 className="section-title" initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.9}}>
          Our Moments
        </motion.h2>
        <motion.p className="section-sub" initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.9,delay:0.1}}>
          Every memory a treasure, every photo pure gold
        </motion.p>
        <div className="collage-grid">
          {config.gallery.map((item, i) => (
            <motion.div
              key={i}
              className={`polaroid collage-item-${i}`}
              style={{ transform: `rotate(${ROTATIONS[i]}deg)` }}
              initial={{ opacity: 0, y: 60, scale: 0.92 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.34,1.56,0.64,1] }}
            >
              <div className="polaroid-img">
                <img src={PHOTO_MAP[i]} alt={item.caption} className="polaroid-photo" />
              </div>
              <div className="polaroid-caption">{item.caption}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
