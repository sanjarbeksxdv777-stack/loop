'use client';

import { useEffect } from 'react';

export default function VisitorTracker() {
  useEffect(() => {
    const trackVisitor = async () => {
      // Only track once per session to avoid spamming the API
      if (sessionStorage.getItem('tracked')) return;
      
      try {
        await fetch('/api/track', { method: 'POST' });
        sessionStorage.setItem('tracked', 'true');
      } catch (error) {
        console.error('Failed to track visitor:', error);
      }
    };

    trackVisitor();
  }, []);

  return null;
}
