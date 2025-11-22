
import React, { useState } from 'react';
import { ICONS } from '../../constants';
import { Download, Star, Check, Loader2, Trash2, Play } from 'lucide-react';
import { AppProps, AppConfig } from '../../types';

const AppStoreApp: React.FC<AppProps> = ({ apps = [], installedAppIds = [], onInstallApp, onOpenApp, onUninstallApp }) => {
  const [activeCategory, setActiveCategory] = useState('Home');
  const [installingApps, setInstallingApps] = useState<Record<string, number>>({}); // appId -> progress %

  // Filter out system apps that shouldn't be "uninstallable" or shown as regular store items ideally
  // For this simulation, we treat 'files', 'browser', 'store', 'settings', 'terminal' as core.
  const CORE_APPS = ['files', 'browser', 'store', 'settings', 'terminal', 'notepad'];

  const getAppCategory = (id: string) => {
      switch(id) {
          case 'code': return 'Developer Tools';
          case 'paint': case 'camera': case 'viewer': return 'Creativity';
          case 'music': case 'video': return 'Entertainment';
          case 'calculator': case 'monitor': return 'Productivity';
          default: return 'Utilities';
      }
  };

  const getAppRating = (id: string) => {
      // Deterministic fake ratings based on ID char codes
      const val = id.split('').reduce((a,b) => a + b.charCodeAt(0), 0);
      return (4.0 + (val % 10) / 10).toFixed(1);
  };

  // Apps available in the store (excluding core system apps usually, but let's show installed ones too)
  const storeApps = apps.filter(app => !['files', 'settings', 'terminal', 'store', 'notepad'].includes(app.id));

  const handleInstall = (app: AppConfig) => {
      if (installingApps[app.id]) return;
      
      // Start install simulation
      setInstallingApps(prev => ({ ...prev, [app.id]: 0 }));
      
      let progress = 0;
      const interval = setInterval(() => {
          progress += Math.random() * 15 + 5;
          if (progress > 100) progress = 100;
          
          setInstallingApps(prev => ({ ...prev, [app.id]: progress }));
          
          if (progress === 100) {
              clearInterval(interval);
              setTimeout(() => {
                  if (onInstallApp) onInstallApp(app.id);
                  setInstallingApps(prev => {
                      const next = { ...prev };
                      delete next[app.id];
                      return next;
                  });
              }, 500);
          }
      }, 200);
  };

  const renderAppCard = (app: AppConfig, featured = false) => {
      const isInstalled = installedAppIds.includes(app.id);
      const isInstalling = installingApps[app.id] !== undefined;
      const progress = installingApps[app.id] || 0;

      return (
        <div key={app.id} className={`bg-white dark:bg-[#2d2d2d] p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all cursor-default group ${featured ? 'col-span-2 flex gap-4' : ''}`}>
            <div className={`relative ${featured ? 'w-24 h-24' : 'w-16 h-16'} rounded-2xl ${app.color} text-white flex items-center justify-center mb-4 shadow-md group-hover:scale-105 transition-transform flex-shrink-0`}>
                <app.icon size={featured ? 48 : 32} />
                {isInstalling && (
                    <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center backdrop-blur-[1px]">
                        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    </div>
                )}
            </div>
            
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className={`font-bold text-gray-800 dark:text-white truncate ${featured ? 'text-lg' : 'text-sm'}`}>{app.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{getAppCategory(app.id)}</p>
                    </div>
                </div>
                
                {featured && <p className="text-xs text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">Experience the power of {app.name}. The best tool for your workflow on Windora OS.</p>}

                <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-400">
                        {getAppRating(app.id)} <Star size={10} fill="currentColor" className="text-yellow-400" />
                    </div>
                    
                    {isInstalling ? (
                         <div className="w-16 h-6 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden relative">
                             <div className="h-full bg-blue-500 transition-all duration-200" style={{ width: `${progress}%` }}></div>
                         </div>
                    ) : isInstalled ? (
                        <div className="flex gap-2">
                             <button 
                                onClick={() => onOpenApp && onOpenApp(app.id)}
                                className="text-xs bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white px-3 py-1.5 rounded-full font-semibold hover:bg-gray-200 dark:hover:bg-white/20 transition-colors flex items-center gap-1"
                             >
                                Open
                             </button>
                             {!CORE_APPS.includes(app.id) && (
                                 <button 
                                    onClick={() => onUninstallApp && onUninstallApp(app.id)}
                                    className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 rounded-full transition-colors"
                                    title="Uninstall"
                                 >
                                     <Trash2 size={14} />
                                 </button>
                             )}
                        </div>
                    ) : (
                        <button 
                            onClick={() => handleInstall(app)}
                            className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-4 py-1.5 rounded-full font-bold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                        >
                            Get
                        </button>
                    )}
                </div>
            </div>
        </div>
      );
  };

  const featuredApp = storeApps.find(a => a.id === 'code') || storeApps[0];
  const popularApps = storeApps.filter(a => a.id !== featuredApp.id);

  return (
    <div className="flex flex-col h-full bg-[#f9f9f9] dark:bg-[#191919] text-gray-900 dark:text-white transition-colors select-none">
       {/* Header */}
       <div className="h-16 border-b border-gray-200 dark:border-white/10 flex items-center px-6 gap-4 bg-white dark:bg-[#202020]">
           <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white shadow-lg">
               <ICONS.ShoppingBag size={18} />
           </div>
           <div className="font-bold text-xl tracking-tight">Windora Store</div>
           
           <div className="flex px-4 gap-6 ml-8 text-sm font-medium text-gray-500 dark:text-gray-400">
               {['Home', 'Apps', 'Games', 'Updates'].map(cat => (
                   <button 
                        key={cat}
                        onClick={() => setActiveCategory(cat)} 
                        className={`hover:text-black dark:hover:text-white transition-colors relative ${activeCategory === cat ? 'text-black dark:text-white' : ''}`}
                   >
                       {cat}
                       {activeCategory === cat && <div className="absolute -bottom-5 left-0 right-0 h-0.5 bg-blue-500 rounded-t-full"></div>}
                   </button>
               ))}
           </div>

           <div className="flex-1"></div>
           <div className="relative">
               <ICONS.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
               <input type="text" placeholder="Search apps..." className="bg-gray-100 dark:bg-white/10 rounded-full pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:ring-2 ring-blue-500/20 w-64 transition-all" />
           </div>
           <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center">
               <ICONS.User size={16} className="text-gray-500 dark:text-gray-400" />
           </div>
       </div>

       <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
           {activeCategory === 'Home' && (
               <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
                   {/* Hero */}
                   <div className="h-72 rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-12 flex flex-col justify-center shadow-xl relative overflow-hidden mb-10">
                       <div className="relative z-10 max-w-lg">
                           <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 border border-white/10">Editor's Choice</div>
                           <h1 className="text-5xl font-bold mb-4 leading-tight">Unleash Your Creativity</h1>
                           <p className="text-lg opacity-90 mb-8">Discover the new suite of pro-level tools now available on Windora OS.</p>
                           <button className="px-8 py-3 bg-white text-black rounded-full font-bold hover:scale-105 transition-transform shadow-lg">Explore Collection</button>
                       </div>
                       <ICONS.Palette size={350} className="absolute -right-20 -bottom-20 opacity-20 rotate-12 text-white mix-blend-overlay" />
                       <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-black/20 to-transparent"></div>
                   </div>

                   {/* Sections */}
                   <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                       <Star className="text-yellow-500 fill-yellow-500" size={20} /> Essential Apps
                   </h2>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                       {renderAppCard(featuredApp, true)}
                       {popularApps.slice(0, 2).map(app => renderAppCard(app))}
                   </div>
                   
                   <h2 className="text-xl font-bold mb-6">Recommended for You</h2>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                       {popularApps.slice(2).map(app => renderAppCard(app))}
                       {/* Re-render some to fill grid if needed, or show 'Coming Soon' placeholders */}
                   </div>

                   <div className="mt-12 p-8 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-500/20 flex items-center justify-between">
                       <div>
                           <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-1">Windora Developer Program</h3>
                           <p className="text-sm text-blue-700 dark:text-blue-300">Build the next generation of apps using our Universal Framework.</p>
                       </div>
                       <button className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20">Get Started</button>
                   </div>
               </div>
           )}
           
           {activeCategory !== 'Home' && (
               <div className="flex flex-col items-center justify-center h-full text-gray-400">
                   <ICONS.Construction size={48} className="mb-4 opacity-50" />
                   <p>This section is under construction.</p>
               </div>
           )}
       </div>
    </div>
  );
};

export default AppStoreApp;
