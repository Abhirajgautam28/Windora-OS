
import React, { useState } from 'react';
import { ICONS } from '../constants';

interface ControlCenterProps {
  isOpen: boolean;
  onClose: () => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
  isNightLight: boolean;
  toggleNightLight: () => void;
  accentColor?: string;
}

const ControlCenter: React.FC<ControlCenterProps> = ({ isOpen, onClose, toggleTheme, isDarkMode, isNightLight, toggleNightLight, accentColor = 'blue' }) => {
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(true);
  const [airplane, setAirplane] = useState(false);
  const [volume, setVolume] = useState(80);
  const [brightness, setBrightness] = useState(100);

  if (!isOpen) return null;
  
  const activeClass = `bg-${accentColor}-500 text-white`;

  return (
    <div 
      className="absolute bottom-16 right-4 w-80 bg-[#f9f9f9]/90 dark:bg-[#1c1c1e]/90 backdrop-blur-2xl rounded-2xl border border-white/20 dark:border-white/10 shadow-2xl z-[7000] animate-in slide-in-from-bottom-4 fade-in duration-200 p-4 select-none will-change-transform"
      onClick={(e) => e.stopPropagation()}
    >
        {/* Toggles Grid */}
        <div className="grid grid-cols-4 gap-3 mb-6">
            <div className="flex flex-col gap-2 col-span-2 row-span-2">
                 <button 
                    onClick={() => setWifi(!wifi)}
                    className={`flex-1 flex items-center gap-3 px-4 rounded-xl transition-all ${wifi ? activeClass : 'bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-white'}`}
                 >
                    <ICONS.Wifi size={20} />
                    <span className="text-sm font-medium">{wifi ? 'Wi-Fi' : 'Off'}</span>
                 </button>
                 <button 
                    onClick={() => setBluetooth(!bluetooth)}
                    className={`flex-1 flex items-center gap-3 px-4 rounded-xl transition-all ${bluetooth ? activeClass : 'bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-white'}`}
                 >
                    <ICONS.Bluetooth size={20} />
                    <span className="text-sm font-medium">{bluetooth ? 'Bluetooth' : 'Off'}</span>
                 </button>
            </div>

            <button 
               onClick={() => setAirplane(!airplane)}
               className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${airplane ? activeClass : 'bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-white/20'}`}
            >
               <ICONS.Zap size={20} />
               <span className="text-[10px] font-medium">Airplane</span>
            </button>

            <button 
               onClick={toggleNightLight}
               className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${isNightLight ? 'bg-orange-500 text-white' : 'bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-white/20'}`}
            >
               <ICONS.Eye size={20} />
               <span className="text-[10px] font-medium">Night Light</span>
            </button>

            <button 
               onClick={toggleTheme}
               className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 dark:bg-white/10 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-white/20'}`}
            >
               {isDarkMode ? <ICONS.Moon size={20} /> : <ICONS.Sun size={20} />}
               <span className="text-[10px] font-medium">Theme</span>
            </button>

            <button 
               className="aspect-square rounded-xl flex flex-col items-center justify-center gap-1 bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-white/20 transition-all"
            >
               <ICONS.User size={20} />
               <span className="text-[10px] font-medium">Admin</span>
            </button>
        </div>

        {/* Sliders */}
        <div className="space-y-4">
            <div className="flex items-center gap-3 bg-white dark:bg-white/10 p-3 rounded-xl border border-gray-200 dark:border-transparent">
                <ICONS.Sun size={20} className="text-gray-500 dark:text-gray-300" />
                <input 
                    type="range" 
                    min="0" max="100" 
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className={`flex-1 h-1 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-${accentColor}-500`}
                />
            </div>
            <div className="flex items-center gap-3 bg-white dark:bg-white/10 p-3 rounded-xl border border-gray-200 dark:border-transparent">
                <ICONS.Volume2 size={20} className="text-gray-500 dark:text-gray-300" />
                <input 
                    type="range" 
                    min="0" max="100" 
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className={`flex-1 h-1 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-${accentColor}-500`}
                />
            </div>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-white/10 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
             <span>85% Battery</span>
             <button className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full"><ICONS.Settings size={14} /></button>
        </div>
    </div>
  );
};

export default ControlCenter;
