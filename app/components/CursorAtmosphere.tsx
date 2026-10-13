'use client';

import { useEffect } from 'react';

export function CursorAtmosphere() {
  useEffect(() => {
    const root = document.documentElement;
    const finePointer = window.matchMedia('(pointer: fine)');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;

    if (!finePointer.matches || reduceMotion.matches) return;

    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        root.style.setProperty('--cursor-x', `${event.clientX}px`);
        root.style.setProperty('--cursor-y', `${event.clientY}px`);
        root.classList.add('cursor-active');
      });
    };
    const leave = () => root.classList.remove('cursor-active');

    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', leave);
      root.classList.remove('cursor-active');
      root.style.removeProperty('--cursor-x');
      root.style.removeProperty('--cursor-y');
    };
  }, []);

  return <div className="cursor-atmosphere" aria-hidden="true" />;
}
