import { useEffect, useState } from 'react';
import Antigravity from './Antigravity.jsx';

export default function HeroAntigravity() {
  const [enabled, setEnabled] = useState(
    () =>
      typeof window !== 'undefined' &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const [paused, setPaused] = useState(false);
  const [anchor, setAnchor] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setEnabled(!media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const copy = document.querySelector('.hero h1');
    const field = document.querySelector('.hero-antigravity');
    if (!copy || !field) return;

    const updateAnchor = () => {
      const fieldRect = field.getBoundingClientRect();
      const copyRect = copy.getBoundingClientRect();
      if (fieldRect.width === 0 || fieldRect.height === 0) return;
      const x = ((copyRect.left + copyRect.width / 2 - fieldRect.left) / fieldRect.width) * 2 - 1;
      const y = -(((copyRect.top + copyRect.height / 2 - fieldRect.top) / fieldRect.height) * 2 - 1);
      setAnchor({ x, y });
    };

    updateAnchor();
    window.addEventListener('resize', updateAnchor);
    return () => window.removeEventListener('resize', updateAnchor);
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const hero = document.querySelector('.has-antigravity');
    if (!hero) return;

    let scrolling = false;
    let idleTimer = 0;
    let frame = 0;

    const heroIsExposed = () => {
      const next = hero.nextElementSibling;
      if (!next) return true;
      const header = document.querySelector('.site-header');
      const headerH = header?.getBoundingClientRect().height ?? 0;
      return next.getBoundingClientRect().top > headerH + 48;
    };

    const sync = () => {
      frame = 0;
      const hidden = document.hidden;
      setPaused(hidden || scrolling || !heroIsExposed());
    };

    const onScroll = () => {
      scrolling = true;
      if (!frame) frame = requestAnimationFrame(sync);
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        scrolling = false;
        sync();
      }, 160);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', sync);
    sync();

    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', sync);
      window.clearTimeout(idleTimer);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [enabled]);

  if (!enabled || !anchor) return null;

  return (
    <Antigravity
      paused={paused}
      anchor={anchor}
      count={220}
      magnetRadius={10}
      ringRadius={10}
      waveSpeed={0.4}
      waveAmplitude={1}
      particleSize={1}
      lerpSpeed={0.1}
      color="#ff5a36"
      autoAnimate={false}
      particleVariance={0.45}
      rotationSpeed={0}
      depthFactor={1}
      pulseSpeed={3}
      particleShape="capsule"
      fieldStrength={10}
    />
  );
}
