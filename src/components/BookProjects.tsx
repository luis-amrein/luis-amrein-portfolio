import { useEffect, useRef } from 'react';
import './book-projects.css';

export type ShelfProject = {
  id: string; title: string; eyebrow: string; outcomeLabel: string; summary?: string; outcome?: string;
};
// Every newly activated book must paint above all volumes still returning to the stack.
let frontLayer = 0;

// Stable artwork identities: filtering never changes a project's cover.
const artworkByProject: Record<string, number> = {
  habbit: 0,
  'voluntary-carbon-marketplace': 1,
  'adjustable-knee-prosthesis': 2,
  persephone: 3,
  'medwing-registration': 4,
  'habit-tracker': 5,
  'medwing-recommendations': 6,
};

function BookArtwork({ design }: { design: number }) {
  return (
    <svg className="book-artwork" viewBox="0 0 440 145" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      {design === 0 && <>
        <circle cx="310" cy="98" r="87" className="art-red" />
        <path d="M310 11a87 87 0 0 1 0 174Z" className="art-ink" />
        <circle cx="405" cy="20" r="40" className="art-yellow" />
        <path d="M176 20h60v12h-60zm0 22h60v12h-60zm0 22h60v12h-60z" className="art-blue" />
      </>}
      {design === 1 && <>
        <path d="M165 145 248-13l83 158Z" className="art-blue" />
        <path d="m262 145 83-158 83 158Z" className="art-yellow" />
        <circle cx="345" cy="90" r="35" className="art-red" />
        <path d="M403 0h13v145h-13Z" className="art-ink" />
      </>}
      {design === 2 && <>
        <path d="M200 145V-18h163v163h-26V8H226v137Zm40 0V22h109v123h-22V44h-65v101Z" className="art-ink" />
        <rect x="271" y="55" width="47" height="90" className="art-red" />
        <circle cx="401" cy="36" r="39" className="art-blue" />
        <rect x="376" y="102" width="64" height="43" className="art-yellow" />
      </>}
      {design === 3 && <>
        <path d="M198 0h79v145h-79Z" className="art-red" />
        <path d="M277 0a73 73 0 0 1 0 146Z" className="art-blue" />
        <path d="M350 0h90v73h-90Z" className="art-yellow" />
        <path d="M350 73h90v72h-90Z" className="art-ink" />
        <circle cx="394" cy="109" r="25" className="art-paper" />
      </>}
      {design === 4 && <>
        <path d="M165 145v-29h41V87h41V58h41V29h41V0h41v145Z" className="art-blue" />
        <circle cx="372" cy="43" r="47" className="art-red" />
        <path d="M320 145v-30h40V85h40V55h40v90Z" className="art-yellow" />
        <path d="M175 20h78v9h-78zm0 18h58v9h-58z" className="art-ink" />
      </>}
      {design === 5 && <>
        <circle cx="311" cy="72" r="102" className="art-red" />
        <circle cx="311" cy="72" r="77" className="art-paper" />
        <circle cx="311" cy="72" r="53" className="art-blue" />
        <circle cx="311" cy="72" r="28" className="art-yellow" />
        <path d="M304-20h14v185h-14Z" className="art-ink" />
      </>}
      {design === 6 && <>
        <path d="M178 0h87v73h-87Z" className="art-blue" />
        <path d="M265 0h87v73h-87Z" className="art-yellow" />
        <path d="M352 0h88v73h-88Z" className="art-red" />
        <path d="M178 73a87 87 0 0 0 174 0Z" className="art-red" />
        <path d="M265 73a87 87 0 0 0 174 0Z" className="art-ink" />
        <circle cx="221" cy="36" r="23" className="art-paper" />
      </>}
    </svg>
  );
}

function Volume({ project, index, base }: { project: ShelfProject; index: number; base: string }) {
  const design = artworkByProject[project.id] ?? index % 7;
  const book = useRef<HTMLDivElement>(null);
  const interaction = useRef({ hover: false, focus: false });
  const motion = useRef({ value: 0, velocity: 0, target: 0, frame: 0 });
  useEffect(() => () => cancelAnimationFrame(motion.current.frame), []);
  const pull = (target: number, activate: boolean) => {
    const state = motion.current;
    state.target = target;
    const link = book.current?.parentElement;
    if (target && link) {
      if (activate) link.style.zIndex = String(++frontLayer);
      // A centered, frontal pull grows exactly to the viewport edges.
      link.style.setProperty('--pull-scale', String(Math.max(0, window.innerWidth / link.getBoundingClientRect().width - 1)));
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cancelAnimationFrame(state.frame); state.frame = 0; state.value = target; state.velocity = 0;
      book.current?.style.setProperty('--pull', String(target));
      if (!target) link?.style.removeProperty('z-index');
      return;
    }
    if (state.frame) return;
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.032); last = now;
      // A damped spring gives the heavy volume a gentle settling motion.
      state.velocity += ((state.target - state.value) * 115 - state.velocity * 22) * dt;
      state.value += state.velocity * dt;
      book.current?.style.setProperty('--pull', state.value.toFixed(4));
      if (Math.abs(state.target - state.value) > .001 || Math.abs(state.velocity) > .001) {
        state.frame = requestAnimationFrame(step);
      } else {
        state.frame = 0; state.value = state.target; state.velocity = 0;
        book.current?.style.setProperty('--pull', String(state.target));
        if (!state.target) book.current?.parentElement?.style.removeProperty('z-index');
      }
    };
    state.frame = requestAnimationFrame(step);
  };
  const updateInteraction = (kind: 'hover' | 'focus', active: boolean) => {
    interaction.current[kind] = active;
    pull(interaction.current.hover || interaction.current.focus ? 1 : 0, active);
  };
  return (
    <a className="shelf-volume" href={`${base}work/${project.id}/`} data-binding={design}
      onPointerEnter={(event) => { if (event.pointerType !== 'touch') updateInteraction('hover', true); }}
      onPointerLeave={() => updateInteraction('hover', false)}
      onFocus={() => updateInteraction('focus', true)} onBlur={() => updateInteraction('focus', false)}>
      <div className="shelf-book" ref={book}>
        <div className="book-spine">
          <BookArtwork design={design} />
          <span className="book-number"><span>{String(index + 1).padStart(2, '0')}</span><span className="book-author-mark">LA</span></span>
          <div className="book-title-block">
            <span className="book-category">{project.eyebrow}</span>
            <h3>{project.title}</h3>
          </div>
          <div className="book-description"><strong>{project.outcomeLabel}</strong><span>{project.summary ?? project.outcome}</span></div>
          <span className="book-mark" aria-hidden="true">↗</span>
        </div>
      </div>
    </a>
  );
}

export default function BookProjects({ projects, base }: { projects: ShelfProject[]; base: string }) {
  return (
    <div className="book-projects">
      <div className="book-stack">
        {projects.map((project, index) => <Volume project={project} index={index} base={base} key={project.id} />)}
      </div>
    </div>
  );
}
