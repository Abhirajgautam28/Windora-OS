
import React, { useState } from 'react';
import { ICONS } from '../../constants';
import { AppProps } from '../../types';

const ChromeApp: React.FC<AppProps> = () => {
  const [url, setUrl] = useState('https://www.google.com');
  const [inputValue, setInputValue] = useState('https://www.google.com');
  const [tabs, setTabs] = useState([
      { id: 1, title: 'New Tab', active: true, favicon: null }
  ]);

  const handleNavigate = (e: React.FormEvent) => {
      e.preventDefault();
      let target = inputValue;
      if (!target.startsWith('http')) target = 'https://' + target;
      setUrl(target);
  };

  const handleNewTab = () => {
      const newId = Math.max(...tabs.map(t => t.id)) + 1;
      setTabs(prev => prev.map(t => ({ ...t, active: false })).concat({ id: newId, title: 'New Tab', active: true, favicon: null }));
  };

  const handleCloseTab = (id: number, e: React.MouseEvent) => {
      e.stopPropagation();
      if (tabs.length === 1) return;
      const newTabs = tabs.filter(t => t.id !== id);
      // If closing active, active last
      if (tabs.find(t => t.id === id)?.active) {
          newTabs[newTabs.length - 1].active = true;
      }
      setTabs(newTabs);
  };

  const activateTab = (id: number) => {
      setTabs(prev => prev.map(t => ({ ...t, active: t.id === id })));
  };

  return (
    <div className="flex flex-col h-full bg-[#dfe3e7] dark:bg-[#202124] text-gray-800 dark:text-gray-200">
        {/* Title Bar / Tabs Area */}
        <div className="h-10 flex items-end px-2 gap-1 pt-2">
             {tabs.map(tab => (
                 <div 
                    key={tab.id}
                    onClick={() => activateTab(tab.id)}
                    className={`
                        group relative h-8 px-3 min-w-[140px] max-w-[200px] rounded-t-lg flex items-center gap-2 text-xs select-none cursor-default transition-colors
                        ${tab.active ? 'bg-white dark:bg-[#35363a] text-gray-800 dark:text-white shadow-sm z-10' : 'bg-transparent hover:bg-white/40 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400'}
                    `}
                 >
                     <ICONS.Globe size={14} className={tab.active ? 'text-blue-500' : 'text-gray-400'} />
                     <span className="flex-1 truncate">{tab.title}</span>
                     <button 
                        onClick={(e) => handleCloseTab(tab.id, e)}
                        className="p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
                     >
                         <ICONS.XIcon size={10} />
                     </button>
                     
                     {/* Tab Separator (visual) */}
                     {!tab.active && <div className="absolute right-[-1px] top-1.5 bottom-1.5 w-[1px] bg-gray-400/30"></div>}
                 </div>
             ))}
             <button onClick={handleNewTab} className="p-1.5 hover:bg-white/40 dark:hover:bg-white/10 rounded-full text-gray-600 dark:text-gray-400 transition-colors ml-1">
                 <ICONS.Plus size={16} />
             </button>
        </div>

        {/* Navigation Bar */}
        <div className="bg-white dark:bg-[#35363a] p-2 flex items-center gap-2 border-b border-gray-200 dark:border-black/20 shadow-sm z-20">
            <div className="flex gap-1 text-gray-500 dark:text-gray-400">
                <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full"><ICONS.ArrowLeft size={16} /></button>
                <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full"><ICONS.ArrowRight size={16} /></button>
                <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full"><ICONS.RotateCcw size={14} /></button>
            </div>
            
            {/* Omnibox */}
            <form onSubmit={handleNavigate} className="flex-1">
                <div className="bg-[#f1f3f4] dark:bg-[#202124] rounded-full h-8 flex items-center px-3 border border-transparent focus-within:border-blue-500 focus-within:bg-white dark:focus-within:bg-[#202124] focus-within:shadow-md transition-all">
                    <ICONS.Info size={14} className="text-gray-500 mr-2" />
                    <input 
                        type="text" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-sm text-gray-800 dark:text-white"
                    />
                    <button type="button" className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full">
                        <ICONS.Star size={14} className="text-gray-400" />
                    </button>
                </div>
            </form>

            <div className="flex gap-1 text-gray-500 dark:text-gray-400">
                <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full"><ICONS.User size={16} /></button>
                <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full"><ICONS.MoreVertical size={16} /></button>
            </div>
        </div>

        {/* Bookmarks Bar */}
        <div className="bg-white dark:bg-[#35363a] px-2 py-1 flex gap-2 border-b border-gray-200 dark:border-black/20 text-xs text-gray-600 dark:text-gray-300">
             <button className="flex items-center gap-1 px-2 py-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full">
                 <ICONS.Chrome size={12} className="text-red-500" /> Gmail
             </button>
             <button className="flex items-center gap-1 px-2 py-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full">
                 <ICONS.Video size={12} className="text-red-600" /> YouTube
             </button>
             <button className="flex items-center gap-1 px-2 py-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full">
                 <ICONS.Map size={12} className="text-green-500" /> Maps
             </button>
        </div>

        {/* Web Content Area (Simulated) */}
        <div className="flex-1 bg-white dark:bg-[#202124] overflow-y-auto flex flex-col items-center pt-20">
             <div className="mb-8">
                 <span className="text-6xl font-bold text-gray-500/30 select-none">Google</span>
             </div>
             
             <div className="w-full max-w-lg relative">
                 <ICONS.Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
                 <input 
                    type="text" 
                    className="w-full h-11 pl-12 pr-10 rounded-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#303134] shadow-sm hover:shadow-md focus:shadow-md outline-none transition-shadow text-gray-800 dark:text-white"
                 />
                 <div className="absolute right-4 top-3 text-gray-400">
                     <ICONS.Mic size={18} />
                 </div>
             </div>

             <div className="flex gap-4 mt-8">
                 <button className="px-4 py-2 bg-[#f8f9fa] dark:bg-[#303134] border border-transparent hover:border-gray-300 dark:hover:border-gray-500 rounded text-sm text-gray-800 dark:text-white">Google Search</button>
                 <button className="px-4 py-2 bg-[#f8f9fa] dark:bg-[#303134] border border-transparent hover:border-gray-300 dark:hover:border-gray-500 rounded text-sm text-gray-800 dark:text-white">I'm Feeling Lucky</button>
             </div>
             
             <div className="mt-auto w-full bg-[#f2f2f2] dark:bg-[#171717] border-t border-gray-200 dark:border-white/10 text-xs text-gray-500 dark:text-gray-400 p-4 flex justify-between">
                 <div className="flex gap-4">
                     <span>About</span>
                     <span>Advertising</span>
                     <span>Business</span>
                 </div>
                 <div className="flex gap-4">
                     <span>Privacy</span>
                     <span>Terms</span>
                     <span>Settings</span>
                 </div>
             </div>
        </div>
    </div>
  );
};

export default ChromeApp;
