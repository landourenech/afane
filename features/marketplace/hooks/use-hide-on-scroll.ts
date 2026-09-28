'use client';

import { useState, useEffect, useRef, type RefObject } from 'react';

/**
 * Masque un élément quand on scrolle vers le bas,
 * le réaffiche dès qu'on scrolle vers le haut (même légèrement).
 */
export function useHideOnScroll(
  scrollRef: RefObject<HTMLElement | null>,
  threshold = 60,
  tolerance = 8
) {
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const currentY = el.scrollTop;
      const delta = currentY - lastScrollY.current;

      if (currentY < threshold) {
        setHidden(false);
      } else if (delta > tolerance) {
        setHidden(true);
      } else if (delta < -tolerance) {
        setHidden(false);
      }

      lastScrollY.current = currentY;
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [scrollRef, threshold, tolerance]);

  return hidden;
}
