
import React, { useState, useRef, useEffect } from 'react';
import { Search, Power, User, ArrowRight, ChevronRight } from 'lucide-react';
import { AppConfig } from '../types';
import { ICONS } from '../constants';

interface StartMenuProps {
  apps: AppConfig[];
  onOpenApp: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
  accentColor?: string;
}

const StartMenu: React.FC<StartMenuProps> = ({ apps, onOpenApp, isOpen, onClose, accentColor = 'blue' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showPowerMenu, setShowPowerMenu] = useState(false);
  const powerMenuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
      if (isOpen) {
          setTimeout(() => inputRef.current?.focus(), 50);
          setSearchTerm('');
          setShowPowerMenu(false);
      }
  }, [isOpen]);

  useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
          if (showPowerMenu && powerMenuRef.current && !powerMenuRef.current.contains(e.target as Node)) {
              setShowPowerMenu(false);
          }
      };
      window.addEventListener('mousedown', handleClickOutside);
      return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [showPowerMenu]);

  if (!isOpen) return null;

  const filteredApps = apps.filter(app => app.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const pinnedApps = apps.filter(app => !['assistant', 'snake', 'minesweeper', 'pdf', 'recorder'].includes(app.id));

  return (
    <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-[640px] h-[720px] bg-[#f2f2f2]/80 dark:bg-[#1c1c1e]/85 backdrop-blur-3xl rounded-lg border border-gray-200/50 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-200 z-[7000] origin-bottom select-none will-change-transform">
      
      {/* Search Bar */}
      <div className="p-6 pb-2">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Search for apps, settings, and documents" 
            className={`w-full bg-white dark:bg-[#2c2c2e] border border-gray-300/50 dark:border-transparent rounded-full py-2.5 pl-12 pr-4 text-sm font-medium text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 ring-${accentColor}-500/50 focus:bg-white dark:focus:bg-[#3a3a3c] transition-all shadow-sm`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide px-8 py-2">
        {searchTerm ? (
            <div className="space-y-2">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-4 px-2">Best match</h3>
                {filteredApps.map(app => (
                    <button 
                        key={app.id}
                        onClick={() => { onOpenApp(app.id); onClose(); }}
                        className="w-full flex items-center gap-4 p-2 rounded-lg hover:bg-gray-200/50 dark:hover:bg-white/10 transition-colors group text-left"
                    >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-sm ${app.color}`}>
                            <app.icon size={20} />
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-gray-800 dark:text-white">{app.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">App</div>
                        </div>
                        <ChevronRight size={16} className="ml-auto text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                ))}
                {filteredApps.length === 0 && <div className="text-center text-gray-500 py-8">No apps found.</div>}
            </div>
        ) : (
            <>
                <div className="flex items-center justify-between mb-4 mt-2">
                  <h3 className="text-xs font-bold text-gray-800 dark:text-white/90 pl-2">Pinned</h3>
                  <button className="flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-white/70 hover:bg-gray-200/50 dark:hover:bg-white/10 px-2 py-1 rounded transition-colors">
                    All apps <ChevronRight size={12} />
                  </button>
                </div>
                
                <div className="grid grid-cols-6 gap-y-6 gap-x-2 mb-8">
                  {pinnedApps.slice(0, 18).map(app => (
                    <button 
                      key={app.id}
                      onClick={() => { onOpenApp(app.id); onClose(); }}
                      className="flex flex-col items-center gap-2 p-2 rounded-md hover:bg-white/50 dark:hover:bg-white/5 transition-all group active:scale-95"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md ${app.color} group-hover:shadow-lg transition-shadow`}>
                        <app.icon size={22} />
                      </div>
                      <span className="text-[11px] font-medium text-gray-800 dark:text-white/90 truncate w-full text-center">{app.name}</span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold text-gray-800 dark:text-white/90 pl-2">Recommended</h3>
                  <button className="flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-white/70 hover:bg-gray-200/50 dark:hover:bg-white/10 px-2 py-1 rounded transition-colors">
                    More <ChevronRight size={12} />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-4">
                    <RecommendedItem name="Project_Proposal.docx" time="17m ago" icon={<ICONS.FileText size={18} className="text-blue-500" />} />
                    <RecommendedItem name="Q4_Budget.xlsx" time="2h ago" icon={<ICONS.Table size={18} className="text-green-500" />} />
                    <RecommendedItem name="Meeting_Notes.txt" time="Yesterday" icon={<ICONS.StickyNote size={18} className="text-yellow-500" />} />
                    <RecommendedItem name="Screenshot_2024.png" time="Yesterday" icon={<ICONS.ImageIcon size={18} className="text-purple-500" />} />
                    <RecommendedItem name="main.py" time="Last week" icon={<ICONS.Code2 size={18} className="text-blue-400" />} />
                    <RecommendedItem name="Vacation.jpg" time="Last week" icon={<ICONS.ImageIcon size={18} className="text-orange-500" />} />
                </div>
            </>
        )}
      </div>

      <div className="h-16 bg-gray-100/80 dark:bg-[#151515]/80 flex items-center justify-between px-10 border-t border-gray-200/50 dark:border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-3 hover:bg-gray-200/50 dark:hover:bg-white/5 p-2 rounded-lg cursor-pointer transition-colors -ml-2">
          <div className={`w-8 h-8 rounded-full bg-${accentColor}-600 flex items-center justify-center border border-black/10 dark:border-white/10 text-white`}>
            <User size={16} />
          </div>
          <span className="text-xs font-semibold text-gray-800 dark:text-white">Admin User</span>
        </div>
        
        <div className="relative">
            <button 
                onClick={() => setShowPowerMenu(!showPowerMenu)}
                className={`p-2.5 rounded-lg transition-all ${showPowerMenu ? 'bg-gray-300 dark:bg-white/20' : 'hover:bg-gray-200/50 dark:hover:bg-white/10'} text-gray-700 dark:text-white`} 
                title="Power"
            >
              <Power size={18} />
            </button>

            {showPowerMenu && (
                <div 
                    ref={powerMenuRef}
                    className="absolute bottom-full right-0 mb-2 w-36 bg-[#f9f9f9]/95 dark:bg-[#2d2d2d]/95 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-lg shadow-xl py-1 animate-in fade-in zoom-in-95 duration-100 flex flex-col"
                >
                    <button onClick={() => window.location.reload()} className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-gray-800 dark:text-gray-200 hover:bg-blue-600 hover:text-white transition-colors text-left">
                        <ICONS.RefreshCw size={14} /> Restart
                    </button>
                    <button onClick={() => window.location.reload()} className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-gray-800 dark:text-gray-200 hover:bg-blue-600 hover:text-white transition-colors text-left">
                        <Power size={14} /> Shut down
                    </button>
                    <div className="h-[1px] bg-gray-200 dark:bg-white/10 my-1"></div>
                    <button onClick={() => { onClose(); }} className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-gray-800 dark:text-gray-200 hover:bg-blue-600 hover:text-white transition-colors text-left">
                        <ICONS.Moon size={14} /> Sleep
                    </button>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

const RecommendedItem = ({ name, time, icon }: { name: string, time: string, icon: React.ReactNode }) => (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200/50 dark:hover:bg-white/5 transition-colors cursor-pointer group">
        <div className="w-8 h-8 flex items-center justify-center">
            {icon}
        </div>
        <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{name}</span>
            <span className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{time}</span>
        </div>
    </div>
);

export default StartMenu;
