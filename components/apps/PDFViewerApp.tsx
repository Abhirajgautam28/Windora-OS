
import React, { useState } from 'react';
import { ICONS } from '../../constants';
import { AppProps } from '../../types';

interface PDFViewerProps extends AppProps {
    initialContent?: string; // For this sim, we just use filename
}

const PDFViewerApp: React.FC<PDFViewerProps> = ({ initialContent }) => {
  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  return (
    <div className="flex h-full bg-[#525659] text-white font-sans flex-col">
        {/* Toolbar */}
        <div className="h-12 bg-[#323639] flex items-center px-4 justify-between shadow-md z-10">
            <div className="font-medium text-sm truncate max-w-[200px]">{initialContent || 'Document.pdf'}</div>
            
            <div className="flex items-center bg-[#202124] rounded-full px-1 py-0.5">
                <button onClick={() => setZoom(z => Math.max(25, z - 10))} className="p-1.5 hover:bg-white/10 rounded-full"><ICONS.Minus size={16} /></button>
                <span className="w-12 text-center text-xs font-medium">{zoom}%</span>
                <button onClick={() => setZoom(z => Math.min(200, z + 10))} className="p-1.5 hover:bg-white/10 rounded-full"><ICONS.Plus size={16} /></button>
            </div>
            
            <div className="flex items-center gap-2">
                 <button className="p-2 hover:bg-white/10 rounded-full"><ICONS.RotateCw size={18} /></button>
                 <button className="p-2 hover:bg-white/10 rounded-full"><ICONS.Download size={18} /></button>
                 <button className="p-2 hover:bg-white/10 rounded-full"><ICONS.MoreVertical size={18} /></button>
            </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
            {/* Sidebar */}
            <div className="w-52 bg-[#323639] border-r border-black/20 flex flex-col overflow-y-auto p-4 gap-4">
                {Array.from({length: totalPages}).map((_, i) => (
                    <div 
                        key={i} 
                        onClick={() => setCurrentPage(i + 1)}
                        className={`flex flex-col gap-1 cursor-pointer group ${currentPage === i + 1 ? 'opacity-100' : 'opacity-50 hover:opacity-80'}`}
                    >
                        <div className={`aspect-[3/4] bg-white border-2 transition-all ${currentPage === i + 1 ? 'border-blue-500 shadow-lg' : 'border-transparent group-hover:border-white/20'}`}>
                            {/* Mock Content Lines */}
                            <div className="p-2 space-y-1">
                                <div className="h-2 w-3/4 bg-gray-200 rounded-sm"></div>
                                <div className="h-1 w-full bg-gray-100 rounded-sm"></div>
                                <div className="h-1 w-full bg-gray-100 rounded-sm"></div>
                                <div className="h-1 w-5/6 bg-gray-100 rounded-sm"></div>
                            </div>
                        </div>
                        <span className="text-center text-xs text-gray-400">{i + 1}</span>
                    </div>
                ))}
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-8 flex justify-center bg-[#525659]">
                <div 
                    className="bg-white shadow-2xl transition-all duration-200 origin-top"
                    style={{ 
                        width: `${zoom * 6}px`, 
                        height: `${zoom * 8.5}px`,
                        minWidth: '300px',
                        minHeight: '425px'
                    }}
                >
                    <div className="p-12 text-gray-900 h-full flex flex-col">
                        <h1 className="text-3xl font-bold mb-4 text-black">Chapter {currentPage}</h1>
                        <div className="space-y-4 text-justify text-sm leading-relaxed">
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                            <div className="h-32 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-gray-400 my-8">
                                <ICONS.ImageIcon size={32} />
                                <span className="ml-2">Figure {currentPage}.1</span>
                            </div>
                            <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
                        </div>
                        <div className="mt-auto text-center text-xs text-gray-400 border-t pt-4">
                            Page {currentPage} of {totalPages}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        {/* Floating Page Controls */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-[#323639] rounded-full px-4 py-2 flex items-center gap-4 shadow-lg border border-black/20">
            <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="hover:bg-white/10 rounded-full p-1 disabled:opacity-30"
            >
                <ICONS.ChevronUp size={20} className="-rotate-90" />
            </button>
            <span className="text-sm font-medium w-20 text-center">
                {currentPage} / {totalPages}
            </span>
            <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="hover:bg-white/10 rounded-full p-1 disabled:opacity-30"
            >
                <ICONS.ChevronRight size={20} />
            </button>
        </div>
    </div>
  );
};

export default PDFViewerApp;
