import { useEffect, useRef, useState } from 'react';

export default function DeskRecord({src}:{src:string}) {
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
  return <aside className={`desk-record ${engaged?'needle-down':''}`} aria-label="Record player">
    <audio ref={player} src={src} preload="none" loop/>
    <div className="vinyl-platter" aria-hidden="true"><div className="vinyl-disc">
      <div className="vinyl-label"><span className="vinyl-label-art"/><span className="vinyl-spindle"/></div>
    </div><div className="vinyl-reflection"/></div>
    <button className="tonearm" onClick={toggle} aria-label={engaged?'Lift needle and pause jazz':'Lower needle and play smooth jazz'} aria-pressed={engaged}>
      <svg viewBox="0 0 260 280" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="arm-metal" x1="85" y1="85" x2="99" y2="72" gradientUnits="userSpaceOnUse"><stop stopColor="#424640"/><stop offset=".35" stopColor="#e1ded0"/><stop offset=".53" stopColor="#a7aaa0"/><stop offset=".7" stopColor="#f4edda"/><stop offset="1" stopColor="#555a52"/></linearGradient>
          <linearGradient id="needle-shell" x1="161" y1="163" x2="192" y2="194" gradientUnits="userSpaceOnUse"><stop stopColor="#4c5048"/><stop offset=".35" stopColor="#262b25"/><stop offset="1" stopColor="#090d0b"/></linearGradient>
          <radialGradient id="pivot-metal"><stop stopColor="#c5c5b6"/><stop offset=".5" stopColor="#4a5047"/><stop offset=".85" stopColor="#141914"/><stop offset="1" stopColor="#777b6e"/></radialGradient>
        </defs>
        <circle cx="25" cy="35" r="30" fill="#101410" stroke="#595e51" strokeWidth="2"/>
        <circle cx="25" cy="35" r="22" fill="url(#pivot-metal)"/>
        <path d="M25 35L117 126Q125 134 139 135L154 136Q162 137 168 146L185 174" stroke="#0b110c" strokeWidth="15"/>
        <path d="M25 35L117 126Q125 134 139 135L154 136Q162 137 168 146L185 174" stroke="url(#arm-metal)" strokeWidth="11"/>
        <path d="M27 33L120 125Q127 131 140 132" stroke="#fff5d9" strokeOpacity=".45" strokeWidth="1.2"/>
        <path d="M166 163L184 153L207 188L188 201Z" fill="url(#needle-shell)" stroke="#707666" strokeWidth=".8"/>
        <path d="M173 165L184 159M177 171L188 165M181 177L192 171" stroke="#979c8b" strokeOpacity=".55" strokeWidth="2"/>
        <path d="M197 171L214 164L220 168" stroke="#969c8c" strokeWidth="3" strokeLinecap="round"/>
        <path d="M188 194L194 202L201 198L198 187" fill="#ff5a36"/>
        <path d="M194 201L195 207" stroke="#eee3c4" strokeWidth="1.4"/>
        <path className="tonearm-hit" d="M25 35L120 130L157 136L194 192" stroke="transparent" strokeWidth="48"/>
      </svg>
    </button>
    <span className="sr-only" role="status">{failed?'Music could not start. Click the tonearm to retry.':engaged?'Jazz playing':'Jazz paused'}</span>
  </aside>;
}
