'use client';

import { useEffect, useRef } from 'react';

export default function Cursor() {
  const curRef   = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cur   = curRef.current!;
    const trail = trailRef.current!;
    let tx = 0, ty = 0, cx = 0, cy = 0;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX; ty = e.clientY;
      cur.style.left = tx + 'px';
      cur.style.top  = ty + 'px';
    };
    document.addEventListener('mousemove', onMove);

    let raf: number;
    const moveTrail = () => {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      trail.style.left = cx + 'px';
      trail.style.top  = cy + 'px';
      raf = requestAnimationFrame(moveTrail);
    };
    moveTrail();

    const grow   = () => { cur.style.width='24px'; cur.style.height='24px'; cur.style.background='var(--gold)'; };
    const shrink = () => { cur.style.width='14px'; cur.style.height='14px'; cur.style.background='var(--rose)'; };

    document.querySelectorAll<HTMLElement>('button, a, .polaroid, .reason-polaroid-wrap, .candle').forEach(el => {
      el.addEventListener('mouseenter', grow);
      el.addEventListener('mouseleave', shrink);
    });

    const obs = new MutationObserver(() => {
      document.querySelectorAll<HTMLElement>('button, a, .polaroid, .reason-polaroid-wrap, .candle').forEach(el => {
        el.addEventListener('mouseenter', grow);
        el.addEventListener('mouseleave', shrink);
      });
    });
    obs.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      obs.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={curRef}   className="cursor" />
      <div ref={trailRef} className="cursor-trail" />
    </>
  );
}
