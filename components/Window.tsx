
import React, { useRef, useState, useEffect } from 'react';
import { WindowState } from '../types';
import { X, Minus, Square, Minimize2 } from 'lucide-react';

interface WindowProps {
  window: WindowState;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  onUpdatePosition: (id: string, x: number, y: number) => void;
  onUpdateSize: (id: string, width: number, height: number) => void;
}

const Window: React.FC<WindowProps> = ({ 
  window: windowState, onClose, onMinimize, onMaximize, onFocus, onUpdatePosition, onUpdateSize
}) => {
  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [snapPreview, setSnapPreview] = useState<'left' | 'right' | null>(null);
  
  // Resizing State
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDir, setResizeDir] = useState<string | null>(null);
  const [initialResize, setInitialResize] = useState({ x: 0, y: 0, width: 0, height: 0, left: 0, top: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (windowState.isMaximized) return;
    if ((e.target as HTMLElement).closest('.window-controls')) return;
    
    onFocus(windowState.id);
    setIsDragging(true);
    if (windowRef.current) {
      const rect = windowRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleResizeStart = (e: React.MouseEvent, dir: string) => {
      e.stopPropagation();
      e.preventDefault();
      if (windowState.isMaximized) return;
      
      setIsResizing(true);
      setResizeDir(dir);
      setInitialResize({
          x: e.clientX,
          y: e.clientY,
          width: windowState.size.width,
          height: windowState.size.height,
          left: windowState.position.x,
          top: windowState.position.y
      });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        
        // Snap Detection
        if (e.clientX < 20) {
            setSnapPreview('left');
        } else if (e.clientX > window.innerWidth - 20) {
            setSnapPreview('right');
        } else {
            setSnapPreview(null);
        }

        onUpdatePosition(windowState.id, newX, newY);
      }

      if (isResizing && resizeDir) {
          const deltaX = e.clientX - initialResize.x;
          const deltaY = e.clientY - initialResize.y;
          
          let newWidth = initialResize.width;
          let newHeight = initialResize.height;
          let newX = initialResize.left;
          let newY = initialResize.top;

          const minWidth = 300;
          const minHeight = 200;

          if (resizeDir.includes('e')) newWidth = Math.max(minWidth, initialResize.width + deltaX);
          if (resizeDir.includes('s')) newHeight = Math.max(minHeight, initialResize.height + deltaY);
          if (resizeDir.includes('w')) {
              const w = Math.max(minWidth, initialResize.width - deltaX);
              newWidth = w;
              newX = initialResize.left + (initialResize.width - w);
          }
          if (resizeDir.includes('n')) {
              const h = Math.max(minHeight, initialResize.height - deltaY);
              newHeight = h;
              newY = initialResize.top + (initialResize.height - h);
          }

          onUpdateSize(windowState.id, newWidth, newHeight);
          if (resizeDir.includes('w') || resizeDir.includes('n')) {
              onUpdatePosition(windowState.id, newX, newY);
          }
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (isDragging) {
         if (e.clientX < 20) {
             onUpdatePosition(windowState.id, 0, 0);
             onUpdateSize(windowState.id, window.innerWidth / 2, window.innerHeight - 48);
         } else if (e.clientX > window.innerWidth - 20) {
             onUpdatePosition(windowState.id, window.innerWidth / 2, 0);
             onUpdateSize(windowState.id, window.innerWidth / 2, window.innerHeight - 48);
         }
      }
      setIsDragging(false);
      setIsResizing(false);
      setSnapPreview(null);
      setResizeDir(null);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, windowState.id, resizeDir, initialResize, onUpdatePosition, onUpdateSize]);

  if (windowState.isMinimized) return null;

  return (
    <>
    {snapPreview && (
        <div className={`absolute top-0 bottom-12 z-[4000] bg-white/20 backdrop-blur-sm border-2 border-white/40 rounded-xl transition-all duration-200 gpu-layer ${snapPreview === 'left' ? 'left-2 w-[50%]' : 'right-2 w-[50%]'}`}></div>
    )}

    <div
      ref={windowRef}
      className={`absolute flex flex-col overflow-hidden shadow-2xl transition-all duration-75 ease-out gpu-layer
        ${windowState.isMaximized ? 'inset-0 rounded-none w-full h-full !top-[0] !left-[0]' : 'rounded-xl border border-white/20 dark:border-gray-700'}
        bg-os-window dark:bg-os-windowDark glass`}
      style={{
        transform: windowState.isMaximized 
            ? 'translate3d(0,0,0)' 
            : `translate3d(${windowState.position.x}px, ${windowState.position.y}px, 0)`,
        // Reset default absolute positioning to rely on transform
        left: 0,
        top: 0,
        width: windowState.isMaximized ? '100%' : windowState.size.width,
        height: windowState.isMaximized ? '100%' : windowState.size.height,
        zIndex: windowState.zIndex,
      }}
      onMouseDown={() => onFocus(windowState.id)}
    >
      {/* Resize Handles */}
      {!windowState.isMaximized && (
          <>
              <div className="absolute top-0 left-0 w-full h-1 cursor-n-resize z-50" onMouseDown={(e) => handleResizeStart(e, 'n')} />
              <div className="absolute bottom-0 left-0 w-full h-1 cursor-s-resize z-50" onMouseDown={(e) => handleResizeStart(e, 's')} />
              <div className="absolute top-0 left-0 w-1 h-full cursor-w-resize z-50" onMouseDown={(e) => handleResizeStart(e, 'w')} />
              <div className="absolute top-0 right-0 w-1 h-full cursor-e-resize z-50" onMouseDown={(e) => handleResizeStart(e, 'e')} />
              <div className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize z-50" onMouseDown={(e) => handleResizeStart(e, 'nw')} />
              <div className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize z-50" onMouseDown={(e) => handleResizeStart(e, 'ne')} />
              <div className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize z-50" onMouseDown={(e) => handleResizeStart(e, 'sw')} />
              <div className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize z-50" onMouseDown={(e) => handleResizeStart(e, 'se')} />
          </>
      )}

      {/* Title Bar */}
      <div 
        className="h-10 flex-shrink-0 flex items-center justify-between px-3 bg-white/50 dark:bg-black/50 border-b border-gray-200/30 dark:border-gray-700/30 select-none backdrop-blur-md"
        onMouseDown={handleMouseDown}
        onDoubleClick={() => onMaximize(windowState.id)}
      >
        <div className="flex items-center gap-2 window-controls">
          <div className="group flex items-center gap-2">
             <button 
               onClick={(e) => { e.stopPropagation(); onClose(windowState.id); }}
               className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-[8px] text-transparent group-hover:text-black/50 transition-colors"
             >
               <X size={8} />
             </button>
             <button 
               onClick={(e) => { e.stopPropagation(); onMinimize(windowState.id); }}
               className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 flex items-center justify-center text-[8px] text-transparent group-hover:text-black/50 transition-colors"
             >
               <Minus size={8} />
             </button>
             <button 
               onClick={(e) => { e.stopPropagation(); onMaximize(windowState.id); }}
               className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center text-[8px] text-transparent group-hover:text-black/50 transition-colors"
             >
               {windowState.isMaximized ? <Minimize2 size={8} /> : <Square size={8} />}
             </button>
          </div>
        </div>
        
        <div className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate px-2">{windowState.title}</div>
        <div className="w-14"></div>
      </div>

      {/* Content Area */}
      <div className="flex-1 relative overflow-hidden bg-white/40 dark:bg-black/40 backdrop-blur-sm">
        {windowState.content}
      </div>
    </div>
    </>
  );
};

export default Window;
