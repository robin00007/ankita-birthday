'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { SiteConfig } from '@/lib/config';

interface Props { config: SiteConfig; }

export default function Finale({ config }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [firing, setFiring]   = useState(false);
  const fwRef     = useRef<boolean>(false);

  const launchFireworks = () => {
    if (firing) return;
    setFiring(true);
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext('2d')!;
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const COLORS = ['#ff6b9d','#ffd700','#7c4dff','#fff','#4a7fe0','#ff8c00','#b388ff'];
    const particles: { x:number;y:number;vx:number;vy:number;color:string;alpha:number;size:number;trail:{x:number;y:number;a:number}[];gravity:number }[] = [];

    const explode = (x: number, y: number) => {
      const count = Math.floor(Math.random()*60)+80;
      for (let i=0;i<count;i++) {
        const angle=(Math.PI*2*i)/count+Math.random()*0.3;
        const speed=Math.random()*6+2;
        particles.push({ x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,color:COLORS[Math.floor(Math.random()*COLORS.length)],alpha:1,size:Math.random()*3+1.5,trail:[],gravity:0.08 });
      }
    };

    fwRef.current = true;
    let lastBurst = 0;
    const loop = (t: number) => {
      if (!fwRef.current) return;
      ctx.fillStyle='rgba(2,5,15,0.2)'; ctx.fillRect(0,0,canvas.width,canvas.height);
      if (t-lastBurst>500) { explode(Math.random()*canvas.width*0.7+canvas.width*0.15, Math.random()*canvas.height*0.5+40); lastBurst=t; }
      for (let i=particles.length-1;i>=0;i--) {
        const p=particles[i];
        p.trail.push({x:p.x,y:p.y,a:p.alpha});
        if (p.trail.length>8) p.trail.shift();
        p.trail.forEach((tr,ti) => { ctx.beginPath(); ctx.arc(tr.x,tr.y,p.size*0.5,0,Math.PI*2); ctx.fillStyle=p.color; ctx.globalAlpha=tr.a*(ti/p.trail.length)*0.4; ctx.fill(); });
        p.x+=p.vx; p.y+=p.vy; p.vy+=p.gravity; p.alpha-=0.014;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.size,0,Math.PI*2); ctx.fillStyle=p.color; ctx.globalAlpha=p.alpha; ctx.fill(); ctx.globalAlpha=1;
        if (p.alpha<=0) particles.splice(i,1);
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

    setTimeout(() => {
      fwRef.current = false;
      ctx.clearRect(0,0,canvas.width,canvas.height);
      setFiring(false);
    }, 8000);
  };

  return (
    <section id="s-finale" className="section sec-finale">
      <canvas ref={canvasRef} style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} />
      <div className="finale-stars-bg" />
      <div className="sec-inner finale-inner">
        <motion.div className="finale-ornament" initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}}>★  ★  ★</motion.div>
        <motion.h1 className="finale-h1" initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.9,delay:0.1}}>
          Happy Birthday
        </motion.h1>
        <motion.h2 className="finale-h2" initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.9,delay:0.2}}>
          {config.recipient.name}
        </motion.h2>
        <motion.p className="finale-msg" initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.9,delay:0.3}}>
          {config.finale.message.split('\n').map((line,i) => (
            <span key={i}>{line}{i<2&&<br/>}</span>
          ))}
        </motion.p>
        <motion.p className="finale-from" initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.9,delay:0.4}}>
          {config.finale.from}
        </motion.p>
        <motion.button
          className="fw-btn"
          onClick={launchFireworks}
          disabled={firing}
          initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.9,delay:0.5}}
        >
          {firing ? '🎆 Launching...' : '🎆 Launch Fireworks'}
        </motion.button>
      </div>
    </section>
  );
}
