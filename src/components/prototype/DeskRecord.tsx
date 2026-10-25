import { memo, useEffect, useRef, useState } from 'react';

function DeskRecord({src,artBase,inactive=false}:{src:string;artBase:string;inactive?:boolean}) {
  const player = useRef<HTMLAudioElement>(null);
  const fade = useRef(0);
  const active = useRef(false);
  const revision = useRef(0);
  const [engaged,setEngaged] = useState(false);
  const [failed,setFailed] = useState(false);
  useEffect(()=>()=>{cancelAnimationFrame(fade.current);player.current?.pause()},[]);
  async function toggle() {
    const audio=player.current;
    if(!audio)return;
    cancelAnimationFrame(fade.current);
    const request=++revision.current;
    const next=!active.current;
    active.current=next;setEngaged(next);setFailed(false);
    if(next) {
      audio.volume=0;
      try { await audio.play() } catch {if(request===revision.current){active.current=false;setEngaged(false);setFailed(true)}return}
      if(!active.current||request!==revision.current)return;
    }
    const start=performance.now(),from=audio.volume;
    const step=(now:number)=>{
      const progress=Math.max(0,Math.min(1,(now-start-(next?700:0))/(next?1100:450)));
      audio.volume=next?progress*.55:from*(1-progress);
      if(progress<1)fade.current=requestAnimationFrame(step);
      else if(!next)audio.pause();
    };
    fade.current=requestAnimationFrame(step);
  }
  return <aside className={`desk-record ${engaged?'needle-down':''}`} aria-label="Record player" inert={inactive||undefined} aria-hidden={inactive||undefined}>
    <audio ref={player} src={src} preload="none" loop/>
    <div className="vinyl-platter" aria-hidden="true">
      <img className="vinyl-photograph" src={`${artBase}/vinyl-photo-v2.webp`} alt=""/>
      <svg className="vinyl-surface-motion" viewBox="0 0 1000 1000" fill="none">
        {Array.from({length:42},(_,i)=>{
          const radius=220+(i*47%220),a=i*2.399963,b=a+.015+(i%4)*.007;
          const x=500+radius*Math.cos(a),y=500+radius*Math.sin(a);
          return <g key={i}>
            <path d={`M${x} ${y}A${radius} ${radius} 0 0 1 ${500+radius*Math.cos(b)} ${500+radius*Math.sin(b)}`} stroke={i%3?'#d7ddcd':'#020503'} strokeWidth={i%3?.65:1.1} opacity={i%3?.22:.4}/>
            {i%4===0&&<circle cx={x} cy={y} r=".85" fill="#e2e2cc" opacity=".28"/>}
          </g>
        })}
      </svg>
      <div className="vinyl-label"><span className="vinyl-label-art"/></div>
      <svg className="platter-strobe" viewBox="0 0 1000 1000" fill="none">
        <defs><linearGradient id="rim-silver" x1="100" y1="0" x2="900" y2="1000" gradientUnits="userSpaceOnUse"><stop stopColor="#ece4cc"/><stop offset=".3" stopColor="#777c73"/><stop offset=".55" stopColor="#e1ded1"/><stop offset="1" stopColor="#474d45"/></linearGradient></defs>
        <circle cx="500" cy="500" r="495" stroke="url(#rim-silver)" strokeWidth="10"/>
        <circle cx="500" cy="500" r="478" stroke="#171b18" strokeWidth="26"/>
        {[{r:487,count:180},{r:478,count:186},{r:469,count:192}].map((row,j)=><g className={`strobe-row strobe-row-${j}`} key={row.r}>
          {Array.from({length:row.count},(_,i)=>{const a=i/row.count*Math.PI*2;return <circle key={i} cx={500+row.r*Math.cos(a)} cy={500+row.r*Math.sin(a)} r={j===1?2.5:1.9} fill="#c5c6b7"/>})}
        </g>)}
        <circle cx="500" cy="500" r="460" stroke="url(#rim-silver)" strokeWidth="3"/>
      </svg>
      <div className="platter-light"/>
    </div>
    <button className="tonearm" onClick={toggle} aria-label={engaged?'Lift needle and pause jazz':'Lower needle and play smooth jazz'} aria-pressed={engaged}>
      <img src={`${artBase}/tonearm-photo-v3.webp`} alt="" draggable={false}/>
    </button>
    <span className="sr-only" role="status">{failed?'Music could not start. Click the tonearm to retry.':engaged?'Jazz playing':'Jazz paused'}</span>
  </aside>;
}

export default memo(DeskRecord);
