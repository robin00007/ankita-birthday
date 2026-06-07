'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { SiteConfig, VideoMessage } from '@/lib/config';

interface Props { config: SiteConfig; }

/* ── Unique accent color per card ── */
const CARD_ACCENTS = [
  { border: '#ff6b9d', glow: 'rgba(255,107,157,0.45)', grad: 'linear-gradient(145deg,#400010,#a01030,#e84060)', label: '#ff6b9d' },
  { border: '#7c4dff', glow: 'rgba(124,77,255,0.45)',  grad: 'linear-gradient(145deg,#1a0a3e,#4a1880,#9b59b6)', label: '#b388ff' },
  { border: '#00b8b8', glow: 'rgba(0,184,184,0.45)',   grad: 'linear-gradient(145deg,#002828,#006060,#00b8b8)', label: '#5dfafa' },
  { border: '#ffd700', glow: 'rgba(255,215,0,0.45)',   grad: 'linear-gradient(145deg,#2a1400,#6a3800,#c87820)', label: '#ffd700' },
  { border: '#4a7fe0', glow: 'rgba(74,127,224,0.45)',  grad: 'linear-gradient(145deg,#001040,#002080,#2050d8)', label: '#7ab4ff' },
  { border: '#00a060', glow: 'rgba(0,160,96,0.45)',    grad: 'linear-gradient(145deg,#001a10,#004830,#00a060)', label: '#5dffc8' },
  { border: '#ff8c00', glow: 'rgba(255,140,0,0.45)',   grad: 'linear-gradient(145deg,#300a00,#802000,#e05000)', label: '#ffb566' },
  { border: '#c040c0', glow: 'rgba(192,64,192,0.45)',  grad: 'linear-gradient(145deg,#200028,#600060,#a040a0)', label: '#e888e8' },
];

const ROTATIONS = [-3, 2.5, -1.5, 3.5, -2, 2, -3.5, 1.5];

/* ── Helpers ── */
function getYoutubeId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|v=|\/embed\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}
function getEmbedUrl(url: string): string {
  const id = getYoutubeId(url);
  if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
  // Direct video file
  return url;
}
function getThumbnailUrl(url: string): string | null {
  const id = getYoutubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}
function isDirectVideo(url: string): boolean {
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
}

/* ── Film perforation strip ── */
function FilmEdge() {
  return (
    <div className="vm-film-edge">
      {Array(10).fill(0).map((_, i) => <span key={i} className="vm-perf-hole" />)}
    </div>
  );
}

/* ── Play button ── */
function PlayBtn({ accent }: { accent: typeof CARD_ACCENTS[0] }) {
  return (
    <div className="vm-play-btn" style={{ '--accent': accent.border, '--glow': accent.glow } as React.CSSProperties}>
      <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
        <path d="M8 5v14l11-7z" />
      </svg>
    </div>
  );
}

/* ── Modal ── */
function VideoModal({ msg, accent, onClose }: { msg: VideoMessage; accent: typeof CARD_ACCENTS[0]; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const embedUrl = getEmbedUrl(msg.videoUrl);
  const isDirect = isDirectVideo(msg.videoUrl);

  return (
    <motion.div
      className="vm-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      <motion.div
        className="vm-modal-card"
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.88, opacity: 0, y: 16 }}
        transition={{ duration: 0.35, ease: [0.34, 1.1, 0.64, 1] }}
        style={{ '--accent': accent.border, '--glow': accent.glow } as React.CSSProperties}
        onClick={e => e.stopPropagation()}
      >
        <button className="vm-modal-close" onClick={onClose} aria-label="Close">✕</button>

        <div className="vm-modal-video">
          {isDirect ? (
            <video src={embedUrl} controls autoPlay className="vm-modal-iframe" />
          ) : (
            <iframe
              src={embedUrl}
              className="vm-modal-iframe"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>

        <div className="vm-modal-info">
          <span className="vm-modal-from" style={{ color: accent.label }}>From {msg.senderName}</span>
          <span className="vm-modal-relation">{msg.relation}</span>
          <p className="vm-modal-caption">{msg.caption}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Single video card ── */
function VideoCard({
  msg, index, accent, rotation, onPlay
}: {
  msg: VideoMessage;
  index: number;
  accent: typeof CARD_ACCENTS[0];
  rotation: number;
  onPlay: () => void;
}) {
  const thumbUrl   = msg.videoUrl ? getThumbnailUrl(msg.videoUrl) : null;
  const hasVideo   = !!msg.videoUrl;

  return (
    <motion.div
      className="vm-card-wrap"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.65, delay: index * 0.1, ease: [0.34, 1.2, 0.64, 1] }}
      style={{ '--accent': accent.border, '--glow': accent.glow } as React.CSSProperties}
    >
      <motion.div
        className="vm-card"
        animate={{ rotate: rotation }}
        whileHover={{ rotate: 0, y: -14, scale: 1.06, transition: { duration: 0.35, ease: [0.34,1.1,0.64,1] } }}
        style={{ transformOrigin: 'center bottom' }}
      >
        {/* Film top edge */}
        <FilmEdge />

        {/* Video/thumbnail area */}
        <div
          className="vm-thumb"
          onClick={hasVideo ? onPlay : undefined}
          style={{ cursor: hasVideo ? 'none' : 'default' }}
        >
          {thumbUrl ? (
            <img src={thumbUrl} alt={`${msg.senderName}'s message`} className="vm-thumb-img" />
          ) : (
            <div className="vm-thumb-placeholder" style={{ background: accent.grad }}>
              <span className="vm-placeholder-icon">🎥</span>
              {!hasVideo && <span className="vm-placeholder-text">Add video URL in customize</span>}
            </div>
          )}

          {/* Overlay gradient */}
          <div className="vm-thumb-overlay" />

          {/* Play button — only if has video */}
          {hasVideo && <PlayBtn accent={accent} />}

          {/* "New message" badge */}
          <div className="vm-new-badge" style={{ background: accent.border }}>▶ Message</div>
        </div>

        {/* Film bottom edge */}
        <FilmEdge />

        {/* Info strip */}
        <div className="vm-info">
          <div className="vm-sender">
            <span className="vm-sender-name" style={{ color: accent.label }}>{msg.senderName}</span>
            <span className="vm-sender-relation">{msg.relation}</span>
          </div>
          <p className="vm-caption">{msg.caption}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Ambient bokeh canvas ── */
function BokehCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    const orbs = Array.from({ length: 18 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 80 + 30,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.06 + 0.02,
      hue: Math.random() > 0.5 ? 280 : 330,  // purple or rose
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      orbs.forEach(o => {
        o.x += o.vx; o.y += o.vy;
        if (o.x < -o.r) o.x = canvas.width + o.r;
        if (o.x > canvas.width + o.r) o.x = -o.r;
        if (o.y < -o.r) o.y = canvas.height + o.r;
        if (o.y > canvas.height + o.r) o.y = -o.r;

        const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        g.addColorStop(0, `hsla(${o.hue},80%,65%,${o.alpha})`);
        g.addColorStop(1, `hsla(${o.hue},80%,65%,0)`);
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} className="vm-bokeh-canvas" />;
}

/* ── Main section ── */
export default function VideoMessages({ config }: Props) {
  const [playing, setPlaying] = useState<VideoMessage | null>(null);
  const msgs = config.videoMessages;

  return (
    <section id="s-messages" className="section vm-section">
      <BokehCanvas />

      <div className="sec-inner vm-inner">
        {/* Header */}
        <motion.div
          className="vm-header"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
        >
          <div className="vm-header-tag">❤ Video Messages</div>
          <h2 className="section-title">Loved by Many</h2>
          <p className="section-sub">
            The people in your life sent their hearts to you — press play on each message
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="vm-grid">
          {msgs.map((msg, i) => {
            const accent   = CARD_ACCENTS[i % CARD_ACCENTS.length];
            const rotation = ROTATIONS[i % ROTATIONS.length];
            return (
              <VideoCard
                key={i}
                msg={msg}
                index={i}
                accent={accent}
                rotation={rotation}
                onPlay={() => setPlaying(msg)}
              />
            );
          })}
        </div>

        {/* Count badge */}
        <motion.div
          className="vm-count-badge"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <span className="vm-count-num">{msgs.length}</span>
          <span className="vm-count-label">
            {msgs.length === 1 ? 'person loves you' : 'people love you'} — and counting ♥
          </span>
        </motion.div>
      </div>

      {/* Video modal */}
      <AnimatePresence>
        {playing && (
          <VideoModal
            msg={playing}
            accent={CARD_ACCENTS[msgs.indexOf(playing) % CARD_ACCENTS.length]}
            onClose={() => setPlaying(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
