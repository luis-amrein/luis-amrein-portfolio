import { useEffect, useRef } from 'react';
import './book-projects.css';

export type ShelfProject = {
  id: string; title: string; eyebrow: string; outcomeLabel: string; summary?: string; outcome?: string;
};
// Every newly activated book must paint above all volumes still returning to the stack.
let frontLayer = 0;

function Volume({ project, index, base }: { project: ShelfProject; index: number; base: string }) {
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
    <a className="shelf-volume" href={`${base}work/${project.id}/`} data-binding={index % 7}
      onPointerEnter={(event) => { if (event.pointerType !== 'touch') updateInteraction('hover', true); }}
      onPointerLeave={() => updateInteraction('hover', false)}
      onFocus={() => updateInteraction('focus', true)} onBlur={() => updateInteraction('focus', false)}>
      <div className="shelf-book" ref={book}>
        <div className="book-spine">
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
