'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { SiteConfig, Reason } from '@/lib/config';
import { assetPath } from '@/lib/assetPath';

const ROTATIONS = [-4, 3, -2, 5, -3, 2, -4, 3.5, -1.5, 4, -2.5, 1];

const REASON_PHOTOS: (string | null)[] = [
  '/reasons/img_246c.jpg',
  '/reasons/img_0154.jpg',
  '/reasons/img_0350.png',
  '/reasons/img_0666.png',
  '/reasons/img_0809.png',
  '/reasons/img_0999.jpg',
  '/reasons/img_1259.png',
  '/reasons/img_6320.png',
  '/reasons/img_7617.png',
  '/reasons/img_7965.jpg',
  '/reasons/img_8635.jpg',
  null,
].map(p => p ? assetPath(p) : null);

interface Props { config: SiteConfig; }

export default function Reasons({ config }: Props) {
  const [revealedSet, setRevealedSet] = useState<Set<number>>(new Set());

  const markRevealed = (i: number) => {
    setRevealedSet(prev => {
      const next = new Set(prev);
      next.add(i);
      if (next.size === config.reasons.length) setTimeout(celebrateAll, 400);
      return next;
    });
  };

  const count = revealedSet.size;
  const pct   = Math.round((count / config.reasons.length) * 100);

  return (
    <section id="s-reasons" className="section sec-reasons">
      <div className="sec-inner">
        <motion.h2 className="section-title" initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.9}}>
          Why I Love You
        </motion.h2>
        <motion.p className="section-sub" initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.9,delay:0.1}}>
          Hover each card — discover a reason ✨
        </motion.p>

        <div className="reasons-grid">
          {config.reasons.map((reason, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.07, ease: [0.34,1.56,0.64,1] }}
            >
              <ReasonCard
                reason={reason}
                index={i}
                rotation={ROTATIONS[i]}
                photo={REASON_PHOTOS[i] ?? null}
                onReveal={() => markRevealed(i)}
              />
            </motion.div>
          ))}
        </div>

        {/* Progress bar */}
        <motion.div className="reasons-progress" initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.9,delay:0.3}}>
          <span className="rp-label">♥ {count} / {config.reasons.length} reasons revealed</span>
          <div className="rp-bar-track">
            <div className="rp-bar-fill" style={{ width: pct + '%' }} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

interface CardProps { reason: Reason; index: number; rotation: number; photo: string | null; onReveal: () => void; }

function ReasonCard({ reason, index, rotation, photo, onReveal }: CardProps) {
  const [flipped, setFlipped] = useState(false);

  const flip = (val: boolean) => {
    setFlipped(val);
    if (val) onReveal();
  };

  return (
    <div
      className="reason-polaroid-wrap"
      onMouseEnter={() => flip(true)}
      onMouseLeave={() => flip(false)}
      onTouchStart={() => { flip(!flipped); }}
    >
      <motion.div
        className="reason-polaroid"
        data-idx={String(index)}
        style={{ transformStyle: 'preserve-3d' }}
        animate={{
          rotateY:    flipped ? 180 : 0,
          rotate:     flipped ? 0   : rotation,
          y:          flipped ? -12 : 0,
          scale:      flipped ? 1.08 : 1,
        }}
        transition={{ duration: 0.65, ease: [0.34, 1.10, 0.64, 1] }}
      >
        {/* ── FRONT — polaroid with photo ── */}
        <div className="rp-face rp-front">
          <div className="rp-photo">
            {photo ? (
              <img src={photo} alt="" className="rp-photo-img" />
            ) : (
              <div className="rp-photo-inner" data-idx={String(index)}>
                <span className="rp-seal">{String(index + 1).padStart(2, '0')}</span>
                <span className="rp-icon">{reason.icon}</span>
              </div>
            )}
          </div>
          <div className="rp-caption">Hover to reveal ♥</div>
        </div>

        {/* ── BACK — polaroid with reason text ── */}
        <div className="rp-face rp-back">
          <div className="rp-photo">
            <div className="rp-back-photo">
              <span className="rp-quote">❝</span>
              <p className="rp-reason-text">{reason.text}</p>
              <span className="rp-heart">♥</span>
            </div>
          </div>
          <div className="rp-caption rp-back-caption">Reason {String(index + 1).padStart(2, '0')}</div>
        </div>
      </motion.div>
    </div>
  );
}

function celebrateAll() {
  const container = document.getElementById('easter-hearts');
  if (!container) return;
  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      const el = document.createElement('span');
      el.className = 'eh';
      el.textContent = ['❤️','💜','✨','💕','🌸','💫'][Math.floor(Math.random()*6)];
      el.style.left  = (Math.random()*80+10)+'vw';
      el.style.top   = (Math.random()*60+20)+'vh';
      el.style.animationDelay = (Math.random()*0.6)+'s';
      el.style.fontSize = (Math.random()*20+14)+'px';
      container.appendChild(el);
      setTimeout(() => el.remove(), 1800);
    }, i * 60);
  }
}
