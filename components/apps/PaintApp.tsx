
import React, { useRef, useState, useEffect } from 'react';
import { ICONS } from '../../constants';
import { AppProps } from '../../types';

const PaintApp: React.FC<AppProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f0f0f0] dark:bg-[#202020] text-gray-900 dark:text-white">
      {/* Toolbar */}
      <div className="h-14 bg-white dark:bg-[#2d2d2d] border-b border-gray-200 dark:border-gray-700 flex items-center px-4 gap-6 shadow-sm z-10">
        
        {/* Tools */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setTool('pen')}
            className={`p-2 rounded-lg transition-colors ${tool === 'pen' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-white/10'}`}
            title="Pen"
          >
            <ICONS.Edit size={20} />
          </button>
          <button 
            onClick={() => setTool('eraser')}
            className={`p-2 rounded-lg transition-colors ${tool === 'eraser' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-white/10'}`}
            title="Eraser"
          >
            <div className="w-5 h-5 border-2 border-current rounded-sm"></div>
          </button>
          <button 
            onClick={clearCanvas}
            className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors"
            title="Clear Canvas"
          >
            <ICONS.Trash2 size={20} />
          </button>
        </div>

        <div className="w-[1px] h-8 bg-gray-200 dark:bg-gray-700"></div>

        {/* Size */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Size</span>
          <input 
            type="range" 
            min="1" 
            max="50" 
            value={brushSize} 
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-24 h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="w-6 h-6 flex items-center justify-center bg-white dark:bg-black border border-gray-200 dark:border-gray-600 rounded">
            <div className="rounded-full bg-black dark:bg-white" style={{ width: Math.min(20, brushSize), height: Math.min(20, brushSize) }}></div>
          </div>
        </div>

        <div className="w-[1px] h-8 bg-gray-200 dark:bg-gray-700"></div>

        {/* Colors */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Color</span>
          <input 
            type="color" 
            value={color} 
            onChange={(e) => { setColor(e.target.value); setTool('pen'); }}
            className="w-8 h-8 rounded cursor-pointer border-none p-0 bg-transparent"
          />
          <div className="flex gap-1">
            {['#000000', '#ef4444', '#22c55e', '#3b82f6', '#eab308', '#a855f7'].map(c => (
              <button 
                key={c}
                onClick={() => { setColor(c); setTool('pen'); }}
                className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${color === c ? 'border-gray-400 scale-110' : 'border-transparent'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 overflow-auto p-8 flex items-center justify-center bg-[#e5e5e5] dark:bg-[#111]">
        <div className="bg-white shadow-2xl">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="cursor-crosshair block touch-none"
          />
        </div>
      </div>
      
      {/* Footer */}
      <div className="h-6 bg-white dark:bg-[#2d2d2d] border-t border-gray-200 dark:border-gray-700 flex items-center px-4 text-xs text-gray-500 dark:text-gray-400 justify-between select-none">
          <span>800 x 600px</span>
          <span>{Math.round(brushSize)}px {tool}</span>
      </div>
    </div>
  );
};

export default PaintApp;
