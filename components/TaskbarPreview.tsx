
import React from 'react';
import { WindowState } from '../types';
import { X, Mail, Calculator, Settings, StickyNote, ShoppingBag, Camera, Music, Video } from 'lucide-react';
import { ICONS } from '../constants';

interface TaskbarPreviewProps {
  windows: WindowState[];
  onSelect: (windowId: string) => void;
  onClose: (windowId: string) => void;
  icon: React.FC<any>;
}

const TaskbarPreview: React.FC<TaskbarPreviewProps> = ({ windows, onSelect, onClose, icon: Icon }) => {
  if (windows.length === 0) return null;

  const getPreviewContent = (appId: string) => {
      switch (appId) {
          case 'terminal':
              return (
                  <div className="w-full h-full bg-black p-1 font-mono text-[4px] text-green-500 leading-tight overflow-hidden select-none opacity-90">
                      <div>admin@windora:~$ _</div>
                      <div>npm run build</div>
                      <div>Building...</div>
                      <div className="text-blue-400">[#################] 100%</div>
                      <div>Done in 2.4s</div>
                  </div>
              );
          case 'code':
               return (
                  <div className="w-full h-full bg-[#1e1e1e] flex opacity-90">
                      <div className="w-[20%] h-full bg-[#252526] border-r border-[#333]"></div>
                      <div className="flex-1 p-1 space-y-1">
                          <div className="flex gap-1 mb-1">
                              <div className="w-8 h-1 bg-[#333] rounded"></div>
                              <div className="w-8 h-1 bg-[#2d2d2d] rounded"></div>
                          </div>
                          <div className="space-y-0.5">
                              <div className="w-1/2 h-0.5 bg-gray-500 rounded"></div>
                              <div className="w-3/4 h-0.5 bg-blue-400 rounded"></div>
                              <div className="w-2/3 h-0.5 bg-yellow-600 rounded"></div>
                              <div className="w-1/2 h-0.5 bg-purple-400 rounded"></div>
                          </div>
                      </div>
                  </div>
               );
          case 'browser':
               return (
                  <div className="w-full h-full bg-white dark:bg-[#202124] flex flex-col opacity-90">
                      <div className="h-2 bg-gray-100 dark:bg-[#35363a] w-full flex items-center px-1 gap-1">
                          <div className="w-1 h-1 rounded-full bg-red-400"></div>
                          <div className="w-1 h-1 rounded-full bg-yellow-400"></div>
                          <div className="w-6 h-1 bg-white dark:bg-gray-600 rounded-full"></div>
                      </div>
                      <div className="flex-1 flex flex-col items-center justify-center gap-1">
                          <div className="text-xl font-bold text-gray-300 dark:text-gray-600">G</div>
                          <div className="w-1/2 h-1 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      </div>
                  </div>
               );
          case 'files':
               return (
                  <div className="w-full h-full bg-white dark:bg-[#1e1e1e] flex opacity-90">
                      <div className="w-[25%] h-full bg-gray-50 dark:bg-[#252526] border-r border-gray-200 dark:border-gray-700"></div>
                      <div className="flex-1 p-1 grid grid-cols-4 gap-1 content-start">
                          {[1,2,3,4,5,6].map(i => <div key={i} className="aspect-[3/4] bg-yellow-100 dark:bg-yellow-900/20 rounded-[1px] border border-yellow-200 dark:border-yellow-700/30"></div>)}
                      </div>
                  </div>
               );
           case 'mail':
               return (
                  <div className="w-full h-full bg-white dark:bg-[#1e1e1e] flex opacity-90">
                      <div className="w-[25%] h-full bg-gray-100 dark:bg-[#252526]"></div>
                      <div className="flex-1 p-1 space-y-1">
                          <div className="w-full h-2 bg-blue-50 dark:bg-blue-900/20 border-b border-gray-100 dark:border-gray-800"></div>
                          <div className="w-full h-2 border-b border-gray-50 dark:border-gray-800"></div>
                          <div className="w-full h-2 border-b border-gray-50 dark:border-gray-800"></div>
                      </div>
                  </div>
               );
           case 'calculator':
               return (
                   <div className="w-full h-full bg-[#f3f3f3] dark:bg-[#202020] p-1 flex flex-col opacity-90">
                       <div className="h-[25%] mb-1 bg-transparent text-right text-[8px] font-bold text-black dark:text-white">1,234</div>
                       <div className="flex-1 grid grid-cols-4 gap-[1px]">
                           {Array.from({length: 16}).map((_, i) => <div key={i} className="bg-white dark:bg-[#333] rounded-[1px]"></div>)}
                       </div>
                   </div>
               );
           case 'settings':
               return (
                   <div className="w-full h-full bg-[#f3f3f3] dark:bg-[#191919] flex opacity-90">
                       <div className="w-[30%] h-full bg-[#f0f0f0] dark:bg-[#202020] p-1 space-y-1">
                           <div className="w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600 mx-auto"></div>
                           <div className="w-full h-0.5 bg-gray-200 dark:bg-gray-700"></div>
                           <div className="w-full h-0.5 bg-gray-200 dark:bg-gray-700"></div>
                       </div>
                       <div className="flex-1 p-2">
                           <div className="w-full h-2 bg-white dark:bg-[#2d2d2d] mb-1 rounded-[1px]"></div>
                           <div className="w-full h-2 bg-white dark:bg-[#2d2d2d] rounded-[1px]"></div>
                       </div>
                   </div>
               );
           case 'notes':
               return (
                   <div className="w-full h-full bg-[#f3f3f3] dark:bg-[#191919] p-1 grid grid-cols-2 gap-1 opacity-90">
                       <div className="bg-yellow-200 h-full rounded-sm shadow-sm"></div>
                       <div className="bg-blue-200 h-1/2 rounded-sm shadow-sm"></div>
                   </div>
               );
           case 'store':
               return (
                   <div className="w-full h-full bg-[#f9f9f9] dark:bg-[#191919] flex flex-col opacity-90">
                       <div className="h-2 w-full border-b border-gray-200 dark:border-white/10"></div>
                       <div className="flex-1 p-1 grid grid-cols-2 gap-1">
                           <div className="bg-white dark:bg-[#2d2d2d] rounded-sm h-full shadow-sm"></div>
                           <div className="bg-white dark:bg-[#2d2d2d] rounded-sm h-full shadow-sm"></div>
                       </div>
                   </div>
               );
           case 'camera':
               return (
                   <div className="w-full h-full bg-black flex items-center justify-center opacity-90 relative">
                       <div className="w-4 h-4 rounded-full border-2 border-white/50"></div>
                       <div className="absolute bottom-1 w-2 h-2 bg-red-500 rounded-full"></div>
                   </div>
               );
           case 'music':
               return (
                   <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black flex flex-col opacity-90">
                       <div className="flex-1 flex items-center justify-center">
                           <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded shadow"></div>
                       </div>
                       <div className="h-3 bg-[#181818] w-full"></div>
                   </div>
               );
           case 'video':
               return (
                   <div className="w-full h-full bg-black flex items-center justify-center opacity-90 relative">
                        <div className="text-white/20 text-[8px]">▶</div>
                        <div className="absolute bottom-1 left-1 right-1 h-0.5 bg-gray-700 rounded-full overflow-hidden">
                            <div className="w-1/2 h-full bg-red-600"></div>
                        </div>
                   </div>
               );
          default:
              return (
                 <div className="w-full h-full bg-white dark:bg-white/5 rounded-sm flex flex-col gap-1.5 p-1.5 shadow-inner opacity-90">
                     <div className="h-1.5 w-3/4 bg-gray-200 dark:bg-white/10 rounded-full"></div>
                     <div className="h-1.5 w-1/2 bg-gray-200 dark:bg-white/10 rounded-full"></div>
                     <div className="flex-1 bg-gray-50 dark:bg-white/5 rounded-sm mt-1 border border-gray-100 dark:border-white/5"></div>
                 </div>
              );
      }
  };

  return (
    <div className="absolute bottom-full mb-3 left-1/2 transform -translate-x-1/2 flex gap-2 p-2 bg-[#f9f9f9]/95 dark:bg-[#1c1c1e]/95 backdrop-blur-2xl rounded-xl border border-gray-200 dark:border-white/10 shadow-2xl z-[7000] animate-in fade-in slide-in-from-bottom-4 duration-200 origin-bottom">
      {/* Invisible Bridge to prevent mouseleave when moving from icon to preview */}
      <div className="absolute top-full left-0 w-full h-4 bg-transparent"></div>

      {windows.map((win) => (
        <div 
          key={win.id}
          className="group/preview relative w-36 h-24 bg-gray-200 dark:bg-[#2a2a2a] rounded-lg border border-gray-300 dark:border-white/10 overflow-hidden cursor-pointer hover:bg-gray-300 dark:hover:bg-[#3a3a3a] transition-colors flex flex-col shadow-lg"
          onClick={(e) => { e.stopPropagation(); onSelect(win.id); }}
        >
            {/* Mini Title Bar */}
            <div className="h-5 bg-gray-100/80 dark:bg-black/40 flex items-center px-2 gap-1.5 border-b border-gray-200 dark:border-white/5">
                <Icon size={10} className="text-gray-600 dark:text-white/70" />
                <span className="text-[9px] text-gray-700 dark:text-white/90 truncate flex-1 font-medium">{win.title}</span>
                <button 
                    onClick={(e) => { e.stopPropagation(); onClose(win.id); }}
                    className="opacity-0 group-hover/preview:opacity-100 p-0.5 hover:bg-red-500 hover:text-white rounded transition-all text-gray-500 dark:text-gray-400"
                >
                    <X size={8} />
                </button>
            </div>
            
            {/* Mini Content Visual */}
            <div className="flex-1 p-1.5 relative overflow-hidden">
                 {getPreviewContent(win.appId)}
                 
                 {/* Active State Highlight */}
                 {!win.isMinimized && (
                     <div className="absolute inset-0 border-2 border-blue-500/50 rounded-lg pointer-events-none shadow-[inset_0_0_10px_rgba(59,130,246,0.1)]"></div>
                 )}
            </div>
        </div>
      ))}
      
      {/* Arrow Indicator */}
      <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-[#f9f9f9]/95 dark:bg-[#1c1c1e]/95 rotate-45 border-r border-b border-gray-200 dark:border-white/10"></div>
    </div>
  );
};

export default TaskbarPreview;
