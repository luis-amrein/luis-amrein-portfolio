import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { flushSync } from 'react-dom';
import './magazine-prototype.css';
import './engineering-drawing.css';
import DeskRecord from './DeskRecord';
import { DrawingFrame, EngineeringPortrait, EngineeringContents } from './EngineeringDrawing';
type Project = { id:string; title:string; eyebrow:string; summary:string; year:string; role:string; challenge:string; outcome:string; outcomeLabel:string; tags:string[]; showcase?:{type:string;src:string;alt:string}[] };
type Props = { projects:Project[]; portrait:string; base:string };
type Turn = { to:number; direction:number; corner:number };
type Motion = Turn & {from:number;animation?:Animation;shading?:Animation};
const directions = [
 {key:'D',name:'The Luis Issue',description:'Art journal × fashion issue · coral & green · sculpted paper'},
 {key:'E',name:'The Drawing Set',description:'Technische Zeichnung · Maschinenbau · Schnittstellen'},
 {key:'A',name:'The Editorial',description:'Warm paper · serif headlines · quiet tension'},
 {key:'B',name:'The Fashion Issue',description:'Full-bleed portraits · oversized type · high contrast'},
 {key:'C',name:'The Art Journal',description:'Coral · graphic compositions · radical scale'}
];
const pad=(n:number)=>String(n).padStart(2,'0');
// A delayed/cancelled Web Animations completion must never lock navigation.
function animationComplete(animation:Animation|undefined|null,duration:number){
  if(!animation)return Promise.resolve();
  return new Promise<void>(resolve=>{
    const done=()=>{window.clearTimeout(timeout);resolve()};
    const timeout=window.setTimeout(done,duration+250);
    animation.finished.then(done,done);
  });
}
export default function MagazinePrototype({projects,portrait,base}:Props){
 const initial=new URLSearchParams(window.location.search).get('variant')||'D';
 const [variant,setVariant]=useState(directions.some(d=>d.key===initial)?initial:'D');
 const [coverDesign,setCoverDesign]=useState(Math.max(1,Math.min(5,parseInt(new URLSearchParams(window.location.search).get('cover')||'1',10)||1)));
 const coverNames=['Gezeiten','Drucknebel','Grünes Band','Eclipse','Kreidestaub'];
 const [spread,setSpread]=useState(-1);
 const [turn,setTurn]=useState<Turn|null>(null);
 const [contents,setContents]=useState(false);
 const [immersive,setImmersive]=useState(false);
 const [deskReady,setDeskReady]=useState(true);
 const [cameraMoving,setCameraMoving]=useState(false);
 const cameraStage=useRef<HTMLDivElement>(null);
 const immersiveRef=useRef(immersive);
 const zoomFrom=useRef<DOMRect|null>(null);
 const zoomAnimation=useRef<Animation|null>(null);
 const deskWorld=useRef<HTMLDivElement>(null);
 const worldAnimation=useRef<Animation|null>(null);
 const worldZoom=useRef('translate(0px,0px) scale(1,1)');
 const [slow,setSlow]=useState(new URLSearchParams(window.location.search).get('motion')==='slow');
 const [lampOn,setLampOn]=useState(true);
 const [reduced,setReduced]=useState(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
 const [portraitMode,setPortraitMode]=useState(window.matchMedia('(orientation: portrait)').matches);
  const sheet = useRef<HTMLDivElement>(null);
  const book = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const motion = useRef<Motion | null>(null);
  const swipe=useRef<{x:number;y:number}|null>(null);
  const wheel=useRef({last:0,locked:false,amount:0});
  const previousPortrait=useRef(portraitMode);
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
      zoomAnimation.current?.cancel();worldAnimation.current?.cancel();
      motion.current?.animation?.cancel();motion.current?.shading?.cancel();motion.current=null;busy.current=false;
    };
  }, []);

  function readingView(open:boolean) {
    if(open===immersiveRef.current)return;
    immersiveRef.current=open;
    setCameraMoving(!reduced);
    zoomFrom.current=book.current?.getBoundingClientRect()||null;
    zoomAnimation.current?.cancel();
    setImmersive(open);
  }
  useLayoutEffect(()=>{
    const element=book.current,from=zoomFrom.current;
    if(!element||!from)return;
    zoomFrom.current=null;
    const to=element.getBoundingClientRect();
    if(!to.width||!to.height){setCameraMoving(false);return;}
    const timing={duration:immersive?1450:1100,easing:'cubic-bezier(.32,0,.2,1)',fill:'none' as FillMode};
    const stage=cameraStage.current;
    if(!portraitMode&&stage){
      // Keep every page at its desk layout; the camera scales one shared scene.
      const start=stage.style.transform||'translate3d(0,0,0) scale(1,1)';
      if(immersive){
        const sx=window.innerWidth/from.width,sy=window.innerHeight/from.height;
        worldZoom.current=`translate3d(${-from.left*sx}px,${-from.top*sy}px,0) scale(${sx},${sy})`;
      }
      const target=immersive?worldZoom.current:'translate3d(0,0,0) scale(1,1)';
      if(deskWorld.current)deskWorld.current.style.transform='';
      stage.style.transform=target;
      if(!reduced)zoomAnimation.current=stage.animate([{transform:start},{transform:target}],timing);
      return;
    }
    if(stage)stage.style.transform='translate3d(0,0,0)';
    const world=deskWorld.current;
    const previousWorld=worldZoom.current;
    if(immersive){
      const sx=to.width/from.width,sy=to.height/from.height;
      worldZoom.current=`translate(${-from.left*sx}px,${-from.top*sy}px) scale(${sx},${sy})`;
    }
    const targetWorld=immersive?worldZoom.current:'translate(0px,0px) scale(1,1)';
    worldAnimation.current?.cancel();
    if(world)world.style.transform=targetWorld;
    if(reduced)return;
    zoomAnimation.current=element.animate([
      {transform:`translate3d(${from.left-to.left}px,${from.top-to.top}px,0) scale(${from.width/to.width},${from.height/to.height})`},
      {transform:'translate3d(0,0,0) scale(1,1)'}
    ],timing);
    if(world)worldAnimation.current=world.animate([
      {transform:immersive?'translate(0px,0px) scale(1,1)':previousWorld},
      {transform:targetWorld}
    ],timing);
  },[immersive,reduced,portraitMode]);
  useLayoutEffect(()=>{
    if(previousPortrait.current===portraitMode)return;
    previousPortrait.current=portraitMode;
    const stage=cameraStage.current,world=deskWorld.current,element=book.current;
    if(!stage||!world||!element)return;
    zoomAnimation.current?.cancel();worldAnimation.current?.cancel();
    stage.style.transform='translate3d(0,0,0)';world.style.transform='';
    if(!immersiveRef.current)return;
    if(portraitMode){world.style.transform=worldZoom.current;return;}
    const rect=element.getBoundingClientRect();
    if(!rect.width||!rect.height)return;
    const sx=window.innerWidth/rect.width,sy=window.innerHeight/rect.height;
    worldZoom.current=`translate3d(${-rect.left*sx}px,${-rect.top*sy}px,0) scale(${sx},${sy})`;
    stage.style.transform=worldZoom.current;
  },[portraitMode]);
  useEffect(()=>{
    if(portraitMode&&book.current)book.current.scrollTop=0;
  },[spread,portraitMode]);

  function selectVariant(next:string){
    if(busy.current)return;
    setVariant(next);
    const url = new URL(window.location.href); url.searchParams.set('variant', next);
    window.history.replaceState({}, '', url);
  }
  function switchVariant(step:number){selectVariant(directions[(directions.findIndex(d=>d.key===variant)+step+directions.length)%directions.length].key)}

  async function finishTurn(m:Motion,committed:boolean){
    if(motion.current!==m)return;
    const cameraChange=committed&&(m.from===-1||m.to===-1);
    flushSync(()=>{
      if(committed)setSpread(m.to);
      if(!cameraChange)readingView((committed?m.to:m.from)>=0);
      setTurn(null);
    });
    m.animation?.cancel();m.shading?.cancel();
    if(cameraChange){
      // Let the complete spread rest on the desk before the camera moves.
      await new Promise(resolve=>window.setTimeout(resolve,220));
      if(motion.current!==m)return;
      flushSync(()=>readingView(m.to>=0));
      await animationComplete(zoomAnimation.current,m.to>=0?1450:1100);
      if(motion.current!==m)return;
    }
    motion.current=null;busy.current=false;swipe.current=null;
    setCameraMoving(false);
    setDeskReady((committed?m.to:m.from)===-1);
  }

  function go(to:number){
    if(busy.current||to===spread||to< -1||to>=total)return;
    setContents(false);
    if(reduced){readingView(to>=0);setSpread(to);setDeskReady(to===-1);return;}
    setDeskReady(false);
    busy.current=true;
    const m:Motion={to,from:spread,direction:to>spread?1:-1,corner:0};
    motion.current=m;
    if(portraitMode&&book.current)book.current.scrollTop=0;
    if(spread!==-1&&to!==-1)readingView(to>=0);
    setTurn({to,direction:m.direction,corner:0});
  }

  useLayoutEffect(()=>{
    const m=motion.current,element=sheet.current;
    if(!turn||!m||!element)return;
    const sign=-m.direction;
    // The browser replays the same transform-only timeline for every turn.
    const keyframes:Keyframe[]=portraitMode?[{transform:'translateX(0)',opacity:1},{transform:`translateX(${sign*100}%)`,opacity:0}]:[
      {transform:'rotateY(0deg) rotateZ(0deg)',offset:0},
      {transform:`rotateY(${sign*32}deg) rotateZ(${sign*.5}deg)`,offset:.25},
      {transform:`rotateY(${sign*90}deg) rotateZ(${sign*.9}deg)`,offset:.5},
      {transform:`rotateY(${sign*151}deg) rotateZ(${sign*.35}deg)`,offset:.75},
      {transform:`rotateY(${sign*180}deg) rotateZ(0deg)`,offset:1}
    ];
    m.animation=element.animate(keyframes,{duration:slow?1800:860,easing:'cubic-bezier(.4,.05,.2,1)',fill:'forwards'});
    const shade=element.querySelector<HTMLElement>('.turn-shading');
    if(shade)m.shading=shade.animate([{opacity:0},{opacity:.65,offset:.5},{opacity:0}],{duration:slow?1800:860,easing:'ease-in-out',fill:'forwards'});
    animationComplete(m.animation,slow?1800:860).then(()=>finishTurn(m,true));
  },[turn]);

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
      if (contents || e.ctrlKey || (e.target as HTMLElement).closest('.contents-overlay,.desk-record,.desk-lamp')) return;
      const horizontal = spread === -1 ? (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY) : e.shiftKey ? (e.deltaX || e.deltaY) : e.deltaX;
      if (spread !== -1 && !e.shiftKey && Math.abs(horizontal) <= Math.abs(e.deltaY) * .75) return;
      if (Math.abs(horizontal) < .1) return;
      e.preventDefault();
      const now=performance.now(),session=wheel.current;
      if(now-session.last>300){session.locked=false;session.amount=0;}
      session.last=now;
      if(session.locked||busy.current)return;
      session.amount+=horizontal*(e.deltaMode===1?16:e.deltaMode===2?window.innerWidth:1);
      if(Math.abs(session.amount)<24)return;
      session.locked=true;
      go(spread+Math.sign(session.amount));
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('wheel', onWheel); };
  }, [spread, variant, slow, reduced, portraitMode, contents]);

  function pointerDown(e:React.PointerEvent<HTMLDivElement>){
    if(busy.current||e.button!==0||(e.target as HTMLElement).closest('a,button:not(.cover-hitarea)'))return;
    swipe.current={x:e.clientX,y:e.clientY};
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function pointerUp(e:React.PointerEvent<HTMLDivElement>,cancel=false){
    const start=swipe.current;swipe.current=null;
    if(!start||cancel||busy.current)return;
    const dx=e.clientX-start.x,dy=e.clientY-start.y;
    if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy))go(spread+(dx<0?1:-1));
    else if(spread===-1&&Math.hypot(dx,dy)<12)go(0);
  }

  function Folio({index,side,name}:{index:number;side:number;name:string}){
    return <footer className="folio"><span>{side===0?'Luis Amrein':name}</span><span>{pad(index*2+side+1)}</span></footer>;
  }
  function Hero({side}:{side:number}){
    return side===0?<div className="page-inner opening-copy"><img className="cover-halftone" src={asset(`prototype/cover-halftone-${pad(coverDesign)}.svg`)} alt="" aria-hidden="true" draggable={false}/><div className="running-head"><span>Independent portfolio</span><span>Berlin, DE</span></div><div className="cover-title"><span className="edition">Volume 01 / A work in progress</span><h1>Making<br/>products<br/><em>make sense.</em></h1><span className="cover-star" aria-hidden="true">✳</span></div><div className="cover-bottom"><span className="byline">Luis<br/>Amrein</span><p>Product thinking.<br/>An engineering mind.<br/>A curious human.</p></div>{Folio({index:0,side:0,name:'Opening'})}</div>:<div className="page-inner opening-image"><img className="hero-portrait" src={portrait} alt="Luis Amrein" draggable="false"/><div className="image-annotation"><span>Fig. 01 — The person behind the products</span><span>52° 31′ N, 13° 24′ E</span></div><div className="cover-note"><span className="mini-label">A note from Luis</span><p>I work where people,<br/>systems, and <em>possibility</em><br/>meet.</p><span>Currently shaping digital health at Caspar Health.</span></div><div className="art-cover-word" aria-hidden="true">SENSE</div>{Folio({index:0,side:0,name:'An introduction'})}</div>;
  }
  function Work({side}:{side:number}){
    const list=side===0?projects.slice(0,4):projects.slice(4);
    return <div className={`page-inner work-page work-${side}`}><div className="running-head"><span>01 / Selected work</span><span>2020—2026</span></div>{side===0?<><h2 className="editorial-title">A few things<br/><em>put into<br/>the world.</em></h2><p className="section-intro">From the habits we keep to the systems we depend on. A selection of products I shipped, shaped, or steered.</p></>:<button className="work-feature" onClick={()=>go(3)} aria-label="Open Habbit spread"><div className="phone-composition"><span className="composition-word">small<br/><i>rituals.</i></span><img src={asset('work/habbit/screen-03.jpg')} alt="Habbit app showing habit progress" draggable="false"/></div><span className="feature-caption">01 / Habbit — a kinder kind of consistency <span>↗</span></span></button>}<div className={`contents-list ${side?'secondary-list':''}`}>{list.map((p,i)=>{const n=i+(side?4:0);return <button key={p.id} onClick={()=>go(n+3)}><span>{pad(n+1)}</span><span>{p.title}<small>{p.tags.slice(0,2).join(' / ')}</small></span><span>{pad((n+3)*2+1)} ↗</span></button>})}</div>{Folio({index:1,side:side,name:'Selected work'})}</div>;
  }
  function About({side}:{side:number}){
    return <div className={`page-inner about-page about-${side}`}><div className="running-head"><span>02 / The person</span><span>Always curious</span></div>{side===0?<><div className="about-photo"><img src={portrait} alt="Portrait of Luis Amrein" draggable="false"/><span>Fig. 02 / Luis, in real life.</span></div><h2 className="editorial-title">More than<br/><em>a roadmap.</em></h2></>:<><p className="about-pullquote">Technical enough<br/>to build it.<br/><em>Product enough<br/>to kill it.</em></p><div className="article-columns"><p>My path into product started with engineering: automated vehicles, ergonomics, medical technology, and a knee prosthesis designed for humanitarian use.</p><p>Today, product management is where my favourite things meet: empathy, design, technology, creativity, and evidence.</p></div><div className="off-clock"><span className="mini-label">Away from the screen</span><p>Gravel rides. Piano lessons.<br/>Portuguese. Music. Making things.</p></div><a className="editorial-link" href="mailto:luis.amrein@hotmail.de">Let’s make something make sense. ↗</a></>}{Folio({index:2,side:side,name:'About Luis'})}</div>;
  }
  function ProjectPage({index,side}:{index:number;side:number}){
    const p=projects[index-3], image=p.showcase?.find(s=>s.type==='image');
    return <div className={`page-inner project-page project-${side}`}><div className="running-head"><span>Project / {pad(index-2)}</span><span>{p.year}</span></div>{side===0?<><span className="project-category">{p.eyebrow}</span><h2 className={`editorial-title project-title ${p.title.split(' ').some(w=>w.length>12)?'long-word':''}`}>{p.title}</h2><p className="project-summary">{p.summary}</p><div className="project-role"><span className="mini-label">My role</span><p>{p.role}</p></div><span className="project-number" aria-hidden="true">{pad(index-2)}</span></>:<>{image?<figure className={`project-visual ${p.id.includes('habbit')?'mobile-visual':''}`}><img src={asset(image.src)} alt={image.alt} draggable="false"/><figcaption>Fig. {pad(index-2)} / {p.title}</figcaption></figure>:<div className="project-type-art" aria-label={p.outcomeLabel}><span>{p.tags[0]}</span><strong>{p.id.includes('recommendations')?'3×':p.id.includes('registration')?'+40%':'0→1'}</strong><span>{p.outcomeLabel}</span></div>}<div className="project-story"><div><span className="mini-label">The question</span><p>{p.challenge}</p></div><div><span className="mini-label">The result</span><p>{p.outcome}</p></div></div></>}{Folio({index:index,side:side,name:p.title})}</div>;
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
      {Folio({index:0,side:1,name:'Contents'})}
    </div>;
  }
  function Page({index,side,face=''}:{index:number;side:number;face?:string}){
    const kind = index===-1 ? (side===0?'cover-whitespace':'closed-cover') : '';
    return <div key={`${index}:${side}:${face}`} className={`magazine-page side-${side} ${kind} ${face}`} aria-hidden={!!face||index===-1&&side===0||undefined} inert={!!face||undefined}>
      {index===-1?(side===0?null:Hero({side:0})):index===0?(variant==='E'?(side===0?<EngineeringPortrait portrait={portrait}/>:<EngineeringContents names={names} onSelect={go}/>):(side===0?Hero({side:1}):IssueContents())):index===1?Work({side}):index===2?About({side}):ProjectPage({index,side})}
      {variant==='E'&&index>=0&&<DrawingFrame sheet={index*2+side+1} title={index===0?(side===0?'Systemübersicht / Luis Amrein':'Zeichnungsverzeichnis'):names[index]}/>}
    </div>;
  }
  return <div className={`magazine-app desk-scene ${immersive?'reader-open':''} ${cameraMoving?'camera-moving':''} ${spread===-1?'is-landing':''} ${lampOn?'lamp-on':'lamp-off'} ${variant==='D'||variant==='E'?`variant-C variant-D ${variant==='E'?'variant-E':''}`:`variant-${variant}`}`} style={{'--desk-texture':`url("${asset('prototype/walnut-desk-v1.webp')}")`} as CSSProperties}>
    {!cameraMoving&&!turn&&<nav className="design-comparison" aria-label="Magazindesign vergleichen"><button aria-pressed={variant!=='E'} onClick={()=>selectVariant('D')}>Magazin</button><button aria-pressed={variant==='E'} onClick={()=>selectVariant('E')}>Technische Zeichnung</button></nav>}
    {immersive&&<button className="reader-exit" onClick={()=>go(-1)} aria-label="Close magazine and return to the desk" title="Back to desk">↙</button>}
    <div className="camera-stage" ref={cameraStage}>
    <div className="desk-world" ref={deskWorld}>
    <DeskRecord src={asset('prototype/backbay-lounge.mp3')} artBase={asset('prototype')} inactive={immersive}/>
    <div className="desk-light-falloff" aria-hidden="true"/>
    <aside className="desk-lamp" aria-label="Desk lamp" inert={immersive||undefined} aria-hidden={immersive||undefined}>
      <span className="lamp-stem" aria-hidden="true"/>
      <div className="lamp-switch-recess">
        <button className="lamp-rocker" role="switch" aria-checked={lampOn} aria-label="Desk light" onClick={()=>setLampOn(!lampOn)}>
          <span className="rocker-symbol rocker-on" aria-hidden="true">I</span>
          <span className="rocker-symbol rocker-off" aria-hidden="true">O</span>
        </button>
      </div>
      <span className="lamp-status" aria-hidden="true">{lampOn?'LIGHT ON':'LIGHT OFF'}</span>
    </aside>
    </div>
    <header className="reader-header"><a href={base} className="reader-brand">LA<span> / PORTFOLIO</span></a><div className="reader-edition">The magazine experiment <span>— Issue No. 01</span></div><button className="contents-toggle" onClick={()=>setContents(!contents)} aria-expanded={contents} aria-controls="issue-contents">{contents?'Close':'Contents'} <span>{contents?'×':'☰'}</span></button></header>
    <main className="reader-main"><div className="spread-topline"><span>{spread===-1?'The cover':`${pad(spread+1)} / ${names[spread]}`}</span><span>Product, people & everything in between.</span></div><div className={`magazine-book ${turn?'is-turning':''} ${spread===-1?'is-closed':''} ${turn?.to===-1?'is-closing':''}`} ref={book} onPointerDown={pointerDown} onPointerUp={e=>pointerUp(e)} onPointerCancel={e=>pointerUp(e,true)} aria-label={spread===-1?'Closed magazine cover':`Magazine spread ${spread+1}: ${names[spread]}`}><div className="book-base">{Page({index:turn&&(portraitMode||turn.direction<0)?turn.to:spread,side:0})}{Page({index:turn&&(portraitMode||turn.direction>0)?turn.to:spread,side:1})}</div>{turn&&<div className={`turning-sheet ${turn.direction>0?'forward':'backward'}`} ref={sheet}>{Page({index:spread,side:spread===-1?1:portraitMode?0:turn.direction>0?1:0,face:"sheet-front"})}{Page({index:turn.to,side:turn.to===-1?1:portraitMode?0:turn.direction>0?0:1,face:"sheet-back"})}<div className="turn-shading"/><div className="back-shading"/></div>}
      {spread===-1&&!turn&&!immersive&&deskReady&&<>
        <button className="open-invitation liquid-2 invitation-selected" onClick={()=>go(0)} aria-label="Open me — open the magazine">
          <span className="invitation-word">Open me</span>
        </button>
        <button className="cover-hitarea" onClick={()=>go(0)} aria-label="Open magazine cover"/>
      </>}
      <div className="book-spine" aria-hidden="true"/>{!turn&&spread>=0&&<button className="edge-turn edge-prev" aria-label="Turn to previous spread" onClick={()=>go(spread-1)}>↶</button>}{!turn&&spread>=0&&spread<total-1&&<button className="edge-turn edge-next" aria-label="Turn to next spread" onClick={()=>go(spread+1)}>↷</button>}</div>
    </main></div>
    <div className="reader-controls"><div className="motion-controls"><span className="small-dot"/>{reduced?'Reduced motion':'Sculpted paper'}<button onClick={()=>setSlow(!slow)} aria-pressed={slow}>{slow?'Slow study':'Natural pace'}</button></div><div className="paging"><button onClick={()=>go(spread-1)} disabled={spread===-1||!!turn} aria-label="Previous spread">←</button><span aria-live="polite">{spread===-1?'Cover':<>{pad(spread*2+1)} — {pad(spread*2+2)} <small>/ {pad(total*2)}</small></>}</span><button onClick={()=>go(spread+1)} disabled={spread===total-1||!!turn} aria-label="Next spread">→</button></div><p className="interaction-hint">{spread===-1?<>A little curiosity <span>opens a whole world.</span></>:<>Scroll horizontally <span>or swipe to turn ↔</span></>}</p></div>
    <div className="prototype-switcher" aria-label="Prototype design directions"><span className="prototype-badge">Prototype</span><button onClick={()=>switchVariant(-1)} aria-label="Previous design direction">‹</button><div><strong>{direction.key} — {direction.name}</strong><span>{direction.description}</span></div><button onClick={()=>switchVariant(1)} aria-label="Next design direction">›</button><span className="variant-count">{directions.findIndex(d=>d.key===variant)+1}/{directions.length}</span></div>
    {spread===-1&&deskReady&&!immersive&&<nav className="cover-studies" aria-label="Cover-Muster vergleichen"><span>{pad(coverDesign)} · {coverNames[coverDesign-1]}</span><div>{coverNames.map((name,i)=><button key={name} aria-label={`Cover ${i+1}: ${name}`} aria-pressed={coverDesign===i+1} onClick={()=>{setCoverDesign(i+1);const url=new URL(window.location.href);url.searchParams.set('cover',String(i+1));window.history.replaceState({},'',url)}}>{pad(i+1)}</button>)}</div></nav>}
    {contents&&<div className="contents-overlay" id="issue-contents"><div className="contents-heading"><span className="mini-label">Inside this issue</span><h2>Contents.</h2></div><nav aria-label="Magazine contents"><button onClick={()=>{setContents(false);go(-1)}} aria-current={spread===-1?'page':undefined}><span>Cover</span><strong>Return to the cover</strong><span>↶</span></button>{names.map((name,i)=><button key={i} onClick={()=>{setContents(false);go(i)}} aria-current={spread===i?'page':undefined}><span>{pad(i*2+1)}—{pad(i*2+2)}</span><strong>{name}</strong><span>↗</span></button>)}</nav><p>One spread per chapter. Take your time.</p><p className="music-credit">Music: <a href="https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1700068" target="_blank" rel="noreferrer">“Backbay Lounge” — Kevin MacLeod (incompetech.com)</a> · <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>. Playback volume fades in and out.</p></div>}
  </div>;
}
