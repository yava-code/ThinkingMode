import React, { useEffect, useRef } from 'react';

interface MatrixBackgroundProps {
  paused: boolean;
  isLightMode: boolean;
  isLoading: boolean; // New prop for reactivity
}

const MatrixBackground: React.FC<MatrixBackgroundProps> = ({ paused, isLightMode, isLoading }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const fontSize = 14;
    const columns = width / fontSize;
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }

    let animationFrameId: number;
    let lastTime = 0;
    
    const draw = (time: number) => {
      if (paused) return;

      // Dynamic Speed: 24fps normally, 60fps when "Thinking"
      const fps = isLoading ? 60 : 24; 
      const interval = 1000 / fps;
      const deltaTime = time - lastTime;
      
      if (deltaTime > interval) {
        lastTime = time - (deltaTime % interval);

        // Dynamic Fade: Trails are longer (less opacity) when loading
        const fadeOpacity = isLoading ? 0.1 : (isLightMode ? 0.1 : 0.05);
        
        ctx.fillStyle = isLightMode 
            ? `rgba(248, 250, 252, ${fadeOpacity})` 
            : `rgba(15, 23, 42, ${fadeOpacity})`;
        
        ctx.fillRect(0, 0, width, height);

        ctx.font = `${fontSize}px "JetBrains Mono"`;

        for (let i = 0; i < drops.length; i++) {
          const text = chars[Math.floor(Math.random() * chars.length)];
          
          let color;
          // Dynamic Brightness: Brighter colors when loading
          if (isLightMode) {
            const colors = isLoading 
              ? ['#3b82f6', '#2563eb', '#1d4ed8'] // Intense Blue
              : ['#cbd5e1', '#94a3b8', '#64748b']; // Subtle Grey
            
            const isGlitch = Math.random() > 0.99;
            color = isGlitch ? '#ef4444' : colors[Math.floor(Math.random() * colors.length)];
          } else {
            const colors = isLoading 
              ? ['#60a5fa', '#3b82f6', '#ffffff'] // Bright Blue/White
              : ['#3b82f6', '#94a3b8', '#1e293b']; // Dark Matrix
              
            const isGlitch = Math.random() > 0.98;
            color = isGlitch ? '#ef4444' : colors[Math.floor(Math.random() * colors.length)];
          }
          
          ctx.fillStyle = color;
          
          const x = i * fontSize; 
          const y = drops[i] * fontSize;

          ctx.fillText(text, x, y);

          if (y > height && Math.random() > 0.975) {
            drops[i] = 0;
          }

          drops[i]++;
        }
      }
      
      animationFrameId = requestAnimationFrame(draw);
    };

    if (!paused) {
        animationFrameId = requestAnimationFrame(draw);
    } else {
        ctx.clearRect(0,0, width, height);
    }

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [paused, isLightMode, isLoading]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-0 pointer-events-none transition-all duration-500"
      style={{ opacity: paused ? 0 : (isLightMode ? 0.4 : 0.3) }}
    />
  );
};

export default MatrixBackground;