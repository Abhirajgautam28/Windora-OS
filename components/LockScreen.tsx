
import React, { useState, useEffect } from 'react';
import { Lock, Unlock, User, Wifi, Battery } from 'lucide-react';
import { WALLPAPER_URLS } from '../constants';

interface LockScreenProps {
  onUnlock: () => void;
  wallpaperIndex?: number;
}

const LockScreen: React.FC<LockScreenProps> = ({ onUnlock, wallpaperIndex = 3 }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isScanning, setIsScanning] = useState(false);
  const [authStatus, setAuthStatus] = useState<'idle' | 'scanning' | 'success' | 'failed'>('idle');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleUnlockRequest = () => {
    if (authStatus === 'success') return;
    
    setAuthStatus('scanning');
    setIsScanning(true);
    
    // Simulate Face ID scan
    setTimeout(() => {
      setIsScanning(false);
      setAuthStatus('success');
      setTimeout(() => {
        onUnlock();
      }, 800);
    }, 1500);
  };

  return (
    <div 
      className="absolute inset-0 z-[9000] bg-cover bg-center flex flex-col items-center justify-between text-white overflow-hidden transition-all duration-1000"
      style={{ backgroundImage: `url(${WALLPAPER_URLS[wallpaperIndex]})` }}
      onClick={handleUnlockRequest}
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>

      {/* Header */}
      <div className="relative z-10 w-full p-8 flex justify-center flex-col items-center mt-16">
        <div className="text-8xl font-thin tracking-tighter mb-2 text-shadow-lg">
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
        </div>
        <div className="text-xl font-medium tracking-wide opacity-90 text-shadow">
          {currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Auth Center */}
      <div className="relative z-10 flex flex-col items-center gap-6 mb-32">
        <div className="relative">
           <div className={`w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-500 ${authStatus === 'scanning' ? 'scale-110 border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.5)]' : ''}`}>
              {authStatus === 'success' ? (
                <Unlock size={32} className="text-green-400" />
              ) : (
                <User size={40} className="text-white" />
              )}
           </div>
           {authStatus === 'scanning' && (
             <div className="absolute inset-[-10px] border-2 border-blue-400/50 rounded-full animate-ping"></div>
           )}
        </div>

        <div className="h-8 flex items-center justify-center">
           {authStatus === 'idle' && <span className="text-sm opacity-70 animate-pulse">Click to unlock with Windora Hello</span>}
           {authStatus === 'scanning' && <span className="text-sm font-medium text-blue-300">Scanning Face...</span>}
           {authStatus === 'success' && <span className="text-sm font-medium text-green-400">Welcome back, Admin</span>}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 w-full p-6 flex justify-end gap-6 opacity-80">
         <Wifi size={20} />
         <Battery size={20} />
      </div>
    </div>
  );
};

export default LockScreen;
