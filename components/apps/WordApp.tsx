
import React, { useState } from 'react';
import { ICONS } from '../../constants';
import { AppProps } from '../../types';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Minus, Plus } from 'lucide-react';

const WordApp: React.FC<AppProps> = () => {
  const [content, setContent] = useState('Welcome to Windora Word.\n\nStart typing your document here...');
  const [zoom, setZoom] = useState(100);
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [align, setAlign] = useState<'left'|'center'|'right'>('left');

  return (
    <div className="flex flex-col h-full bg-[#f3f3f3] dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-100 font-sans">
        {/* Title Bar / Menu */}
        <div className="h-10 bg-blue-700 text-white flex items-center px-4 text-xs gap-4 select-none">
            <span className="font-bold">File</span>
            <span>Home</span>
            <span>Insert</span>
            <span>Layout</span>
            <span>View</span>
        </div>

        {/* Ribbon Toolbar */}
        <div className="h-24 bg-[#f3f3f3] dark:bg-[#2d2d2d] border-b border-gray-300 dark:border-gray-600 flex items-center px-4 gap-6">
            <div className="flex flex-col items-center gap-1">
                <button 
                    className="p-2 bg-white dark:bg-[#333] border border-gray-300 dark:border-gray-600 rounded shadow-sm hover:bg-gray-50 dark:hover:bg-[#444] transition-colors"
                    onClick={() => navigator.clipboard.writeText(content)}
                >
                    <ICONS.Clipboard size={20} />
                </button>
                <span className="text-[10px] text-gray-500">Clipboard</span>
            </div>

            <div className="w-[1px] h-16 bg-gray-300 dark:bg-gray-600"></div>

            <div className="flex flex-col gap-2">
                <div className="flex gap-1 bg-white dark:bg-[#333] border border-gray-300 dark:border-gray-600 rounded p-0.5">
                    <button className="px-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded text-xs">Calibri</button>
                    <div className="w-[1px] bg-gray-300 dark:bg-gray-600"></div>
                    <button className="px-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded text-xs">11</button>
                </div>
                <div className="flex gap-1">
                    <button onClick={() => setBold(!bold)} className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-white/10 ${bold ? 'bg-gray-300 dark:bg-white/20' : ''}`}><Bold size={16} /></button>
                    <button onClick={() => setItalic(!italic)} className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-white/10 ${italic ? 'bg-gray-300 dark:bg-white/20' : ''}`}><Italic size={16} /></button>
                    <button onClick={() => setUnderline(!underline)} className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-white/10 ${underline ? 'bg-gray-300 dark:bg-white/20' : ''}`}><Underline size={16} /></button>
                </div>
            </div>

            <div className="w-[1px] h-16 bg-gray-300 dark:bg-gray-600"></div>

            <div className="flex flex-col gap-2">
                 <div className="flex gap-1">
                    <button onClick={() => setAlign('left')} className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-white/10 ${align === 'left' ? 'bg-gray-300 dark:bg-white/20' : ''}`}><AlignLeft size={16} /></button>
                    <button onClick={() => setAlign('center')} className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-white/10 ${align === 'center' ? 'bg-gray-300 dark:bg-white/20' : ''}`}><AlignCenter size={16} /></button>
                    <button onClick={() => setAlign('right')} className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-white/10 ${align === 'right' ? 'bg-gray-300 dark:bg-white/20' : ''}`}><AlignRight size={16} /></button>
                 </div>
            </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 bg-[#e0e0e0] dark:bg-[#111] overflow-auto flex justify-center p-8">
            <div 
                className="bg-white text-black shadow-xl p-12 transition-all duration-200 origin-top"
                style={{ 
                    width: '816px', 
                    minHeight: '1056px',
                    transform: `scale(${zoom / 100})`,
                    marginBottom: `${(zoom/100) * 100}px`
                }}
            >
                <textarea
                    className={`w-full h-full resize-none outline-none border-none bg-transparent text-base leading-relaxed ${bold ? 'font-bold' : ''} ${italic ? 'italic' : ''} ${underline ? 'underline' : ''}`}
                    style={{ textAlign: align }}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    spellCheck={false}
                />
            </div>
        </div>

        {/* Status Bar */}
        <div className="h-6 bg-blue-700 text-white text-xs flex items-center px-4 justify-between select-none z-10">
            <div className="flex gap-4">
                <span>Page 1 of 1</span>
                <span>{content.split(/\s+/).filter(w => w.length > 0).length} words</span>
                <span>English (United States)</span>
            </div>
            <div className="flex items-center gap-3">
                <span className="cursor-pointer">Focus</span>
                <div className="flex items-center gap-2">
                    <button onClick={() => setZoom(Math.max(50, zoom - 10))}><Minus size={12} /></button>
                    <span className="w-8 text-center">{zoom}%</span>
                    <button onClick={() => setZoom(Math.min(200, zoom + 10))}><Plus size={12} /></button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default WordApp;
