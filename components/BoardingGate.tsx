'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import type { SiteConfig } from '@/lib/config';

interface Props { config: SiteConfig; onBoard: () => void; }

export default function BoardingGate({ config, onBoard }: Props) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const passRef    = useRef<HTMLDivElement>(null);
  const flyRef     = useRef<HTMLDivElement>(null);
  const gateRef    = useRef<HTMLDivElement>(null);
  const [boarding, setBoarding] = useState(false);
  const { recipient, sender, airline, birthday } = config;

  // Barcode SVG
  const barcodeSvg = (() => {
    let svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 40">';
    let x = 0;
    while (x < 100) {
      const w = Math.random() > 0.6 ? 3 : 1.5;
      svg += `<rect x="${x.toFixed(1)}" y="0" width="${w}" height="40" fill="#1a1a2e"/>`;
      x += w + (Math.random() > 0.5 ? 1.5 : 0.8);
    }
    return svg + '</svg>';
  })();

  const birthdayDate = (() => {
    const d = new Date(birthday + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase();
  })();

  // Starfield canvas
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const stars = Array.from({ length: 220 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.3, o: Math.random(),
      d: Math.random() > 0.5 ? 0.008 : -0.008,
    }));
    const shooters: { x:number; y:number; vx:number; vy:number; len:number; alpha:number }[] = [];

    const addShooter = () => {
      shooters.push({ x: Math.random()*canvas.width*0.5, y: Math.random()*canvas.height*0.4, vx: Math.random()*12+6, vy: Math.random()*6+2, len: Math.random()*100+60, alpha: 1 });
      setTimeout(addShooter, Math.random()*3000+2000);
    };
    setTimeout(addShooter, 1500);

    let rafId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        s.o += s.d; if (s.o >= 1 || s.o <= 0) s.d *= -1;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(255,255,255,${s.o})`; ctx.fill();
      });
      for (let i = shooters.length-1; i >= 0; i--) {
        const s = shooters[i];
        const grad = ctx.createLinearGradient(s.x, s.y, s.x-s.len, s.y-s.len*0.3);
        grad.addColorStop(0, `rgba(255,255,220,${s.alpha})`); grad.addColorStop(1, 'rgba(255,255,220,0)');
        ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x-s.len, s.y-s.len*0.3);
        ctx.strokeStyle = grad; ctx.lineWidth = 1.5; ctx.stroke();
        s.x += s.vx; s.y += s.vy; s.alpha -= 0.018;
        if (s.alpha <= 0) shooters.splice(i, 1);
      }
      rafId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(rafId); window.removeEventListener('resize', resize); };
  }, []);

  // Boarding pass 3D tilt
  useEffect(() => {
    const bp = passRef.current; if (!bp) return;
    const onMove = (e: MouseEvent) => {
      const rect = bp.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      gsap.to(bp, { rotateY: x*18, rotateX: -y*12, duration: 0.4, ease: 'power2.out', transformPerspective: 1000 });
    };
    const onLeave = () => gsap.to(bp, { rotateY: 0, rotateX: 0, duration: 0.7, ease: 'elastic.out(1,0.5)' });
    bp.addEventListener('mousemove', onMove);
    bp.addEventListener('mouseleave', onLeave);
    return () => { bp.removeEventListener('mousemove', onMove); bp.removeEventListener('mouseleave', onLeave); };
  }, []);

  const handleBoard = () => {
    if (boarding) return;
    setBoarding(true);
    const bp = passRef.current!;
    const fly = flyRef.current!;
    const gate = gateRef.current!;

    gsap.to(bp, {
      rotateY: 90, scale: 0.8, opacity: 0, duration: 0.5, ease: 'power2.in',
      onComplete: () => {
        gsap.to('.board-btn, .board-hint, .airline-header', { opacity: 0, duration: 0.3 });
        fly.style.display = 'flex';
        gsap.fromTo('.fly-plane',
          { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1 },
          { x: window.innerWidth*0.6, y: -window.innerHeight*0.5, scale: 0.1, rotation: 15, opacity: 0, duration: 1.4, ease: 'power3.in',
            onComplete: () => {
              gsap.to(gate, { opacity: 0, duration: 0.6, onComplete: () => { onBoard(); } });
            }
          }
        );
      }
    });
  };

  return (
    <>
      <div ref={gateRef} className="boarding-gate">
        <canvas ref={canvasRef} className="gate-stars" />
        <div className="clouds-layer">
          <div className="cloud c1" /><div className="cloud c2" />
          <div className="cloud c3" /><div className="cloud c4" />
        </div>
        <div className="gate-content">
          <div className="airline-header" style={{ display:'flex', alignItems:'center', gap:16 }}>
            <div className="airline-logo">
              <span className="logo-plane">✈</span>
              <span className="logo-text">{airline.name} <em>{airline.tagline}</em></span>
            </div>
            <div className="flight-badge">{airline.flightCode}</div>
          </div>

          <div ref={passRef} className="boarding-pass">
            <div className="bp-body">
              <div className="bp-top-row">
                <div className="bp-city-block">
                  <div className="bp-iata">YOU</div>
                  <div className="bp-city-name">My Heart</div>
                </div>
                <div className="bp-mid-path">
                  <div className="bp-path-line" />
                  <div className="bp-path-plane">✈</div>
                  <div className="bp-path-line" />
                </div>
                <div className="bp-city-block right">
                  <div className="bp-iata">{recipient.iataCode}</div>
                  <div className="bp-city-name">{recipient.worldName}</div>
                </div>
              </div>
              <div className="bp-info-row">
                <div className="bp-info-cell"><span className="bp-info-label">DATE</span><span className="bp-info-val">{birthdayDate}</span></div>
                <div className="bp-info-cell"><span className="bp-info-label">CLASS</span><span className="bp-info-val">FIRST LOVE</span></div>
                <div className="bp-info-cell"><span className="bp-info-label">SEAT</span><span className="bp-info-val">∞ FOREVER</span></div>
                <div className="bp-info-cell"><span className="bp-info-label">GATE</span><span className="bp-info-val">♥</span></div>
              </div>
              <div className="bp-passenger-row">
                <span className="bp-info-label">PASSENGER NAME</span>
                <span className="bp-passenger-name">{recipient.name.toUpperCase()}</span>
              </div>
            </div>
            <div className="bp-perforation">
              <div className="perf-notch top" /><div className="perf-line" /><div className="perf-notch bottom" />
            </div>
            <div className="bp-stub">
              <div className="bp-stub-title">BOARDING PASS</div>
              <div className="bp-stub-route"><span>YOU</span><span className="stub-arrow">→</span><span>{recipient.iataCode}</span></div>
              <div className="bp-barcode" dangerouslySetInnerHTML={{ __html: barcodeSvg }} />
              <div className="bp-stub-seat">SEAT ∞</div>
              <div className="bp-stub-name">{recipient.name.toUpperCase()}</div>
            </div>
          </div>

          <button className="board-btn" onClick={handleBoard} disabled={boarding}>
            <span>BOARD NOW</span>
            <span className="board-plane">✈</span>
          </button>
          <p className="board-hint">Click to begin your journey</p>
        </div>
      </div>

      <div ref={flyRef} className="plane-flyaway" style={{ display: 'none' }}>
        <div className="fly-plane">✈</div>
      </div>
    </>
  );
}
