'use client';

import { useEffect } from 'react';

export default function OTAScript() {
  useEffect(() => {
    // Load OTA script
    const script = document.createElement('script');
    script.src = '/js/tauos-ota.js';
    script.async = true;
    document.head.appendChild(script);
    
    return () => {
      // Cleanup
      const existingScript = document.querySelector('script[src="/js/tauos-ota.js"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return null; // This component doesn't render anything
}
