'use client';

import { useState, useEffect, useRef } from 'react';
import type { SiteConfig } from '@/lib/config';
import { resolveConfig } from '@/lib/config';
import Cursor from './Cursor';
import BoardingGate from './BoardingGate';
import SideNav from './SideNav';
import Countdown from './sections/Countdown';
import Gallery from './sections/Gallery';
import Letter from './sections/Letter';
import Reasons from './sections/Reasons';
import Timeline from './sections/Timeline';
import VideoMessages from './sections/VideoMessages';
import Finale from './sections/Finale';

interface Props { config: SiteConfig; }

export default function BirthdayApp({ config: initialConfig }: Props) {
  // Decode ?data= query param on the client (works with static export)
  const [config, setConfig] = useState<SiteConfig>(initialConfig);
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const data   = params.get('data');
      if (data) setConfig(resolveConfig(data));
    } catch { /* use defaults */ }
  }, []);

  const [showGate, setShowGate] = useState(true);
  const particlesRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (showGate) return;
    const canvas = particlesRef.current;
    if (!canvas) return;
    canvas.classList.add('active');
    const ctx = canvas.getContext('2d')!;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const pts: { x:number; y:number; vy:number; vx:number; size:number; alpha:number; sym:string; rot:number; rotV:number }[] = [];
    const iv = setInterval(() => {
      pts.push({ x: Math.random()*canvas.width, y: canvas.height+10, vy:-(Math.random()*0.5+0.2), vx:(Math.random()-0.5)*0.2, size:Math.random()*12+6, alpha:0.15+Math.random()*0.2, sym:Math.random()>0.5?'♥':'✦', rot:0, rotV:(Math.random()-0.5)*0.01 });
      if (pts.length>40) pts.shift();
    }, 600);

    let rafId: number;
    const draw = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      for (let i=pts.length-1;i>=0;i--) {
        const p=pts[i]; p.x+=p.vx; p.y+=p.vy; p.rot+=p.rotV;
        ctx.save(); ctx.globalAlpha=p.alpha; ctx.translate(p.x,p.y); ctx.rotate(p.rot);
        ctx.font=`${p.size}px serif`; ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.fillStyle=`rgba(255,107,157,${p.alpha})`; ctx.fillText(p.sym,0,0); ctx.restore();
      }
      rafId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(rafId); clearInterval(iv); window.removeEventListener('resize', resize); };
  }, [showGate]);

  const easterBuf = useRef('');
  useEffect(() => {
    const eggWord = config.recipient.name.toLowerCase();
    const handler = (e: KeyboardEvent) => {
      easterBuf.current += e.key.toLowerCase();
      if (easterBuf.current.length > eggWord.length + 2) easterBuf.current = easterBuf.current.slice(-(eggWord.length + 2));
      if (easterBuf.current.includes(eggWord)) { easterBuf.current = ''; burstHearts(); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [config.recipient.name]);

  return (
    <>
      <Cursor />
      <canvas ref={particlesRef} className="particles-canvas" />
      <div id="easter-hearts" className="easter-hearts" />

      {showGate && <BoardingGate config={config} onBoard={() => setShowGate(false)} />}

      {!showGate && (
        <main id="main-site">
          <SideNav />
          <Countdown config={config} />
          <Gallery config={config} />
          <Letter config={config} />
          <Reasons config={config} />
          <VideoMessages config={config} />
          <Finale config={config} />
        </main>
      )}
    </>
  );
}

function burstHearts() {
  const container = document.getElementById('easter-hearts');
  if (!container) return;
  for (let i = 0; i < 30; i++) {
    const h = document.createElement('span');
    h.className = 'eh';
    h.textContent = ['❤️','💜','💕','🌸','✨'][Math.floor(Math.random()*5)];
    h.style.left  = Math.random()*100+'vw';
    h.style.top   = Math.random()*100+'vh';
    h.style.animationDelay = Math.random()*0.5+'s';
    h.style.fontSize = (Math.random()*24+16)+'px';
    container.appendChild(h);
    setTimeout(() => h.remove(), 1500);
  }
}
