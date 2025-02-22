'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

interface VantaEffect {
  destroy: () => void;
}

declare global {
  interface Window {
    VANTA: any;
    THREE: any;
  }
}

export default function HaloBackground({ children }: { children: React.ReactNode }) {
  const vantaRef = useRef<HTMLDivElement>(null);
  const [vantaEffect, setVantaEffect] = useState<VantaEffect | null>(null);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);

  const initVanta = () => {
    if (typeof window !== 'undefined' && window.VANTA && window.THREE && vantaRef.current && !vantaEffect && scriptsLoaded) {
      const effect = window.VANTA.HALO({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        amplitudeFactor: 1.10,
        size: 0.80,
        THREE: window.THREE // Pass THREE explicitly
      });
      setVantaEffect(effect);
    }
  };

  useEffect(() => {
    if (scriptsLoaded) {
      initVanta();
    }
    return () => {
      if (vantaEffect) {
        vantaEffect.destroy();
      }
    };
  }, [scriptsLoaded, vantaEffect]);

  return (
    <>
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js" 
        strategy="beforeInteractive"
        onLoad={() => setScriptsLoaded(prevState => !prevState)}
      />
      <Script 
        src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.halo.min.js"
        strategy="beforeInteractive"
        onLoad={() => setScriptsLoaded(prevState => !prevState)}
      />
      <div ref={vantaRef} className="fixed inset-0 -z-10">
        {children}
      </div>
    </>
  );
} 