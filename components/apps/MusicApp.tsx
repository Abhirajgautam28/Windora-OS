
import React, { useState } from 'react';
import { ICONS } from '../../constants';
import { AppProps } from '../../types';

const MusicApp: React.FC<AppProps> = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(30);

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-900 to-black text-white">
       {/* Header */}
       <div className="h-16 flex items-center px-6 gap-4 bg-black/20">
           <span className="font-bold text-lg tracking-tight text-pink-500">Groove Music</span>
           <div className="flex-1"></div>
           <ICONS.Search size={18} className="text-gray-400" />
           <div className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center font-bold text-xs">U</div>
       </div>

       <div className="flex-1 flex overflow-hidden">
           {/* Sidebar */}
           <div className="w-48 p-4 flex flex-col gap-2 text-sm text-gray-400 border-r border-white/5">
               <div className="px-3 py-2 bg-white/10 text-white rounded-md font-medium cursor-pointer">My Music</div>
               <div className="px-3 py-2 hover:bg-white/5 rounded-md cursor-pointer transition-colors">Recent Plays</div>
               <div className="px-3 py-2 hover:bg-white/5 rounded-md cursor-pointer transition-colors">Now Playing</div>
               <div className="px-3 py-2 hover:bg-white/5 rounded-md cursor-pointer transition-colors">Playlists</div>
           </div>

           {/* Content */}
           <div className="flex-1 p-8 overflow-y-auto">
               <h2 className="text-2xl font-bold mb-6">Recently Added</h2>
               <div className="grid grid-cols-4 gap-6">
                   {[1, 2, 3, 4, 5, 6].map(i => (
                       <div key={i} className="group cursor-pointer">
                           <div className="aspect-square bg-gray-800 rounded-lg mb-3 relative overflow-hidden shadow-lg">
                               <div className={`absolute inset-0 bg-gradient-to-br ${i % 2 === 0 ? 'from-blue-500 to-purple-600' : 'from-pink-500 to-orange-500'} opacity-70 group-hover:opacity-100 transition-opacity`}></div>
                               <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                   <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black shadow-xl">
                                       <ICONS.Play size={24} fill="currentColor" className="ml-1" />
                                   </div>
                               </div>
                           </div>
                           <div className="font-medium text-sm truncate">Synthwave Mix Vol. {i}</div>
                           <div className="text-xs text-gray-500">Various Artists</div>
                       </div>
                   ))}
               </div>
           </div>
       </div>

       {/* Player Controls */}
       <div className="h-20 bg-[#181818] border-t border-white/5 flex items-center px-4 gap-4">
           <div className="w-14 h-14 bg-gray-700 rounded-md overflow-hidden">
               <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600"></div>
           </div>
           <div className="flex flex-col justify-center w-32">
               <span className="text-sm font-medium truncate">Midnight City</span>
               <span className="text-xs text-gray-400 truncate">M83</span>
           </div>
           
           <div className="flex-1 flex flex-col items-center justify-center gap-1 max-w-lg mx-auto">
               <div className="flex items-center gap-6">
                   <ICONS.RotateCcw size={16} className="text-gray-400 hover:text-white cursor-pointer" />
                   <ICONS.Minus size={20} className="text-gray-400 hover:text-white cursor-pointer rotate-180" /> {/* Using as skip back */}
                   <button 
                     onClick={() => setIsPlaying(!isPlaying)}
                     className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform"
                   >
                       {isPlaying ? <ICONS.Minus size={16} className="rotate-90" /> /* Pause hack */ : <ICONS.Play size={16} fill="currentColor" className="ml-1" />}
                   </button>
                   <ICONS.Minus size={20} className="text-gray-400 hover:text-white cursor-pointer" /> {/* Skip forward */}
                   <ICONS.RotateCw size={16} className="text-gray-400 hover:text-white cursor-pointer" />
               </div>
               <div className="w-full flex items-center gap-3 text-[10px] text-gray-400 font-mono">
                   <span>1:24</span>
                   <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden cursor-pointer group">
                       <div className="h-full bg-pink-500 w-[30%] group-hover:bg-pink-400 transition-colors"></div>
                   </div>
                   <span>4:03</span>
               </div>
           </div>

           <div className="w-32 flex items-center justify-end gap-2 text-gray-400">
               <ICONS.Volume2 size={18} />
               <div className="w-20 h-1 bg-gray-700 rounded-full overflow-hidden">
                   <div className="h-full bg-white w-[80%]"></div>
               </div>
           </div>
       </div>
    </div>
  );
};

export default MusicApp;
