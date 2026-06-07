'use client';

import { useEffect, useState } from 'react';

const SECTIONS = [
  { id: 's-countdown', tip: 'Countdown' },
  { id: 's-gallery',   tip: 'Memories' },
  { id: 's-letter',    tip: 'Love Letter' },
  { id: 's-reasons',   tip: 'Why I Love You' },
  { id: 's-timeline',  tip: 'Our Story' },
  { id: 's-messages',  tip: 'Video Messages' },
  { id: 's-finale',    tip: 'Finale' },
];

export default function SideNav() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const observers = SECTIONS.map((s, i) => {
      const el = document.getElementById(s.id);
      if (!el) return null;
      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) setActive(i);
      }, { threshold: 0.5 });
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach(o => o?.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav className="side-nav">
      {SECTIONS.map((s, i) => (
        <button
          key={s.id}
          className={`snav-dot${i === active ? ' active' : ''}`}
          data-tip={s.tip}
          onClick={() => scrollTo(s.id)}
          aria-label={s.tip}
        />
      ))}
    </nav>
  );
}
