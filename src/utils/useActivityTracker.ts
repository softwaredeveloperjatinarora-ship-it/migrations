'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useCallback, useRef } from 'react';

export function useActivityTracker() {
  const { update } = useSession();
  const lastUpdateRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  const throttledUpdate = useCallback(async () => {
    const now = Date.now();
    if (now - lastUpdateRef.current < 30000) return; // 30-second throttle

    try {
      await update();
      lastUpdateRef.current = now;
    } catch (error) {
      console.error('Session update failed:', error);
    }
  }, [update]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const events = [
      'mousemove', 'click', 'scroll', 
      'keydown', 'touchstart', 'mousedown'
    ] as const;

    // Add event listeners
    events.forEach(event => {
      window.addEventListener(event, throttledUpdate, { passive: true });
    });

    // Initial update
    throttledUpdate();

    // Periodic fallback check (every minute)
    // timeoutRef.current = setInterval(throttledUpdate, 60000);
    // timeoutRef.current = setInterval(throttledUpdate, 14 * 60 * 1000);

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, throttledUpdate);
      });
      if (timeoutRef.current) clearInterval(timeoutRef.current);
    };
  }, [throttledUpdate]);
} 
