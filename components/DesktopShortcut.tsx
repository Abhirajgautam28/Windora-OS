
import React, { useState, useRef, useEffect } from 'react';
import { AppConfig } from '../types';

interface DesktopShortcutProps {
  app: AppConfig;
  position: { x: number; y: number };
  onOpen: (id: string) => void;
  onUpdatePosition: (id: string, x: number, y: number) => void;
}

const DesktopShortcut: React.FC<DesktopShortcutProps> = ({ app, position, onOpen, onUpdatePosition }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Only left click triggers drag
    if (e.button !== 0) return;

    setIsDragging(true);
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        // Snap to grid (approx 10px)
        const rawX = e.clientX - dragOffset.x;
        const rawY = e.clientY - dragOffset.y;
        
        // Boundary checks (simple)
        const maxX = window.innerWidth - 100;
        const maxY = window.innerHeight - 100;
        
        const newX = Math.max(0, Math.min(rawX, maxX));
        const newY = Math.max(0, Math.min(rawY, maxY));

        onUpdatePosition(app.id, newX, newY);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, app.id, onUpdatePosition]);

  return (
    <div
      ref={ref}
      onMouseDown={handleMouseDown}
      onDoubleClick={(e) => { e.stopPropagation(); onOpen(app.id); }}
      className="absolute flex flex-col items-center justify-center gap-1 w-24 p-2 rounded-lg hover:bg-white/10 dark:hover:bg-black/20 cursor-pointer transition-colors group z-[1] gpu-layer"
      style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)`, left: 0, top: 0 }}
    >
      <div className={`w-12 h-12 rounded-xl ${app.color} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform pointer-events-none`}>
        <app.icon size={28} className="text-white" />
      </div>
      <span className="text-xs font-medium text-center text-white drop-shadow-md line-clamp-2 pointer-events-none bg-black/20 px-2 rounded-md leading-tight">
        {app.name}
      </span>
    </div>
  );
};

export default DesktopShortcut;
