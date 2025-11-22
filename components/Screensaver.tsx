
import React, { useEffect, useRef, useState } from 'react';
import { ICONS } from '../constants';

const Screensaver = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 100, y: 100 });
  const [vel, setVel] = useState({ x: 3, y: 3 });
  const [color, setColor] = useState('text-blue-500');

  const COLORS = ['text-blue-500', 'text-red-500', 'text-green-500', 'text-yellow-500', 'text-purple-500', 'text-pink-500'];

  useEffect(() => {
    let animationFrameId: number;

    const update = () => {
      if (!containerRef.current) return;
      
      const { innerWidth, innerHeight } = window;
      const elWidth = 200; // Approx width of logo
      const elHeight = 80; // Approx height

      setPos(prevPos => {
        let newX = prevPos.x + vel.x;
        let newY = prevPos.y + vel.y;
        let newVelX = vel.x;
        let newVelY = vel.y;
        let hit = false;

        if (newX + elWidth >= innerWidth || newX <= 0) {
          newVelX = -vel.x;
          hit = true;
        }
        if (newY + elHeight >= innerHeight || newY <= 0) {
          newVelY = -vel.y;
          hit = true;
        }

        if (hit) {
            setVel({ x: newVelX, y: newVelY });
            setColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
        }

        return { x: newX, y: newY };
      });
      
      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, [vel]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[10000] bg-black cursor-none overflow-hidden">
        <div 
            className={`absolute flex flex-col items-center justify-center ${color} transition-colors duration-500`}
            style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
        >
            <ICONS.LayoutGrid size={64} />
            <span className="text-2xl font-bold tracking-widest mt-2">WINDORA</span>
        </div>
    </div>
  );
};

export default Screensaver;
