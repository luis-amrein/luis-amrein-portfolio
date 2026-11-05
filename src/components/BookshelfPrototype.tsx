// Prototype: compare stacked volumes, upright spines and face-out covers on the existing project lists.
import { useEffect, useRef, useState } from 'react';
import './bookshelf-prototype.css';

export type ShelfProject = {
  id: string; title: string; eyebrow: string; outcomeLabel: string; summary?: string; outcome?: string;
};
const variants = ['Stacked volumes', 'Upright library', 'Face-out collection'];

function Volume({ project, index, base }: { project: ShelfProject; index: number; base: string }) {
  const book = useRef<HTMLDivElement>(null);
  const motion = useRef({ value: 0, velocity: 0, target: 0, frame: 0 });
  useEffect(() => () => cancelAnimationFrame(motion.current.frame), []);
  const pull = (target: number) => {
    const state = motion.current;
    state.target = target;
    if (target) book.current?.parentElement?.style.setProperty('z-index', '20');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      book.current?.style.setProperty('--pull', String(target));
      return;
    }
    if (state.frame) return;
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.032); last = now;
      // A damped spring gives the heavy volume a gentle settling motion.
      state.velocity += ((state.target - state.value) * 115 - state.velocity * 18) * dt;
      state.value += state.velocity * dt;
      book.current?.style.setProperty('--pull', state.value.toFixed(4));
      if (Math.abs(state.target - state.value) > .001 || Math.abs(state.velocity) > .001) {
        state.frame = requestAnimationFrame(step);
      } else {
        state.frame = 0; state.value = state.target;
        if (!state.target) book.current?.parentElement?.style.removeProperty('z-index');
      }
    };
    state.frame = requestAnimationFrame(step);
  };
  return (
    <a className="shelf-volume" href={`${base}work/${project.id}/`} data-binding={index % 7}
      onPointerEnter={(event) => { if (event.pointerType !== 'touch') pull(1); }}
      onPointerLeave={() => pull(0)} onFocus={() => pull(1)} onBlur={() => pull(0)}>
      <div className="shelf-book" ref={book}>
        <div className="book-pages" aria-hidden="true" />
        <div className="book-tail" aria-hidden="true" />
        <div className="book-spine">
          <span className="book-number">{String(index + 1).padStart(2, '0')}<i />LA</span>
          <div className="book-title-block">
            <span className="book-category">{project.eyebrow}</span>
            <h3>{project.title}</h3>
          </div>
          <div className="book-description"><strong>{project.outcomeLabel}</strong><span>{project.summary ?? project.outcome}</span></div>
          <span className="book-mark" aria-hidden="true">↗</span>
          <span className="book-edition" aria-hidden="true">LUIS AMREIN · SELECTED WORK</span>
        </div>
      </div>
    </a>
  );
}

export default function BookshelfPrototype({ projects, base }: { projects: ShelfProject[]; base: string }) {
  const [variant, setVariant] = useState(0);
  useEffect(() => {
    const read = () => setVariant(Math.max(0, ['stacked', 'upright', 'covers'].indexOf(new URLSearchParams(location.search).get('variant') ?? 'stacked')));
    read(); window.addEventListener('popstate', read);
    return () => window.removeEventListener('popstate', read);
  }, []);
  const change = (next: number) => {
    next = (next + 3) % 3; setVariant(next);
    const url = new URL(location.href); url.searchParams.set('variant', ['stacked', 'upright', 'covers'][next]); history.replaceState(null, '', url);
  };
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest('input, textarea, select, [contenteditable="true"]')) return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault(); change(variant + (event.key === 'ArrowRight' ? 1 : -1));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [variant]);
  return (
    <>
      <div className={`bookshelf-prototype shelf-variant-${variant}`}>
        <div className="shelf-inscription" aria-hidden="true"><span>THE WORK COLLECTION</span><span>{String(projects.length).padStart(2, '0')} VOLUMES · PULL TO EXPLORE</span></div>
        <div className="shelf-cabinet">
          {projects.map((project, index) => <Volume project={project} index={index} base={base} key={project.id} />)}
        </div>
        <div className="shelf-plinth" aria-hidden="true" />
      </div>
      {import.meta.env.DEV && <div className="shelf-switcher" aria-label="Bookshelf prototype variants">
        <span className="shelf-prototype-label">EXPERIMENT</span>
        <button onClick={() => change(variant - 1)} aria-label="Previous shelf variant">←</button>
        <span>{variants[variant]}</span>
        <button onClick={() => change(variant + 1)} aria-label="Next shelf variant">→</button>
      </div>}
    </>
  );
}
