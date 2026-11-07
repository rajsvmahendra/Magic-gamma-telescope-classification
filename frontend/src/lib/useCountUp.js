import { useState, useEffect, useRef } from 'react';

/**
 * Animated counter hook that animates from 0 to target value using requestAnimationFrame.
 * @param {number} target - The final target number
 * @param {number} duration - Animation duration in ms (default 1200ms)
 * @param {number} decimals - Number of decimal places (default 0)
 * @returns {string} Formatted number string
 */
export function useCountUp(target, duration = 1200, decimals = 0) {
  const [current, setCurrent] = useState(0);
  const targetRef = useRef(target);
  targetRef.current = target;

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCurrent(targetRef.current);
      return;
    }

    let startTime = null;
    let animationFrameId;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // easeOutExpo for crisp, scientific feel
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const val = targetRef.current * ease;

      setCurrent(val);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCurrent(targetRef.current);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [target, duration]);

  if (decimals > 0) {
    return current.toFixed(decimals);
  }
  return Math.round(current).toLocaleString();
}
