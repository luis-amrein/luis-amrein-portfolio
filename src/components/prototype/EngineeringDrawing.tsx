/** Alternate interior study: an engineering drawing set, with schematic annotations. */
export function DrawingFrame({sheet,title}:{sheet:number;title:string}){
 return <div className="drawing-frame" aria-hidden="true">
  <div className="drawing-zones"><span>A</span><span>B</span><span>C</span><span>D</span></div>
  <div className="drawing-side-code">LA–{String(sheet).padStart(3,'0')} / PRODUKTENTWICKLUNG</div>
  <div className="drawing-titleblock"><div><small>BENENNUNG / TITLE</small><strong>{title}</strong></div><div><small>ZEICHNUNG / DRAWING</small><strong>LA–{String(sheet).padStart(3,'0')}</strong></div><div><small>REV.</small><strong>01</strong></div><div><small>BLATT / SHEET</small><strong>{String(sheet).padStart(2,'0')}</strong></div><span>LUIS AMREIN · BERLIN</span><span>SCHEMATISCH · NICHT MASSSTÄBLICH</span></div>
 </div>;
}
export function EngineeringPortrait({portrait}:{portrait:string}){
 return <div className="page-inner engineering-intro">
  <div className="running-head"><span>01 / Systemübersicht</span><span>Ansicht A</span></div>
  <div className="engineering-heading"><span className="mini-label">Product thinking × engineering</span><h2>MENSCH.<br/>SYSTEM.<br/><em>MÖGLICHKEIT.</em></h2></div>
  <figure className="engineering-portrait"><img src={portrait} alt="Luis Amrein" draggable={false}/><span className="portrait-section">A—A</span><span className="portrait-axis axis-horizontal"/><span className="portrait-axis axis-vertical"/><span className="portrait-dimension dimension-top">SCHNITTSTELLE MENSCH / SYSTEM</span><span className="portrait-dimension dimension-side">ANSICHT A · LUIS AMREIN</span><figcaption>FIG. 01 / DER MENSCH HINTER DEM PRODUKT</figcaption></figure>
  <div className="engineering-note"><span>01.1 / FUNKTION</span><p>I work where people, systems,<br/>and possibility meet.</p><small>Currently shaping digital health at Caspar Health.</small></div>
 </div>;
}
export function EngineeringContents({names,onSelect}:{names:string[];onSelect:(index:number)=>void}){
 return <div className="page-inner engineering-contents">
  <div className="running-head"><span>02 / Dokumentation</span><span>Gesamtübersicht</span></div>
  <span className="mini-label engineering-kicker">Portfolio / Zeichnungssatz 2020—2026</span>
  <h2 className="engineering-index-title">ZEICHNUNGS-<br/>VERZEICHNIS<span>↗</span></h2>
  <p className="engineering-index-note">Produkte, Prozesse und die Menschen dahinter.<br/>Ein Kapitel auswählen, um die Ansicht zu öffnen.</p>
  <div className="drawing-table-head"><span>POS.</span><span>BAUGRUPPE / KAPITEL</span><span>BLATT</span></div>
  <nav className="drawing-index" aria-label="Table of contents">{names.slice(1).map((name,i)=><button key={name} onClick={()=>onSelect(i+1)}><span>{String(i+1).padStart(2,'0')}</span><strong>{name}</strong><span>{String((i+1)*2+1).padStart(2,'0')} ↗</span></button>)}</nav>
  <div className="drawing-legend"><svg viewBox="0 0 95 40" aria-hidden="true"><path d="M5 8L45 15V25L5 32Z M5 8V32 M45 15V25"/><circle cx="73" cy="20" r="14"/><circle cx="73" cy="20" r="6"/><path d="M50 20H94 M73 1V39" strokeDasharray="3 2"/></svg><div><span>LESEHINWEIS</span><p>Jede Doppelseite bildet eine Einheit.<br/>Horizontal scrollen oder wischen.</p></div></div>
 </div>;
}
