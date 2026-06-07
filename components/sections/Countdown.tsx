'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { SiteConfig } from '@/lib/config';

interface Props { config: SiteConfig; }

function useCountdown(birthday: string) {
  const calc = () => {
    const diff = new Date(birthday + 'T00:00:00').getTime() - Date.now();
    if (diff <= 0) return { d:'00', h:'00', m:'00', s:'00' };
    return {
      d: String(Math.floor(diff/86400000)).padStart(2,'0'),
      h: String(Math.floor((diff%86400000)/3600000)).padStart(2,'0'),
      m: String(Math.floor((diff%3600000)/60000)).padStart(2,'0'),
      s: String(Math.floor((diff%60000)/1000)).padStart(2,'0'),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const iv = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(iv);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [birthday]);
  return time;
}

export default function Countdown({ config }: Props) {
  const { recipient, birthday } = config;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const time = useCountdown(birthday);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);
    const EMOJIS = ['❤','✨','💜','⭐','💫'];
    const pts: { x:number;y:number;vy:number;vx:number;size:number;alpha:number;emoji:string;rot:number;rotV:number }[] = [];
    let spawnTimer = 0;
    const spawnP = () => pts.push({ x:Math.random()*canvas.width, y:canvas.height+20, vy:-(Math.random()*0.8+0.3), vx:(Math.random()-0.5)*0.4, size:Math.random()*18+10, alpha:0.6+Math.random()*0.4, emoji:EMOJIS[Math.floor(Math.random()*EMOJIS.length)], rot:Math.random()*Math.PI*2, rotV:(Math.random()-0.5)*0.02 });
    let raf: number;
    const draw = (t: number) => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      if (t-spawnTimer>300) { spawnP(); spawnTimer=t; }
      for (let i=pts.length-1;i>=0;i--) {
        const p=pts[i]; p.x+=p.vx; p.y+=p.vy; p.rot+=p.rotV; p.alpha-=0.0012;
        if (p.y<-40||p.alpha<=0) { pts.splice(i,1); continue; }
        ctx.save(); ctx.globalAlpha=p.alpha; ctx.translate(p.x,p.y); ctx.rotate(p.rot);
        ctx.font=`${p.size}px serif`; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(p.emoji,0,0); ctx.restore();
      }
      raf = requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  const units = [
    { id:'d', label:'days',    val: time.d },
    { id:'h', label:'hours',   val: time.h },
    { id:'m', label:'minutes', val: time.m },
    { id:'s', label:'seconds', val: time.s },
  ];

  return (
    <section id="s-countdown" className="section sec-countdown">
      <canvas ref={canvasRef} style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} />
      <div className="floating-emojis" style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
        {['☁️','☁️','✨','✨','☁️','✨'].map((e,i) => (
          <span key={i} className="fe" style={{ position:'absolute', fontSize:'clamp(1.2rem,3vw,2rem)', opacity:0.25, animation:'floatDrift ease-in-out infinite',
            animationDuration: ['8s','10s','7s','9s','11s','6s'][i], animationDelay: ['-0s','-3s','-1s','-4s','-2s','-5s'][i],
            left: ['8%','80%','15%','75%','50%','40%'][i], top: ['20%','15%','65%','70%','10%','80%'][i] }}>{e}</span>
        ))}
      </div>
      <div className="sec-inner countdown-inner">
        <motion.p className="cd-subtitle" initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.9}}>
          The skies are glowing for
        </motion.p>
        <motion.h1 className="cd-name" initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.9,delay:0.1}}>
          {recipient.name}
        </motion.h1>
        <motion.p className="cd-label" initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.9,delay:0.2}}>
          Birthday Countdown
        </motion.p>
        <motion.div className="cd-timer" initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.9,delay:0.3}}>
          {units.map((u, i) => (
            <>
              {i > 0 && <div className="cd-colon" key={`c${i}`}>:</div>}
              <div key={u.id} className="cd-unit">
                <FlipNum val={u.val} />
                <div className="cd-unit-name">{u.label}</div>
              </div>
            </>
          ))}
        </motion.div>
        <motion.div className="scroll-hint" initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.9,delay:0.4}}>
          <div className="scroll-mouse"><div className="scroll-wheel" /></div>
          <span>Scroll to explore</span>
        </motion.div>
      </div>
    </section>
  );
}

function FlipNum({ val }: { val: string }) {
  const prev = useRef(val);
  const ref  = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (prev.current !== val && ref.current) {
      ref.current.classList.remove('flip');
      void ref.current.offsetWidth;
      ref.current.classList.add('flip');
      prev.current = val;
    }
  }, [val]);
  return <div ref={ref} className="cd-num">{val}</div>;
}
