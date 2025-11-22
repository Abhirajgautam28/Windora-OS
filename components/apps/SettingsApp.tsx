
import React, { useState, useEffect } from 'react';
import { ICONS } from '../../constants';
import { AppProps } from '../../types';

interface SettingsAppProps extends AppProps {
  wallpaperIndex?: number;
  setWallpaperIndex?: React.Dispatch<React.SetStateAction<number>>;
  lockWallpaperIndex?: number;
  setLockWallpaperIndex?: React.Dispatch<React.SetStateAction<number>>;
}

const SettingsApp: React.FC<SettingsAppProps> = ({ wallpaperIndex, setWallpaperIndex, accentColor, setAccentColor, lockWallpaperIndex, setLockWallpaperIndex, isDarkMode, toggleTheme }) => {
  const [activeTab, setActiveTab] = useState('system');
  const [powerMode, setPowerMode] = useState('balanced');
  const [batterySaver, setBatterySaver] = useState(false);
  const [personalizationMode, setPersonalizationMode] = useState<'background' | 'lockscreen'>('background');
  
  // Update Logic
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'checking' | 'available' | 'downloading' | 'installing' | 'restart'>('idle');
  const [updateProgress, setUpdateProgress] = useState(0);

  useEffect(() => {
      if (updateStatus === 'checking') {
          setTimeout(() => setUpdateStatus('available'), 2000);
      } else if (updateStatus === 'downloading') {
          const interval = setInterval(() => {
              setUpdateProgress(prev => {
                  if (prev >= 100) {
                      clearInterval(interval);
                      setUpdateStatus('installing');
                      return 0;
                  }
                  return prev + 2;
              });
          }, 100);
          return () => clearInterval(interval);
      } else if (updateStatus === 'installing') {
           const interval = setInterval(() => {
              setUpdateProgress(prev => {
                  if (prev >= 100) {
                      clearInterval(interval);
                      setUpdateStatus('restart');
                      return 100;
                  }
                  return prev + 1;
              });
          }, 200);
          return () => clearInterval(interval);
      }
  }, [updateStatus]);

  const handleCheckUpdate = () => {
      setUpdateStatus('checking');
      setUpdateProgress(0);
  };

  const handleDownload = () => {
      setUpdateStatus('downloading');
  };

  const SidebarItem = ({ id, icon: Icon, label }: any) => (
      <button 
        onClick={() => setActiveTab(id)}
        className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === id ? `bg-${accentColor || 'blue'}-50 dark:bg-${accentColor || 'blue'}-900/30 text-${accentColor || 'blue'}-600 dark:text-${accentColor || 'blue'}-400` : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'}`}
      >
          <Icon size={18} />
          {label}
      </button>
  );

  const colors = ['blue', 'purple', 'green', 'orange', 'red', 'pink'];

  return (
    <div className="flex h-full bg-[#f3f3f3] dark:bg-[#191919] text-gray-900 dark:text-gray-100 transition-colors font-sans">
       {/* Sidebar */}
       <div className="w-64 bg-[#f0f0f0] dark:bg-[#202020] border-r border-gray-200 dark:border-gray-700 p-4 flex flex-col gap-1">
           <div className="flex items-center gap-3 px-4 mb-6 mt-2">
               <div className={`w-8 h-8 bg-${accentColor || 'blue'}-600 rounded-full flex items-center justify-center text-white`}>
                   <ICONS.User size={16} />
               </div>
               <div className="flex flex-col">
                   <span className="text-sm font-bold">Admin User</span>
                   <span className="text-xs text-gray-500 dark:text-gray-400">Local Account</span>
               </div>
           </div>
           
           <div className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">General</div>
           <SidebarItem id="system" icon={ICONS.Monitor} label="System" />
           <SidebarItem id="devices" icon={ICONS.Bluetooth} label="Bluetooth & Devices" />
           <SidebarItem id="network" icon={ICONS.Wifi} label="Network & Internet" />
           <SidebarItem id="personalization" icon={ICONS.ImageIcon} label="Personalization" />
           <SidebarItem id="apps" icon={ICONS.LayoutGrid} label="Apps" />
           
           <div className="px-4 mb-2 mt-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Security</div>
           <SidebarItem id="privacy" icon={ICONS.Shield} label="Privacy & Security" />
           <SidebarItem id="update" icon={ICONS.RefreshCw} label="Windora Update" />
           <SidebarItem id="about" icon={ICONS.Info} label="About" />
       </div>

       {/* Content */}
       <div className="flex-1 overflow-y-auto p-8">
           {activeTab !== 'power' && <h2 className="text-2xl font-bold mb-6 capitalize">{activeTab.replace('-', ' ')}</h2>}
           
           {activeTab === 'system' && (
               <div className="space-y-4 max-w-2xl">
                   <div className="bg-white dark:bg-[#2d2d2d] p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between">
                       <div className="flex items-center gap-4">
                           <ICONS.Monitor size={24} className="text-gray-500 dark:text-gray-400" />
                           <div>
                               <div className="font-medium">Display</div>
                               <div className="text-sm text-gray-500 dark:text-gray-400">Brightness, night light, scale</div>
                           </div>
                       </div>
                       <ICONS.ChevronRight size={20} className="text-gray-400" />
                   </div>
                   <div className="bg-white dark:bg-[#2d2d2d] p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between">
                       <div className="flex items-center gap-4">
                           <ICONS.Volume2 size={24} className="text-gray-500 dark:text-gray-400" />
                           <div>
                               <div className="font-medium">Sound</div>
                               <div className="text-sm text-gray-500 dark:text-gray-400">Volume, output devices</div>
                           </div>
                       </div>
                       <ICONS.ChevronRight size={20} className="text-gray-400" />
                   </div>
                   <div 
                        className="bg-white dark:bg-[#2d2d2d] p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                        onClick={() => setActiveTab('power')}
                   >
                       <div className="flex items-center gap-4">
                           <ICONS.Battery size={24} className="text-gray-500 dark:text-gray-400" />
                           <div>
                               <div className="font-medium">Power & Battery</div>
                               <div className="text-sm text-gray-500 dark:text-gray-400">Sleep, battery usage, battery saver</div>
                           </div>
                       </div>
                       <ICONS.ChevronRight size={20} className="text-gray-400" />
                   </div>
               </div>
           )}

           {activeTab === 'power' && (
               <div className="space-y-6 max-w-3xl animate-in fade-in slide-in-from-right-4 duration-200">
                   <button 
                     onClick={() => setActiveTab('system')}
                     className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-2"
                   >
                       <ICONS.ArrowLeft size={16} /> System
                   </button>
                   
                   <h2 className="text-2xl font-bold mb-6">Power & Battery</h2>
                   
                   {/* Battery Graph */}
                   <div className="bg-white dark:bg-[#2d2d2d] p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                       <div className="flex justify-between items-end mb-6">
                           <div>
                               <div className="text-sm text-gray-500 dark:text-gray-400">Battery levels</div>
                               <div className="text-3xl font-bold">98%</div>
                               <div className="text-xs text-gray-400 mt-1">Estimated time remaining: 7 hr 20 min</div>
                           </div>
                           <ICONS.Battery size={48} className="text-green-500" />
                       </div>
                       <div className="h-40 flex items-end gap-1 border-b border-gray-200 dark:border-gray-600 pb-0">
                            {Array.from({length: 24}).map((_, i) => {
                                const height = 30 + Math.sin(i/3) * 20 + Math.random() * 20;
                                return (
                                    <div key={i} className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-t-sm overflow-hidden relative h-full group">
                                        <div 
                                            className={`absolute bottom-0 left-0 right-0 ${i > 18 ? 'bg-gray-300 dark:bg-gray-600 dashed' : 'bg-green-500'}`} 
                                            style={{ height: `${height}%` }}
                                        ></div>
                                        <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none">
                                            {i}:00
                                        </div>
                                    </div>
                                );
                            })}
                       </div>
                       <div className="flex justify-between mt-2 text-xs text-gray-400">
                           <span>12 AM</span>
                           <span>6 AM</span>
                           <span>12 PM</span>
                           <span>6 PM</span>
                           <span>12 AM</span>
                       </div>
                   </div>

                   <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-8 mb-2">Power</h3>

                   {/* Power Mode */}
                   <div className="bg-white dark:bg-[#2d2d2d] p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <ICONS.Zap size={24} className="text-gray-500 dark:text-gray-400" />
                                <div>
                                    <div className="font-medium">Power Mode</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Optimize your device based on power use and performance</div>
                                </div>
                            </div>
                            <select 
                                value={powerMode}
                                onChange={(e) => setPowerMode(e.target.value)}
                                className="bg-gray-100 dark:bg-black/20 border-none rounded-md px-3 py-2 text-sm focus:ring-2 ring-blue-500 outline-none cursor-pointer hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                            >
                                <option value="efficiency">Best power efficiency</option>
                                <option value="balanced">Balanced</option>
                                <option value="performance">Best performance</option>
                            </select>
                        </div>
                   </div>
                   
                   {/* Battery Saver */}
                   <div className="bg-white dark:bg-[#2d2d2d] p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <ICONS.Shield size={24} className="text-gray-500 dark:text-gray-400" />
                            <div>
                                <div className="font-medium">Battery Saver</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">Extend battery life by limiting some notifications and background activity</div>
                            </div>
                        </div>
                        <button 
                            onClick={() => setBatterySaver(!batterySaver)}
                            className={`w-12 h-6 rounded-full relative transition-colors ${batterySaver ? `bg-${accentColor || 'blue'}-600` : 'bg-gray-300 dark:bg-gray-600'}`}
                        >
                             <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200 ${batterySaver ? 'left-7' : 'left-1'}`}></div>
                        </button>
                   </div>
               </div>
           )}

           {activeTab === 'personalization' && (
               <div className="space-y-6">
                   <div className="bg-white dark:bg-[#2d2d2d] p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                       <div className="flex justify-center mb-6 gap-4">
                           <button 
                                onClick={() => setPersonalizationMode('background')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${personalizationMode === 'background' ? `bg-${accentColor || 'blue'}-100 text-${accentColor || 'blue'}-700 dark:bg-${accentColor || 'blue'}-900/40 dark:text-${accentColor || 'blue'}-300` : 'hover:bg-gray-100 dark:hover:bg-white/5'}`}
                           >
                               Background
                           </button>
                           <button 
                                onClick={() => setPersonalizationMode('lockscreen')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${personalizationMode === 'lockscreen' ? `bg-${accentColor || 'blue'}-100 text-${accentColor || 'blue'}-700 dark:bg-${accentColor || 'blue'}-900/40 dark:text-${accentColor || 'blue'}-300` : 'hover:bg-gray-100 dark:hover:bg-white/5'}`}
                           >
                               Lock Screen
                           </button>
                       </div>

                       <h3 className="font-medium mb-4">{personalizationMode === 'background' ? 'Desktop Background' : 'Lock Screen Background'}</h3>
                       <div className="flex gap-4 overflow-x-auto pb-2">
                           {[1, 2, 3, 4].map((_, i) => (
                               <div 
                                   key={i} 
                                   onClick={() => {
                                       if (personalizationMode === 'background' && setWallpaperIndex) setWallpaperIndex(i);
                                       if (personalizationMode === 'lockscreen' && setLockWallpaperIndex) setLockWallpaperIndex(i);
                                   }}
                                   className={`w-32 h-20 rounded-lg bg-gray-200 dark:bg-gray-700 border-2 cursor-pointer transition-all relative overflow-hidden 
                                       ${(personalizationMode === 'background' ? wallpaperIndex : lockWallpaperIndex) === i ? `border-${accentColor || 'blue'}-500` : 'border-transparent hover:border-gray-400'}
                                   `}
                               >
                                   <div className={`absolute inset-0 bg-gradient-to-br ${i===0 ? 'from-blue-900 to-slate-900' : i===1 ? 'from-blue-400 to-purple-500' : i===2 ? 'from-green-400 to-blue-500' : 'from-orange-400 to-red-500'}`}></div>
                                   {((personalizationMode === 'background' ? wallpaperIndex : lockWallpaperIndex) === i) && (
                                       <div className={`absolute bottom-1 right-1 bg-${accentColor || 'blue'}-500 text-white rounded-full p-0.5`}>
                                           <ICONS.Check size={10} />
                                       </div>
                                   )}
                               </div>
                           ))}
                       </div>
                   </div>
                   
                   <div className="bg-white dark:bg-[#2d2d2d] p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                       <h3 className="font-medium mb-4">Accent Color</h3>
                       <div className="flex gap-3">
                           {colors.map(c => (
                               <button 
                                   key={c}
                                   onClick={() => setAccentColor && setAccentColor(c)}
                                   className={`w-8 h-8 rounded-full bg-${c}-500 flex items-center justify-center hover:scale-110 transition-transform ring-2 ${accentColor === c ? 'ring-offset-2 ring-gray-400 dark:ring-gray-500' : 'ring-transparent'}`}
                               >
                                   {accentColor === c && <ICONS.Check size={14} className="text-white" />}
                               </button>
                           ))}
                       </div>
                   </div>

                   <div className="bg-white dark:bg-[#2d2d2d] p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                       <h3 className="font-medium mb-4">Colors</h3>
                       <div className="flex items-center justify-between">
                           <span>Choose your mode</span>
                           <select 
                                value={isDarkMode ? 'Dark' : 'Light'}
                                onChange={(e) => {
                                    if (e.target.value === 'Dark' && !isDarkMode && toggleTheme) toggleTheme();
                                    if (e.target.value === 'Light' && isDarkMode && toggleTheme) toggleTheme();
                                }}
                                className="bg-gray-100 dark:bg-black/20 border-none rounded px-3 py-1 text-sm outline-none cursor-pointer"
                           >
                               <option value="Light">Light</option>
                               <option value="Dark">Dark</option>
                           </select>
                       </div>
                   </div>
               </div>
           )}

           {activeTab === 'update' && (
               <div className="max-w-3xl space-y-6 animate-in fade-in slide-in-from-right-4">
                    <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                            <ICONS.RefreshCw size={48} className={`text-${accentColor || 'blue'}-500 ${updateStatus === 'checking' || updateStatus === 'installing' ? 'animate-spin' : ''}`} />
                            <div>
                                <h1 className="text-xl font-bold">Windora Update</h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {updateStatus === 'idle' ? 'You\'re up to date' : 
                                     updateStatus === 'checking' ? 'Checking for updates...' :
                                     updateStatus === 'available' ? 'Updates available' :
                                     updateStatus === 'restart' ? 'Restart required' :
                                     'Installing updates...'}
                                </p>
                                {updateStatus === 'idle' && <div className="text-xs text-gray-400 mt-1">Last checked: Today, {new Date().toLocaleTimeString()}</div>}
                            </div>
                        </div>
                        
                        {updateStatus === 'idle' && (
                            <button 
                                onClick={handleCheckUpdate}
                                className={`px-4 py-2 bg-${accentColor || 'blue'}-600 text-white rounded-md text-sm font-medium hover:bg-${accentColor || 'blue'}-700 transition-colors`}
                            >
                                Check for updates
                            </button>
                        )}
                    </div>

                    {updateStatus !== 'idle' && updateStatus !== 'checking' && (
                        <div className="bg-white dark:bg-[#2d2d2d] p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                            <div className="flex justify-between items-center mb-3">
                                <div className="font-medium">2025-10 Cumulative Update for Windora OS 25H1 (KB5034441)</div>
                                <span className="text-sm text-gray-500">{updateStatus === 'available' ? 'Pending download' : `${updateProgress}%`}</span>
                            </div>
                            
                            {updateStatus === 'available' ? (
                                <button 
                                    onClick={handleDownload}
                                    className={`px-4 py-1.5 bg-${accentColor || 'blue'}-600 text-white rounded-md text-sm font-medium hover:bg-${accentColor || 'blue'}-700 transition-colors`}
                                >
                                    Download & install
                                </button>
                            ) : updateStatus === 'restart' ? (
                                <button 
                                    onClick={() => window.location.reload()}
                                    className={`px-4 py-1.5 bg-${accentColor || 'blue'}-600 text-white rounded-md text-sm font-medium hover:bg-${accentColor || 'blue'}-700 transition-colors`}
                                >
                                    Restart now
                                </button>
                            ) : (
                                <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full bg-${accentColor || 'blue'}-500 transition-all duration-200`} 
                                        style={{ width: `${updateProgress}%` }}
                                    ></div>
                                </div>
                            )}
                        </div>
                    )}
               </div>
           )}

           {activeTab === 'about' && (
               <div className="space-y-6 max-w-3xl">
                   <div className="flex items-center gap-6 mb-8">
                       <ICONS.Monitor size={64} className={`text-${accentColor || 'blue'}-500`} />
                       <div>
                           <h1 className="text-3xl font-bold">Windora OS</h1>
                           <p className="text-gray-500">Version 25H1 (OS Build 22621.3007)</p>
                           <p className="text-gray-500 text-sm">© 2025 Windora Corporation. All rights reserved.</p>
                       </div>
                   </div>

                   <div className="bg-white dark:bg-[#2d2d2d] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                       <div className="p-4 border-b border-gray-100 dark:border-gray-700/50 font-medium text-sm">Device specifications</div>
                       <div className="p-6 space-y-4 text-sm">
                           <div className="grid grid-cols-[120px_1fr] gap-4">
                               <span className="text-gray-500 dark:text-gray-400">Device name</span>
                               <span>WINDORA-DESKTOP</span>
                           </div>
                           <div className="grid grid-cols-[120px_1fr] gap-4">
                               <span className="text-gray-500 dark:text-gray-400">Processor</span>
                               <span>Intel(R) Core(TM) i9-14900K CPU @ 3.20GHz</span>
                           </div>
                           <div className="grid grid-cols-[120px_1fr] gap-4">
                               <span className="text-gray-500 dark:text-gray-400">Installed RAM</span>
                               <span>64.0 GB (63.8 GB usable)</span>
                           </div>
                           <div className="grid grid-cols-[120px_1fr] gap-4">
                               <span className="text-gray-500 dark:text-gray-400">System type</span>
                               <span>64-bit operating system, x64-based processor</span>
                           </div>
                       </div>
                       <div className="bg-gray-50 dark:bg-black/20 p-3 px-6 flex justify-end">
                           <button className="px-4 py-1.5 bg-white dark:bg-[#3d3d3d] border border-gray-200 dark:border-gray-600 rounded text-xs font-medium shadow-sm hover:bg-gray-50 dark:hover:bg-[#444] transition-colors">Copy</button>
                       </div>
                   </div>
               </div>
           )}

           {activeTab === 'privacy' && (
               <div className="bg-white dark:bg-[#2d2d2d] p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
                   <div className="flex items-center justify-between">
                       <div>
                           <div className="font-medium">Find My Device</div>
                           <div className="text-sm text-gray-500 dark:text-gray-400">Track your device if you think you've lost it</div>
                       </div>
                       <div className={`w-10 h-5 bg-${accentColor || 'blue'}-600 rounded-full relative cursor-pointer`}>
                           <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm"></div>
                       </div>
                   </div>
                   <div className="h-[1px] bg-gray-100 dark:bg-gray-700"></div>
                   <div className="flex items-center justify-between">
                       <div>
                           <div className="font-medium">Camera Access</div>
                           <div className="text-sm text-gray-500 dark:text-gray-400">Allow apps to access your camera</div>
                       </div>
                       <div className={`w-10 h-5 bg-${accentColor || 'blue'}-600 rounded-full relative cursor-pointer`}>
                           <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm"></div>
                       </div>
                   </div>
               </div>
           )}
       </div>
    </div>
  );
};

export default SettingsApp;
