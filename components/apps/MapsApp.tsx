
import React, { useState, useRef, useEffect } from 'react';
import { ICONS } from '../../constants';
import { AppProps } from '../../types';

const MapsApp: React.FC<AppProps> = () => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Mock map image (London for density)
  const MAP_IMAGE = "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2674&auto=format&fit=crop";

  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.5));
  const handleReset = () => { setZoom(1); setPosition({ x: 0, y: 0 }); };

  const handleMouseDown = (e: React.MouseEvent) => {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
          if (isDragging) {
              setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
          }
      };
      const handleMouseUp = () => setIsDragging(false);

      if (isDragging) {
          window.addEventListener('mousemove', handleMouseMove);
          window.addEventListener('mouseup', handleMouseUp);
      }
      return () => {
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('mouseup', handleMouseUp);
      };
  }, [isDragging, dragStart]);

  return (
    <div className="flex flex-col h-full bg-[#f0f0f0] dark:bg-[#191919] text-gray-900 dark:text-white relative overflow-hidden">
        {/* Search Overlay */}
        <div className="absolute top-4 left-4 right-16 z-20 max-w-sm">
            <div className="bg-white dark:bg-[#2d2d2d] shadow-lg rounded-lg flex items-center p-2 border border-gray-200 dark:border-gray-700">
                <ICONS.Search className="text-gray-400 ml-2" size={18} />
                <input 
                    type="text" 
                    placeholder="Search Maps" 
                    className="flex-1 bg-transparent border-none outline-none px-3 text-sm h-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="h-6 w-[1px] bg-gray-200 dark:bg-gray-600 mx-2"></div>
                <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full text-blue-500 transform hover:-rotate-45 transition-transform">
                    <ICONS.Send size={16} />
                </button>
            </div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-8 right-4 z-20 flex flex-col gap-2">
            <button onClick={handleZoomIn} className="bg-white dark:bg-[#2d2d2d] p-2 rounded-lg shadow-md hover:bg-gray-50 dark:hover:bg-[#3d3d3d] border border-gray-200 dark:border-gray-700">
                <ICONS.Plus size={20} />
            </button>
            <button onClick={handleZoomOut} className="bg-white dark:bg-[#2d2d2d] p-2 rounded-lg shadow-md hover:bg-gray-50 dark:hover:bg-[#3d3d3d] border border-gray-200 dark:border-gray-700">
                <ICONS.Minus size={20} />
            </button>
            <button onClick={handleReset} className="bg-white dark:bg-[#2d2d2d] p-2 rounded-lg shadow-md hover:bg-gray-50 dark:hover:bg-[#3d3d3d] border border-gray-200 dark:border-gray-700 text-blue-500">
                <ICONS.RotateCcw size={20} />
            </button>
        </div>

        {/* Map Canvas */}
        <div 
            ref={containerRef}
            className="flex-1 overflow-hidden bg-[#e5e3df] cursor-move flex items-center justify-center"
            onMouseDown={handleMouseDown}
        >
            <div 
                style={{ 
                    transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                    transition: isDragging ? 'none' : 'transform 0.2s ease-out'
                }}
                className="origin-center"
            >
                <img 
                    src={MAP_IMAGE} 
                    alt="Map" 
                    className="max-w-none pointer-events-none select-none shadow-2xl"
                    style={{ width: '2000px', height: 'auto' }}
                />
                
                {/* Simulated Pins */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full text-red-500 drop-shadow-lg">
                    <ICONS.MapPin size={48} fill="currentColor" />
                </div>
            </div>
        </div>
    </div>
  );
};

export default MapsApp;
