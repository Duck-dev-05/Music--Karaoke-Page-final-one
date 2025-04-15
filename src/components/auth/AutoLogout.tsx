'use client';

import { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

export function AutoLogout() {
  const { data: session } = useSession();
  const [lastActivity, setLastActivity] = useState<number>(Date.now());

  useEffect(() => {
    if (!session) return;

    const resetTimer = () => {
      setLastActivity(Date.now());
    };

    // Add event listeners for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Check for inactivity every minute
    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastActivity >= INACTIVITY_TIMEOUT) {
        signOut({ callbackUrl: '/login' });
      }
    }, 60000);

    return () => {
      // Cleanup
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
      clearInterval(interval);
    };
  }, [session, lastActivity]);

  return null;
} 