'use client';

import { useState, useEffect, useRef } from 'react';
import { encodeConfig } from '@/lib/utils';
import { defaultConfig } from '@/lib/config';
import type { SiteConfig, Reason, TimelineEvent, VideoMessage } from '@/lib/config';

const EMOJIS = ['❤️','💜','💕','💝','💖','💗','💞','💓','🧡','💛','💚','💙','✨','⭐','🌟','💫','🌸','🌺','🌹','🌷','🌻','🍀','🦋','🌈','✈️','🚀','🌍','🌏','🗺️','🧭','🏔️','🌅','🌄','🏝️','🌊','🛫','😊','😍','🥰','😂','🤩','😎','🥺','😘','🤗','💃','🎉','🎊','🎂','🎁','🎈','🎆','🎇','🎤','🎵','🎶','📱','💌','📖','🔮','👗','🌱','🌍'];

type Step = 1 | 2 | 3 | 4 | 'done';

export default function CustomizePage() {
  const [step,       setStep]       = useState<Step>(1);
  const [name,       setName]       = useState(defaultConfig.recipient.name);
  const [senderName, setSenderName] = useState(defaultConfig.sender.name);
  const [birthday,   setBirthday]   = useState(defaultConfig.birthday);
  const [iata,       setIata]       = useState(defaultConfig.recipient.iataCode);
  const [airline,    setAirline]    = useState(defaultConfig.airline.name);
  const [flightCode, setFlightCode] = useState(defaultConfig.airline.flightCode);
  const [worldName,  setWorldName]  = useState(defaultConfig.recipient.worldName);
  const [letterDate, setLetterDate] = useState(defaultConfig.letter.date);
  const [salutation, setSalutation] = useState(defaultConfig.letter.salutation);
  const [paras,      setParas]      = useState<string[]>(defaultConfig.letter.paragraphs);
  const [reasons,    setReasons]    = useState<Reason[]>(defaultConfig.reasons);
  const [timeline,   setTimeline]   = useState<TimelineEvent[]>(defaultConfig.timeline);
  const [gallery,    setGallery]    = useState(defaultConfig.gallery.map(g => g.caption));
  const [videos,     setVideos]     = useState<VideoMessage[]>(defaultConfig.videoMessages);
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [copied,     setCopied]     = useState(false);
  const [emojiTarget, setEmojiTarget] = useState<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    const stars = Array.from({length:160}, () => ({ x:Math.random()*canvas.width, y:Math.random()*canvas.height, r:Math.random()*1.5+0.2, o:Math.random(), d:Math.random()>0.5?0.006:-0.006 }));
    let raf: number;
    const draw = () => { ctx.clearRect(0,0,canvas.width,canvas.height); stars.forEach(s=>{ s.o+=s.d; if(s.o>=1||s.o<=0)s.d*=-1; ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fillStyle=`rgba(255,255,255,${s.o*0.5})`; ctx.fill(); }); raf=requestAnimationFrame(draw); };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  const generateLink = () => {
    const config: Partial<SiteConfig> = {
      recipient: { name: name||defaultConfig.recipient.name, iataCode:(iata||'ANK').toUpperCase().slice(0,3), worldName: worldName||`${name}'s World` },
      sender:    { name: senderName||defaultConfig.sender.name },
      birthday:  birthday||defaultConfig.birthday,
      airline:   { name:airline||defaultConfig.airline.name, tagline:'Special', flightCode },
      letter:    { salutation, date:letterDate, paragraphs:paras.filter(Boolean) },
      reasons,
      timeline,
      gallery:       gallery.map(caption => ({ caption })),
      videoMessages: videos,
      finale:        { message: defaultConfig.finale.message, from:`With infinite love — ${senderName||'Me'} ♥` },
    };
    const encoded = encodeConfig(config);
    const base = typeof window !== 'undefined' ? window.location.origin : '';
    setGeneratedUrl(`${base}/?data=${encoded}`);
    setStep('done');
  };

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(generatedUrl); }
    catch { const el=document.createElement('textarea'); el.value=generatedUrl; document.body.appendChild(el); el.select(); document.execCommand('copy'); document.body.removeChild(el); }
    setCopied(true); setTimeout(()=>setCopied(false), 2500);
  };

  return (
    <div style={{ background:'#02050f', minHeight:'100vh', color:'#fff', fontFamily:'var(--font-sans, Montserrat, sans-serif)', overflowX:'hidden' }}>
      <canvas ref={canvasRef} style={{ position:'fixed', inset:0, width:'100%', height:'100%', pointerEvents:'none', opacity:0.5 }} />

      <div style={{ position:'relative', zIndex:1, maxWidth:840, margin:'0 auto', padding:'40px 24px 80px' }}>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:10, fontSize:'1.1rem', fontWeight:700, letterSpacing:2, textTransform:'uppercase', marginBottom:10 }}>
            <span style={{ fontSize:'1.5rem' }}>✈</span>
            <span>Birthday Site <em style={{ color:'#3a6fd8', fontStyle:'normal' }}>Builder</em></span>
          </div>
          <p style={{ fontSize:'0.8rem', color:'rgba(255,255,255,0.55)', letterSpacing:1 }}>Fill in your details → get a shareable link in seconds</p>
        </div>

        {/* Steps indicator */}
        {step !== 'done' && (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:0, marginBottom:40 }}>
            {([1,2,3,4] as const).map((s,i) => {
              const sn = typeof step === 'number' ? step : 5;
              return (
              <div key={s} style={{ display:'flex', alignItems:'center' }}>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
                  <div style={{ width:36,height:36,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.8rem',fontWeight:700,
                    background: step===s?'linear-gradient(135deg,#7c4dff,#ff6b9d)':sn>s?'#1a3fa0':'rgba(255,255,255,0.04)',
                    border: step===s?'none':sn>s?'1px solid #3a6fd8':'1px solid rgba(255,255,255,0.15)',
                    color: (step===s||sn>s)?'#fff':'rgba(255,255,255,0.55)',
                    boxShadow: step===s?'0 0 20px rgba(255,107,157,0.5)':'none' }}>{s}</div>
                  <span style={{ fontSize:'0.6rem', letterSpacing:1, textTransform:'uppercase', color: step===s?'#ffb3ce':'rgba(255,255,255,0.4)' }}>
                    {['Essentials','Letter','12 Reasons','Your Story'][i]}
                  </span>
                </div>
                {i<3 && <div style={{ width:60,height:2,background:'rgba(255,255,255,0.1)',margin:'0 4px',marginBottom:22 }} />}
              </div>
              );
            })}
          </div>
        )}

        {/* ── STEP 1 ── */}
        {step===1 && (
          <Fade>
            <h2 style={titleStyle}>The Essentials ✨</h2>
            <p style={descStyle}>Start with the most important details about your relationship.</p>
            <div style={gridStyle}>
              <Field label="Her Name *" hint="Appears throughout the site"><input style={inputStyle} value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Ankita" maxLength={40} /></Field>
              <Field label="Your Name *" hint="Signs the love letter"><input style={inputStyle} value={senderName} onChange={e=>setSenderName(e.target.value)} placeholder="e.g. Robin" maxLength={40} /></Field>
              <Field label="Her Birthday Date *" hint="Used for the countdown"><input type="date" style={inputStyle} value={birthday} onChange={e=>setBirthday(e.target.value)} /></Field>
              <Field label="3-Letter Code (IATA)" hint="Shown on boarding pass"><input style={{...inputStyle,textTransform:'uppercase'}} value={iata} onChange={e=>setIata(e.target.value.slice(0,3))} placeholder="ANK" maxLength={3} /></Field>
              <Field label="Airline / Brand Name" hint="e.g. her airline or 'Love Airlines'"><input style={inputStyle} value={airline} onChange={e=>setAirline(e.target.value)} placeholder="e.g. IndiGo" maxLength={30} /></Field>
              <Field label="Flight Code" hint="Badge on boarding gate"><input style={inputStyle} value={flightCode} onChange={e=>setFlightCode(e.target.value)} placeholder="FL-0608 ♥" maxLength={20} /></Field>
              <div style={{ gridColumn:'1/-1' }}><Field label="Her World Subtitle" hint="Destination on boarding pass"><input style={inputStyle} value={worldName} onChange={e=>setWorldName(e.target.value)} placeholder="Ankita's World" maxLength={40} /></Field></div>
            </div>
            <NavRow onNext={() => setStep(2)} />
          </Fade>
        )}

        {/* ── STEP 2 ── */}
        {step===2 && (
          <Fade>
            <h2 style={titleStyle}>The Love Letter 💌</h2>
            <p style={descStyle}>Write up to 5 paragraphs. They will be typewritten on screen when she scrolls.</p>
            <Field label="Letter Date" hint="Shown top-right of letter"><input style={inputStyle} value={letterDate} onChange={e=>setLetterDate(e.target.value)} placeholder="June 8th, 2026" maxLength={30} /></Field>
            <div style={{ height:16 }} />
            <Field label="Salutation" hint="Opening line of letter"><input style={inputStyle} value={salutation} onChange={e=>setSalutation(e.target.value)} placeholder="My Dearest Ankita," maxLength={60} /></Field>
            <div style={{ marginTop:20, display:'flex', flexDirection:'column', gap:14 }}>
              {[0,1,2,3,4].map(i=>(
                <Field key={i} label={`Paragraph ${i+1}${i===0?' *':''}`} hint={`${paras[i]?.length||0} / 300`}>
                  <textarea style={{...inputStyle,resize:'vertical',minHeight:72}} value={paras[i]||''} onChange={e=>{const n=[...paras];n[i]=e.target.value;setParas(n);}} placeholder={`Your ${['first','second','third','fourth','fifth'][i]} paragraph…`} maxLength={300} rows={3} />
                </Field>
              ))}
            </div>
            <NavRow onBack={()=>setStep(1)} onNext={()=>setStep(3)} />
          </Fade>
        )}

        {/* ── STEP 3 ── */}
        {step===3 && (
          <Fade>
            <h2 style={titleStyle}>12 Reasons You Love Her 💜</h2>
            <p style={descStyle}>Each card flips to reveal your reason. Click an emoji to change it.</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:16, marginBottom:32 }}>
              {reasons.map((r,i)=>(
                <div key={i} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:14, padding:16 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                    <div style={{ width:26,height:26,borderRadius:'50%',background:'rgba(124,77,255,0.2)',border:'1px solid rgba(124,77,255,0.4)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.65rem',fontWeight:700,color:'#b388ff',flexShrink:0 }}>
                      {String(i+1).padStart(2,'0')}
                    </div>
                    <button style={{ fontSize:'1.6rem',background:'none',border:'none',cursor:'pointer',transition:'transform 0.2s',padding:2,borderRadius:6,lineHeight:1 }}
                      onMouseEnter={e=>(e.currentTarget.style.transform='scale(1.3)')}
                      onMouseLeave={e=>(e.currentTarget.style.transform='scale(1)')}
                      onClick={()=>setEmojiTarget(i)}>{r.icon}</button>
                    <span style={{ fontSize:'0.65rem', color:'rgba(255,255,255,0.55)', textTransform:'uppercase', letterSpacing:1 }}>Reason {i+1}</span>
                  </div>
                  <textarea
                    style={{ ...inputStyle, resize:'none', minHeight:60, fontSize:'0.78rem', lineHeight:1.5, padding:'8px 10px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)' }}
                    value={r.text}
                    onChange={e=>{const n=[...reasons];n[i]={...n[i],text:e.target.value};setReasons(n);}}
                    placeholder="Why you love her…" maxLength={120} rows={3}
                  />
                </div>
              ))}
            </div>
            <NavRow onBack={()=>setStep(2)} onNext={()=>setStep(4)} />
          </Fade>
        )}

        {/* ── STEP 4 ── */}
        {step===4 && (
          <Fade>
            <h2 style={titleStyle}>Your Story & Gallery 📖</h2>
            <p style={descStyle}>Up to 5 timeline moments + 6 gallery photo captions.</p>
            <h3 style={{ fontFamily:'var(--font-serif,serif)', fontSize:'1.2rem', fontWeight:700, color:'#b388ff', marginBottom:16 }}>Timeline — Your Story</h3>
            {timeline.map((ev,i)=>(
              <div key={i} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:14, padding:20, marginBottom:14 }}>
                <div style={{ fontSize:'0.65rem', fontWeight:700, color:'#b388ff', textTransform:'uppercase', letterSpacing:2, marginBottom:12 }}>Moment {i+1}</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  <div><span style={labelStyle}>Tag / Era</span><input style={inputStyle} value={ev.tag} onChange={e=>{const n=[...timeline];n[i]={...n[i],tag:e.target.value};setTimeline(n);}} placeholder="e.g. The Beginning" maxLength={30} /></div>
                  <div><span style={labelStyle}>Dot Icon</span><input style={{...inputStyle,textAlign:'center',fontSize:'1.2rem'}} value={ev.dot} onChange={e=>{const n=[...timeline];n[i]={...n[i],dot:e.target.value};setTimeline(n);}} placeholder="✨" maxLength={4} /></div>
                  <div><span style={labelStyle}>Title</span><input style={inputStyle} value={ev.title} onChange={e=>{const n=[...timeline];n[i]={...n[i],title:e.target.value};setTimeline(n);}} placeholder="Milestone title" maxLength={50} /></div>
                  <div style={{ gridColumn:'1/-1' }}><span style={labelStyle}>Description</span><textarea style={{...inputStyle,resize:'none',minHeight:56}} value={ev.text} onChange={e=>{const n=[...timeline];n[i]={...n[i],text:e.target.value};setTimeline(n);}} placeholder="A short description…" maxLength={200} rows={2} /></div>
                </div>
              </div>
            ))}
            <h3 style={{ fontFamily:'var(--font-serif,serif)', fontSize:'1.2rem', fontWeight:700, color:'#b388ff', marginBottom:16, marginTop:32 }}>Gallery Captions</h3>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:32 }}>
              {gallery.map((cap,i)=>(
                <div key={i} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, padding:12 }}>
                  <label style={labelStyle}>Photo {i+1}</label>
                  <input style={inputStyle} value={cap} onChange={e=>{const n=[...gallery];n[i]=e.target.value;setGallery(n);}} placeholder="Caption…" maxLength={40} />
                </div>
              ))}
            </div>

            {/* Video Messages */}
            <h3 style={{ fontFamily:'var(--font-serif,serif)', fontSize:'1.2rem', fontWeight:700, color:'#b388ff', marginBottom:8, marginTop:32 }}>Video Messages 🎥</h3>
            <p style={{ fontSize:'0.78rem', color:'rgba(255,255,255,0.45)', marginBottom:16, lineHeight:1.6 }}>
              Add YouTube links (or direct .mp4 URLs) from friends & family. Paste the full YouTube URL — e.g. <span style={{color:'#b388ff',fontFamily:'monospace'}}>https://youtu.be/xxxxx</span>
            </p>
            {videos.map((v, i) => (
              <div key={i} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, padding:16, marginBottom:12 }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                  <span style={{ fontSize:'0.65rem', fontWeight:700, color:'#b388ff', textTransform:'uppercase', letterSpacing:2 }}>Message {i+1}</span>
                  {videos.length > 1 && (
                    <button style={{ background:'rgba(255,107,157,0.1)', border:'1px solid rgba(255,107,157,0.3)', borderRadius:6, color:'#ff6b9d', fontSize:'0.65rem', padding:'3px 10px', cursor:'pointer' }}
                      onClick={()=>setVideos(prev=>prev.filter((_,j)=>j!==i))}>Remove</button>
                  )}
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:10 }}>
                  <div><span style={labelStyle}>Sender Name</span><input style={inputStyle} value={v.senderName} onChange={e=>{const n=[...videos];n[i]={...n[i],senderName:e.target.value};setVideos(n);}} placeholder="e.g. Mom" maxLength={30} /></div>
                  <div><span style={labelStyle}>Relation</span><input style={inputStyle} value={v.relation} onChange={e=>{const n=[...videos];n[i]={...n[i],relation:e.target.value};setVideos(n);}} placeholder="e.g. Family" maxLength={20} /></div>
                </div>
                <div style={{marginBottom:10}}><span style={labelStyle}>Video URL (YouTube or .mp4)</span><input style={inputStyle} value={v.videoUrl} onChange={e=>{const n=[...videos];n[i]={...n[i],videoUrl:e.target.value};setVideos(n);}} placeholder="https://youtu.be/…" /></div>
                <div><span style={labelStyle}>Caption / Message</span><input style={inputStyle} value={v.caption} onChange={e=>{const n=[...videos];n[i]={...n[i],caption:e.target.value};setVideos(n);}} placeholder="A short message from them…" maxLength={120} /></div>
              </div>
            ))}
            {videos.length < 10 && (
              <button style={{ width:'100%', background:'rgba(124,77,255,0.1)', border:'1px dashed rgba(124,77,255,0.4)', borderRadius:10, color:'#b388ff', fontSize:'0.8rem', padding:'12px', cursor:'pointer', marginBottom:8, transition:'all 0.2s' }}
                onClick={()=>setVideos(prev=>[...prev,{senderName:'',relation:'',caption:'',videoUrl:''}])}>
                + Add Video Message
              </button>
            )}

            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:32, paddingTop:24, borderTop:'1px solid rgba(255,255,255,0.1)' }}>
              <BackBtn onClick={()=>setStep(3)} />
              <button style={{ ...nextBtnStyle, background:'linear-gradient(135deg,#ff6b9d,#7c4dff)' }} onClick={generateLink}>✨ Generate My Link</button>
            </div>
          </Fade>
        )}

        {/* ── RESULT ── */}
        {step==='done' && (
          <Fade>
            <div style={{ background:'linear-gradient(135deg,#0d0a28,#1a0a30)', border:'1px solid rgba(255,107,157,0.3)', borderRadius:20, padding:'48px 40px', textAlign:'center', boxShadow:'0 0 60px rgba(255,107,157,0.1)' }}>
              <div style={{ fontSize:'3rem', marginBottom:16 }}>🎉</div>
              <h2 style={{ ...titleStyle, marginBottom:12 }}>Your Site is Ready!</h2>
              <p style={{ ...descStyle, marginBottom:28 }}>Copy the link below and share it with her. The link contains everything — no server needed.</p>
              <div style={{ display:'flex', gap:10, alignItems:'center', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:12, padding:'8px 8px 8px 16px', marginBottom:24 }}>
                <input readOnly value={generatedUrl} style={{ flex:1, background:'none', border:'none', color:'#b388ff', fontFamily:'monospace', fontSize:'0.78rem', outline:'none', cursor:'text' }} onClick={e=>(e.target as HTMLInputElement).select()} />
                <button style={{ background:copied?'#28a745':'linear-gradient(135deg,#7c4dff,#1a3fa0)', color:'#fff', border:'none', borderRadius:8, padding:'10px 20px', fontFamily:'inherit', fontSize:'0.78rem', fontWeight:600, letterSpacing:1, textTransform:'uppercase', cursor:'pointer', whiteSpace:'nowrap', transition:'background 0.3s', flexShrink:0 }} onClick={copyLink}>
                  {copied?'✓ Copied!':'Copy'}
                </button>
              </div>
              <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap', marginBottom:24 }}>
                <a href={generatedUrl} target="_blank" rel="noreferrer" style={{ display:'inline-flex',alignItems:'center',gap:8,background:'linear-gradient(135deg,#ffd700,#ff8c00)',color:'#1a0a00',borderRadius:50,padding:'12px 28px',fontFamily:'inherit',fontSize:'0.8rem',fontWeight:700,letterSpacing:1,textDecoration:'none',transition:'all 0.3s' }}>🔍 Preview Site</a>
                <button style={{ background:'transparent', color:'rgba(255,255,255,0.55)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:50, padding:'12px 24px', fontFamily:'inherit', fontSize:'0.8rem', cursor:'pointer', transition:'all 0.3s' }} onClick={()=>setStep(1)}>✏️ Edit Again</button>
              </div>
              <p style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.55)', lineHeight:1.7, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:10, padding:16 }}>
                💡 <strong style={{ color:'#ffd700' }}>Tip:</strong> The entire site is personalized via the link. Whoever opens it sees your custom version — no login, no server, just pure magic.
              </p>
            </div>
          </Fade>
        )}
      </div>

      {/* Emoji picker */}
      {emojiTarget !== null && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(6px)', zIndex:999, display:'flex', alignItems:'center', justifyContent:'center' }} onClick={()=>setEmojiTarget(null)}>
          <div style={{ background:'linear-gradient(135deg,#0d0a28,#1a0030)', border:'1px solid rgba(124,77,255,0.4)', borderRadius:20, padding:28, maxWidth:360, width:'90%', boxShadow:'0 40px 100px rgba(0,0,0,0.6)' }} onClick={e=>e.stopPropagation()}>
            <p style={{ textAlign:'center', fontSize:'0.8rem', textTransform:'uppercase', letterSpacing:2, color:'rgba(255,255,255,0.55)', marginBottom:16 }}>Pick an icon</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:8, marginBottom:20 }}>
              {EMOJIS.map(em=>(
                <button key={em} style={{ fontSize:'1.5rem', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, cursor:'pointer', padding:6, textAlign:'center', lineHeight:1, transition:'all 0.2s' }}
                  onMouseEnter={e=>{(e.currentTarget.style.background='rgba(124,77,255,0.2)');(e.currentTarget.style.transform='scale(1.2)');}}
                  onMouseLeave={e=>{(e.currentTarget.style.background='rgba(255,255,255,0.04)');(e.currentTarget.style.transform='scale(1)');}}
                  onClick={()=>{ const n=[...reasons]; n[emojiTarget]={...n[emojiTarget],icon:em}; setReasons(n); setEmojiTarget(null); }}>{em}</button>
              ))}
            </div>
            <button style={{ display:'block', width:'100%', background:'transparent', color:'rgba(255,255,255,0.55)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:8, padding:10, fontFamily:'inherit', fontSize:'0.78rem', cursor:'pointer' }} onClick={()=>setEmojiTarget(null)}>✕ Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

// Shared sub-components & styles
const titleStyle: React.CSSProperties = { fontFamily:'var(--font-serif,Georgia,serif)', fontSize:'clamp(1.6rem,4vw,2.4rem)', fontWeight:700, background:'linear-gradient(135deg,#fff,#ffb3ce)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', marginBottom:6 };
const descStyle:  React.CSSProperties = { fontSize:'0.82rem', color:'rgba(255,255,255,0.55)', marginBottom:28, lineHeight:1.6 };
const inputStyle: React.CSSProperties = { background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:10, color:'#fff', fontFamily:'var(--font-sans,Montserrat,sans-serif)', fontSize:'0.9rem', padding:'12px 16px', outline:'none', width:'100%', transition:'border-color 0.25s' };
const gridStyle:  React.CSSProperties = { display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:32 };
const labelStyle: React.CSSProperties = { fontSize:'0.6rem', color:'rgba(255,255,255,0.55)', textTransform:'uppercase', letterSpacing:1, display:'block', marginBottom:4 };
const nextBtnStyle: React.CSSProperties = { background:'linear-gradient(135deg,#7c4dff,#1a3fa0)', color:'#fff', border:'none', borderRadius:50, padding:'14px 32px', fontFamily:'var(--font-sans,Montserrat,sans-serif)', fontSize:'0.82rem', fontWeight:600, letterSpacing:'1.5px', textTransform:'uppercase', cursor:'pointer', boxShadow:'0 6px 24px rgba(124,77,255,0.4)', transition:'all 0.3s' };

function Field({ label, hint, children }: { label:string; hint?:string; children:React.ReactNode }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      <label style={{ fontSize:'0.72rem', fontWeight:600, textTransform:'uppercase', letterSpacing:'1.5px', color:'#b388ff' }}>{label}</label>
      {children}
      {hint && <span style={{ fontSize:'0.65rem', color:'rgba(255,255,255,0.3)' }}>{hint}</span>}
    </div>
  );
}

function BackBtn({ onClick }: { onClick:()=>void }) {
  return <button style={{ background:'transparent', color:'rgba(255,255,255,0.55)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:50, padding:'14px 24px', fontFamily:'inherit', fontSize:'0.82rem', cursor:'pointer', transition:'all 0.3s' }} onClick={onClick}>← Back</button>;
}

function NavRow({ onBack, onNext }: { onBack?:()=>void; onNext:()=>void }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:32, paddingTop:24, borderTop:'1px solid rgba(255,255,255,0.1)' }}>
      {onBack ? <BackBtn onClick={onBack} /> : <span />}
      <button style={nextBtnStyle} onClick={onNext}>Next →</button>
    </div>
  );
}

function Fade({ children }: { children:React.ReactNode }) {
  return <div style={{ animation:'fadeSlideIn 0.4s ease forwards' }}>{children}<style>{`@keyframes fadeSlideIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style></div>;
}
