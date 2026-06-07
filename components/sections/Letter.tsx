'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import type { SiteConfig } from '@/lib/config';

interface Props { config: SiteConfig; }

export default function Letter({ config }: Props) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const letterRef  = useRef<HTMLDivElement>(null);
  const isInView   = useInView(letterRef, { once: true, margin: '-20%' });
  const [lines, setLines] = useState<string[]>(config.letter.paragraphs.map(() => ''));
  const typed = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);
    const petals: { x:number;y:number;vy:number;vx:number;size:number;alpha:number;rot:number;rotV:number }[] = [];
    const iv = setInterval(() => {
      petals.push({ x:Math.random()*canvas.width, y:-20, vy:Math.random()*0.8+0.4, vx:(Math.random()-0.5)*0.6, size:Math.random()*16+8, alpha:0.5+Math.random()*0.4, rot:Math.random()*Math.PI*2, rotV:(Math.random()-0.5)*0.03 });
      if (petals.length>30) petals.shift();
    }, 400);
    let raf: number;
    const draw = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      petals.forEach(p => {
        p.x+=p.vx; p.y+=p.vy; p.rot+=p.rotV;
        ctx.save(); ctx.globalAlpha=p.alpha; ctx.translate(p.x,p.y); ctx.rotate(p.rot);
        ctx.font=`${p.size}px serif`; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText('🌸',0,0); ctx.restore();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); clearInterval(iv); window.removeEventListener('resize', resize); };
  }, []);

  useEffect(() => {
    if (!isInView || typed.current) return;
    typed.current = true;
    const paragraphs = config.letter.paragraphs;

    const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

    const typeAll = async () => {
      await sleep(600);
      for (let idx = 0; idx < paragraphs.length; idx++) {
        const text = paragraphs[idx];
        await new Promise<void>(resolve => {
          let i = 0;
          const iv = setInterval(() => {
            if (i < text.length) {
              i++;
              setLines(prev => { const n = [...prev]; n[idx] = text.slice(0, i); return n; });
            } else {
              clearInterval(iv);
              resolve();
            }
          }, 8);
        });
        await sleep(180);
      }
    };

    typeAll();
  }, [isInView, config.letter.paragraphs]);

  return (
    <section id="s-letter" className="section sec-letter">
      <canvas ref={canvasRef} style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} />
      <div className="sec-inner">
        <motion.div
          ref={letterRef}
          className="letter-wrapper"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <div className="letter-seal"><span className="seal-heart">♥</span></div>
          <div className="letter-paper">
            <div className="letter-lines-bg" />
            <div className="letter-top-row"><span className="letter-date">{config.letter.date}</span></div>
            <h3 className="letter-salutation">{config.letter.salutation}</h3>
            <div className="letter-body">
              {config.letter.paragraphs.map((_, i) => (
                <p key={i} className="lp">{lines[i]}</p>
              ))}
            </div>
            <div className="letter-signature">
              With all my love,<br />
              <span className="sig-name">{config.sender.name} ♥</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
