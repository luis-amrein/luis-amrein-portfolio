import { useEffect, useRef, useState } from 'react';
import './magazine-prototype.css';
import { createPaperScene } from './paper-turn';
import type { PaperScene } from './paper-turn';
type Project = { id:string; title:string; eyebrow:string; summary:string; year:string; role:string; challenge:string; outcome:string; outcomeLabel:string; tags:string[]; showcase?:{type:string;src:string;alt:string}[] };
type Props = { projects:Project[]; portrait:string; base:string };
type Turn = { to:number; direction:number; corner:number };
type Motion = Turn & {progress:number;velocity:number;source:'click'|'drag'|'wheel';ready:Promise<void>;scene?:PaperScene};
const directions = [
 {key:'D',name:'The Luis Issue',description:'Art journal × fashion issue · coral & green · sculpted paper'},
 {key:'A',name:'The Editorial',description:'Warm paper · serif headlines · quiet tension'},
 {key:'B',name:'The Fashion Issue',description:'Full-bleed portraits · oversized type · high contrast'},
 {key:'C',name:'The Art Journal',description:'Coral · graphic compositions · radical scale'}
];
const pad=(n:number)=>String(n).padStart(2,'0');
export default function MagazinePrototype({projects,portrait,base}:Props){
 const initial=new URLSearchParams(window.location.search).get('variant')||'D';
 const [variant,setVariant]=useState(directions.some(d=>d.key===initial)?initial:'D');
 const [spread,setSpread]=useState(-1);
 const [turn,setTurn]=useState<Turn|null>(null);
 const [contents,setContents]=useState(false);
 const [slow,setSlow]=useState(false);
 const [reduced,setReduced]=useState(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
 const [portraitMode,setPortraitMode]=useState(window.matchMedia('(orientation: portrait)').matches);
  const sheet = useRef<HTMLDivElement>(null);
  const book = useRef<HTMLDivElement>(null);
  const sceneHost = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const motion = useRef<Motion | null>(null);
  const frame = useRef(0);
  const gesture = useRef<{ x: number; width: number; last: number; time: number } | null>(null);
  const coverSwipe = useRef<{x:number;y:number;tapToOpen:boolean} | null>(null);
  const wheel = useRef({ last: 0, locked: false, timer: 0 });
  const total = projects.length + 3;
  const names = ['Portrait & contents', 'Selected work', 'About Luis', ...projects.map(p => p.title)];
  const direction = directions.find(d => d.key === variant)!;
  const asset = (src: string) => `${base.replace(/\/$/, '')}/${src}`;

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const orientation = window.matchMedia('(orientation: portrait)');
    const sync = () => {
      setReduced(preference.matches); setPortraitMode(orientation.matches);
      if (motion.current) finishTurn(motion.current, false);
    };
    preference.addEventListener('change', sync); orientation.addEventListener('change', sync);
    return () => {
      preference.removeEventListener('change', sync); orientation.removeEventListener('change', sync);
      cancelAnimationFrame(frame.current); clearTimeout(wheel.current.timer); motion.current?.scene?.dispose(); motion.current=null; busy.current=false;
    };
  }, []);

  function switchVariant(step: number) {
    if (busy.current) return;
    const next = directions[(directions.findIndex(d => d.key === variant) + step + directions.length) % directions.length].key;
    setVariant(next);
    const url = new URL(window.location.href); url.searchParams.set('variant', next);
    window.history.replaceState({}, '', url);
  }

  function paint(m: Motion, progress: number) {
    m.progress = Math.max(0, Math.min(1.065, progress));
    if (m.scene) m.scene.paint(m.progress, m.corner);
    else if (sheet.current) sheet.current.style.transform = `rotateY(${-180 * m.direction * Math.min(1, m.progress)}deg)`;
    if (book.current) {
      book.current.dataset.turnProgress = m.progress.toFixed(3);
      book.current.style.setProperty('--turn-lift', String(Math.sin(Math.PI * Math.min(1, m.progress))));
    }
  }

  function finishTurn(m: Motion, committed: boolean) {
    if (motion.current !== m) return;
    cancelAnimationFrame(frame.current);
    if (committed) setSpread(m.to);
    m.scene?.dispose();
    book.current?.classList.remove('paper-live');
    book.current?.removeAttribute('data-turn-progress');
    book.current?.style.removeProperty('--turn-lift');
    motion.current = null; busy.current = false; gesture.current = null; setTurn(null);
  }

  function beginTurn(to: number, source: Motion['source'], corner = .6) {
    busy.current = true;
    let prepared!: () => void;
    const m: Motion = { to, direction: to > spread ? 1 : -1, corner, progress: 0, velocity: 0, source,
      ready: new Promise<void>(resolve => { prepared = resolve; }) };
    motion.current = m;
    setTurn({ to, direction: m.direction, corner });
    requestAnimationFrame(() => requestAnimationFrame(async () => {
      try {
        const front = sheet.current?.querySelector<HTMLElement>('.sheet-front');
        const back = sheet.current?.querySelector<HTMLElement>('.sheet-back');
        if (front && back && sceneHost.current) {
          const scene = await createPaperScene(sceneHost.current, front, back, m.direction);
          if (motion.current !== m) { scene.dispose(); prepared(); return; }
          m.scene = scene;
          book.current?.classList.add('paper-live');
          paint(m, m.progress);
        }
      } catch (error) { console.warn('Paper rendering fallback:', error); }
      prepared();
    }));
    return m;
  }

  async function settle(m: Motion, commit: boolean, velocity = 0) {
    await m.ready;
    if (motion.current !== m) return;
    cancelAnimationFrame(frame.current);
    const target = commit ? 1 : 0;
    let speed = Math.max(-2.5, Math.min(2.5, velocity));
    let previous = performance.now(), start = previous;
    const stiffness = slow ? 16 : 52, damping = slow ? 6.6 : 11.5;
    const tick = (now: number) => {
      if (motion.current !== m) return;
      const dt = Math.min(.032, (now - previous) / 1000); previous = now;
      speed += ((target - m.progress) * stiffness - speed * damping) * dt;
      paint(m, m.progress + speed * dt);
      if ((Math.abs(target - m.progress) < .0008 && Math.abs(speed) < .008) || now - start > (slow ? 4200 : 2300)) {
        finishTurn(m, commit); return;
      }
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  }

  function go(to: number) {
    if (busy.current || to === spread || to < -1 || to >= total) return;
    setContents(false);
    if (reduced || portraitMode) {
      setSpread(to);
      if (portraitMode) window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }
    settle(beginTurn(to, 'click'), true);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('input,textarea,select,[contenteditable="true"]')) return;
      if ((e.target as HTMLElement).closest('.prototype-switcher') || e.altKey) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); switchVariant(e.key === 'ArrowRight' ? 1 : -1); }
      } else if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); go(spread + 1); }
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(spread - 1); }
      else if (e.key === 'Home') { e.preventDefault(); go(-1); }
      else if (e.key === 'End') { e.preventDefault(); go(total - 1); }
      else if (e.key === 'Escape') setContents(false);
    };
    const onWheel = (e: WheelEvent) => {
      if (contents || e.ctrlKey || (e.target as HTMLElement).closest('.contents-overlay')) return;
      const horizontal = spread === -1 ? (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY) : e.shiftKey ? (e.deltaX || e.deltaY) : e.deltaX;
      if (spread !== -1 && !e.shiftKey && Math.abs(horizontal) <= Math.abs(e.deltaY) * .75) return;
      if (Math.abs(horizontal) < .1) return;
      e.preventDefault();
      const now = performance.now(), session = wheel.current;
      const gap = now - session.last;
      if (gap > 260) session.locked = false;
      session.last = now;
      if (session.locked) return;
      const delta = horizontal * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerWidth : 1);
      if (busy.current && motion.current?.source !== 'wheel') { session.locked = true; return; }
      if (!motion.current) {
        const next = spread + Math.sign(delta);
        if (next < -1 || next >= total) return;
        if (reduced || portraitMode) { session.locked = true; go(next); return; }
        beginTurn(next, 'wheel');
      }
      const m = motion.current!;
      const change = delta * m.direction / ((book.current?.offsetWidth || 900) * .52);
      m.velocity = m.velocity * .65 + change / Math.max(.016, Math.min(.1, gap / 1000)) * .35;
      paint(m, Math.max(0, Math.min(1, m.progress + change)));
      clearTimeout(session.timer);
      if (m.progress > .97) { session.locked = true; settle(m, true, m.velocity); }
      else session.timer = window.setTimeout(() => {
        session.locked = true;
        settle(m, m.progress > .16 || (m.progress > .065 && m.velocity > .5), m.velocity);
      }, 160);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('wheel', onWheel); };
  }, [spread, variant, slow, reduced, portraitMode, contents]);

  function pointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (busy.current || e.button !== 0) return;
    const target = e.target as HTMLElement;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    if (spread === -1) {
      if (target.closest('a,button:not(.cover-hitarea):not(.open-invitation)')) return;
      coverSwipe.current = { x:e.clientX, y:e.clientY, tapToOpen:!!target.closest('.open-invitation,.cover-hitarea') };
      e.currentTarget.setPointerCapture(e.pointerId);
      if (reduced || portraitMode || x < .5 || target.closest('.open-invitation')) return;
    } else if (reduced || portraitMode || target.closest('a,button')) return;
    const d = spread === -1 ? 1 : x > .8 ? 1 : x < .2 ? -1 : 0;
    if (!d || spread + d < -1 || spread + d >= total) return;
    e.preventDefault();
    beginTurn(spread + d, 'drag', (e.clientY - rect.top) / rect.height * 2 - 1);
    gesture.current = { x: e.clientX, width: rect.width / 2, last: e.clientX, time: performance.now() };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function pointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const g = gesture.current, m = motion.current; if (!g || !m) return;
    const now = performance.now();
    m.velocity = (g.last - e.clientX) * m.direction / g.width / Math.max(.016, (now - g.time) / 1000);
    g.last = e.clientX; g.time = now;
    paint(m, Math.max(0, Math.min(1, (g.x - e.clientX) * m.direction / g.width)));
  }

  function pointerUp(e: React.PointerEvent<HTMLDivElement>, cancel = false) {
    const swipe = coverSwipe.current;
    coverSwipe.current = null;
    const g = gesture.current, m = motion.current;
    if (!g || !m) {
      if (!cancel && swipe && (Math.hypot(e.clientX-swipe.x,e.clientY-swipe.y)>30||swipe.tapToOpen)) go(0);
      return;
    }
    const tap = Math.abs(e.clientX - g.x) < 7;
    gesture.current = null;
    settle(m, !cancel && (tap || m.progress > .22 || m.velocity > .8), m.velocity);
  }

  function Folio({index,side,name}:{index:number;side:number;name:string}){
    return <footer className="folio"><span>{side===0?'Luis Amrein':name}</span><span>{pad(index*2+side+1)}</span></footer>;
  }
  function Hero({side}:{side:number}){
    return side===0?<div className="page-inner opening-copy"><div className="running-head"><span>Independent portfolio</span><span>Berlin, DE</span></div><div className="cover-title"><span className="edition">Volume 01 / A work in progress</span><h1>Making<br/>products<br/><em>make sense.</em></h1><span className="cover-star" aria-hidden="true">✳</span></div><div className="cover-bottom"><span className="byline">Luis<br/>Amrein</span><p>Product thinking.<br/>An engineering mind.<br/>A curious human.</p></div><Folio index={0} side={0} name="Opening"/></div>:<div className="page-inner opening-image"><img className="hero-portrait" src={portrait} alt="Luis Amrein" draggable="false"/><div className="image-annotation"><span>Fig. 01 — The person behind the products</span><span>52° 31′ N, 13° 24′ E</span></div><div className="cover-note"><span className="mini-label">A note from Luis</span><p>I work where people,<br/>systems, and <em>possibility</em><br/>meet.</p><span>Currently shaping digital health at Caspar Health.</span></div><div className="art-cover-word" aria-hidden="true">SENSE</div><Folio index={0} side={0} name="An introduction"/></div>;
  }
  function Work({side}:{side:number}){
    const list=side===0?projects.slice(0,4):projects.slice(4);
    return <div className={`page-inner work-page work-${side}`}><div className="running-head"><span>01 / Selected work</span><span>2020—2026</span></div>{side===0?<><h2 className="editorial-title">A few things<br/><em>put into<br/>the world.</em></h2><p className="section-intro">From the habits we keep to the systems we depend on. A selection of products I shipped, shaped, or steered.</p></>:<button className="work-feature" onClick={()=>go(3)} aria-label="Open Habbit spread"><div className="phone-composition"><span className="composition-word">small<br/><i>rituals.</i></span><img src={asset('work/habbit/screen-03.jpg')} alt="Habbit app showing habit progress" draggable="false"/></div><span className="feature-caption">01 / Habbit — a kinder kind of consistency <span>↗</span></span></button>}<div className={`contents-list ${side?'secondary-list':''}`}>{list.map((p,i)=>{const n=i+(side?4:0);return <button key={p.id} onClick={()=>go(n+3)}><span>{pad(n+1)}</span><span>{p.title}<small>{p.tags.slice(0,2).join(' / ')}</small></span><span>{pad((n+3)*2+1)} ↗</span></button>})}</div><Folio index={1} side={side} name="Selected work"/></div>;
  }
  function About({side}:{side:number}){
    return <div className={`page-inner about-page about-${side}`}><div className="running-head"><span>02 / The person</span><span>Always curious</span></div>{side===0?<><div className="about-photo"><img src={portrait} alt="Portrait of Luis Amrein" draggable="false"/><span>Fig. 02 / Luis, in real life.</span></div><h2 className="editorial-title">More than<br/><em>a roadmap.</em></h2></>:<><p className="about-pullquote">Technical enough<br/>to build it.<br/><em>Product enough<br/>to kill it.</em></p><div className="article-columns"><p>My path into product started with engineering: automated vehicles, ergonomics, medical technology, and a knee prosthesis designed for humanitarian use.</p><p>Today, product management is where my favourite things meet: empathy, design, technology, creativity, and evidence.</p></div><div className="off-clock"><span className="mini-label">Away from the screen</span><p>Gravel rides. Piano lessons.<br/>Portuguese. Music. Making things.</p></div><a className="editorial-link" href="mailto:luis.amrein@hotmail.de">Let’s make something make sense. ↗</a></>}<Folio index={2} side={side} name="About Luis"/></div>;
  }
  function ProjectPage({index,side}:{index:number;side:number}){
    const p=projects[index-3], image=p.showcase?.find(s=>s.type==='image');
    return <div className={`page-inner project-page project-${side}`}><div className="running-head"><span>Project / {pad(index-2)}</span><span>{p.year}</span></div>{side===0?<><span className="project-category">{p.eyebrow}</span><h2 className={`editorial-title project-title ${p.title.split(' ').some(w=>w.length>12)?'long-word':''}`}>{p.title}</h2><p className="project-summary">{p.summary}</p><div className="project-role"><span className="mini-label">My role</span><p>{p.role}</p></div><span className="project-number" aria-hidden="true">{pad(index-2)}</span></>:<>{image?<figure className={`project-visual ${p.id.includes('habbit')?'mobile-visual':''}`}><img src={asset(image.src)} alt={image.alt} draggable="false"/><figcaption>Fig. {pad(index-2)} / {p.title}</figcaption></figure>:<div className="project-type-art" aria-label={p.outcomeLabel}><span>{p.tags[0]}</span><strong>{p.id.includes('recommendations')?'3×':p.id.includes('registration')?'+40%':'0→1'}</strong><span>{p.outcomeLabel}</span></div>}<div className="project-story"><div><span className="mini-label">The question</span><p>{p.challenge}</p></div><div><span className="mini-label">The result</span><p>{p.outcome}</p></div></div></>}<Folio index={index} side={side} name={p.title}/></div>;
  }
  function IssueContents() {
    return <div className="page-inner issue-contents-page">
      <div className="running-head"><span>No. 01 / Contents</span><span>A curious collection</span></div>
      <h2 className="editorial-title">Inside<br/><em>this issue.</em></h2>
      <p className="issue-intro">Product, people, and everything in between.<br/>Find a chapter. Follow your curiosity.</p>
      <nav className="issue-chapters" aria-label="Table of contents">
        {names.slice(1).map((name,i)=><button key={name} onClick={()=>go(i+1)}>
          <span>{pad((i+1)*2+1)}</span><span>{name}</span><span aria-hidden="true">↗</span>
        </button>)}
      </nav>
      <Folio index={0} side={1} name="Contents"/>
    </div>;
  }
  function Page({index,side,face=''}:{index:number;side:number;face?:string}){
    const kind = index===-1 ? (side===0?'cover-whitespace':'closed-cover') : '';
    return <div className={`magazine-page side-${side} ${kind} ${face}`} aria-hidden={!!face||index===-1&&side===0||undefined} inert={!!face||undefined}>
      {index===-1?(side===0?null:<Hero side={0}/>):index===0?(side===0?<Hero side={1}/>:<IssueContents/>):index===1?<Work side={side}/>:index===2?<About side={side}/>:<ProjectPage index={index} side={side}/>}
    </div>;
  }
  return <div className={`magazine-app ${variant==='D'?'variant-C variant-D':`variant-${variant}`}`}>
    <header className="reader-header"><a href={base} className="reader-brand">LA<span> / PORTFOLIO</span></a><div className="reader-edition">The magazine experiment <span>— Issue No. 01</span></div><button className="contents-toggle" onClick={()=>setContents(!contents)} aria-expanded={contents} aria-controls="issue-contents">{contents?'Close':'Contents'} <span>{contents?'×':'☰'}</span></button></header>
    <main className="reader-main"><div className="spread-topline"><span>{spread===-1?'The cover':`${pad(spread+1)} / ${names[spread]}`}</span><span>Product, people & everything in between.</span></div><div className={`magazine-book ${turn?'is-turning':''} ${spread===-1?'is-closed':''} ${turn?.to===-1?'is-closing':''}`} ref={book} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={e=>pointerUp(e)} onPointerCancel={e=>pointerUp(e,true)} aria-label={spread===-1?'Closed magazine cover':`Magazine spread ${spread+1}: ${names[spread]}`}><div className="book-base"><Page index={turn&&turn.direction<0?turn.to:spread} side={0}/><Page index={turn&&turn.direction>0?turn.to:spread} side={1}/></div>{turn&&<div className={`turning-sheet ${turn.direction>0?'forward':'backward'}`} ref={sheet}><Page index={spread} side={turn.direction>0?1:0} face="sheet-front"/><Page index={turn.to} side={turn.direction>0?0:1} face="sheet-back"/><div className="turn-shading"/><div className="back-shading"/></div>}<div className="paper-scene-host" ref={sceneHost}/>
      {spread===-1&&!turn&&<>
        <button className="open-invitation" onClick={()=>go(0)} aria-label="Open me — open the magazine">
          <span className="invitation-aura" aria-hidden="true"/>
          <span className="invitation-spark spark-one" aria-hidden="true">✧</span>
          <span className="invitation-spark spark-two" aria-hidden="true">✧</span>
          <span className="invitation-word">Open me</span>
          <span className="invitation-hint">click, scroll or swipe</span>
        </button>
        <button className="cover-hitarea" onClick={()=>go(0)} aria-label="Open magazine cover"/>
      </>}
      <div className="book-spine" aria-hidden="true"/>{!turn&&spread>=0&&<button className="edge-turn edge-prev" aria-label="Turn to previous spread" onClick={()=>go(spread-1)}>↶</button>}{!turn&&spread>=0&&spread<total-1&&<button className="edge-turn edge-next" aria-label="Turn to next spread" onClick={()=>go(spread+1)}>↷</button>}</div>
    <div className="reader-controls"><div className="motion-controls"><span className="small-dot"/>{reduced?'Reduced motion':'Sculpted paper'}<button onClick={()=>setSlow(!slow)} aria-pressed={slow}>{slow?'Slow study':'Natural pace'}</button></div><div className="paging"><button onClick={()=>go(spread-1)} disabled={spread===-1||!!turn} aria-label="Previous spread">←</button><span aria-live="polite">{spread===-1?'Cover':<>{pad(spread*2+1)} — {pad(spread*2+2)} <small>/ {pad(total*2)}</small></>}</span><button onClick={()=>go(spread+1)} disabled={spread===total-1||!!turn} aria-label="Next spread">→</button></div><p className="interaction-hint">{spread===-1?<>A little curiosity <span>opens a whole world.</span></>:<>Scroll horizontally <span>or drag a page edge ↔</span></>}</p></div></main>
    <div className="prototype-switcher" aria-label="Prototype design directions"><span className="prototype-badge">Prototype</span><button onClick={()=>switchVariant(-1)} aria-label="Previous design direction">‹</button><div><strong>{direction.key} — {direction.name}</strong><span>{direction.description}</span></div><button onClick={()=>switchVariant(1)} aria-label="Next design direction">›</button><span className="variant-count">{directions.findIndex(d=>d.key===variant)+1}/{directions.length}</span></div>
    {contents&&<div className="contents-overlay" id="issue-contents"><div className="contents-heading"><span className="mini-label">Inside this issue</span><h2>Contents.</h2></div><nav aria-label="Magazine contents"><button onClick={()=>{setContents(false);go(-1)}} aria-current={spread===-1?'page':undefined}><span>Cover</span><strong>Return to the cover</strong><span>↶</span></button>{names.map((name,i)=><button key={i} onClick={()=>{setContents(false);go(i)}} aria-current={spread===i?'page':undefined}><span>{pad(i*2+1)}—{pad(i*2+2)}</span><strong>{name}</strong><span>↗</span></button>)}</nav><p>One spread per chapter. Take your time.</p></div>}
  </div>;
}
