
import React, { useState, useEffect, useRef } from 'react';
import { ICONS } from '../../constants';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';
import { AppProps } from '../../types';

const ClockApp: React.FC<AppProps> = () => {
  const [activeTab, setActiveTab] = useState<'clock' | 'stopwatch' | 'timer'>('clock');

  // Clock State
  const [time, setTime] = useState(new Date());

  // Stopwatch State
  const [swTime, setSwTime] = useState(0);
  const [swRunning, setSwRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const swRef = useRef<any>(null);

  // Timer State
  const [timerDuration, setTimerDuration] = useState(5 * 60 * 1000); // 5 mins default
  const [timerLeft, setTimerLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef<any>(null);

  useEffect(() => {
      const t = setInterval(() => setTime(new Date()), 1000);
      return () => clearInterval(t);
  }, []);

  // Stopwatch Logic
  useEffect(() => {
      if (swRunning) {
          swRef.current = setInterval(() => setSwTime(p => p + 10), 10);
      } else {
          clearInterval(swRef.current);
      }
      return () => clearInterval(swRef.current);
  }, [swRunning]);

  // Timer Logic
  useEffect(() => {
      if (timerRunning && timerLeft > 0) {
          timerRef.current = setInterval(() => {
              setTimerLeft(p => {
                  if (p <= 10) {
                      setTimerRunning(false);
                      return 0;
                  }
                  return p - 10;
              });
          }, 10);
      } else {
          clearInterval(timerRef.current);
      }
      return () => clearInterval(timerRef.current);
  }, [timerRunning, timerLeft]);

  const formatSw = (ms: number) => {
      const m = Math.floor(ms / 60000);
      const s = Math.floor((ms % 60000) / 1000);
      const centi = Math.floor((ms % 1000) / 10);
      return (
          <div className="flex items-baseline gap-1 font-mono">
              <span className="text-6xl">{m.toString().padStart(2,'0')}</span>
              <span className="text-6xl">:</span>
              <span className="text-6xl">{s.toString().padStart(2,'0')}</span>
              <span className="text-4xl text-gray-400">.{centi.toString().padStart(2,'0')}</span>
          </div>
      );
  };

  return (
    <div className="flex h-full bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-white">
        {/* Sidebar */}
        <div className="w-16 bg-gray-100 dark:bg-[#252526] flex flex-col items-center py-4 gap-6 border-r border-gray-200 dark:border-gray-700">
            <button onClick={() => setActiveTab('clock')} className={`p-3 rounded-xl transition-colors ${activeTab === 'clock' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600' : 'hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500'}`}>
                <ICONS.Clock size={24} />
            </button>
            <button onClick={() => setActiveTab('stopwatch')} className={`p-3 rounded-xl transition-colors ${activeTab === 'stopwatch' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600' : 'hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500'}`}>
                <ICONS.StopCircle size={24} />
            </button>
            <button onClick={() => setActiveTab('timer')} className={`p-3 rounded-xl transition-colors ${activeTab === 'timer' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600' : 'hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500'}`}>
                <ICONS.Timer size={24} />
            </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 flex flex-col items-center justify-center relative overflow-hidden">
            {activeTab === 'clock' && (
                <div className="flex flex-col items-center animate-in zoom-in-95 duration-300">
                    <div className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-4">Local Time</div>
                    <div className="text-8xl font-bold tracking-tighter mb-2">
                        {time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false})}
                    </div>
                    <div className="text-2xl text-gray-500 font-light">
                        {time.toLocaleDateString([], {weekday: 'long', month: 'long', day: 'numeric'})}
                    </div>
                    
                    <div className="mt-12 grid grid-cols-3 gap-8 w-full max-w-2xl">
                        <div className="bg-gray-50 dark:bg-[#252526] p-4 rounded-2xl flex flex-col items-center">
                            <span className="text-xs font-bold text-gray-400 uppercase mb-1">London</span>
                            <span className="text-xl font-bold">
                                {new Date().toLocaleTimeString('en-GB', {timeZone: 'Europe/London', hour: '2-digit', minute:'2-digit'})}
                            </span>
                            <span className="text-xs text-gray-500">-8 HRS</span>
                        </div>
                        <div className="bg-gray-50 dark:bg-[#252526] p-4 rounded-2xl flex flex-col items-center">
                            <span className="text-xs font-bold text-gray-400 uppercase mb-1">New York</span>
                            <span className="text-xl font-bold">
                                {new Date().toLocaleTimeString('en-US', {timeZone: 'America/New_York', hour: '2-digit', minute:'2-digit'})}
                            </span>
                            <span className="text-xs text-gray-500">-3 HRS</span>
                        </div>
                        <div className="bg-gray-50 dark:bg-[#252526] p-4 rounded-2xl flex flex-col items-center">
                            <span className="text-xs font-bold text-gray-400 uppercase mb-1">Tokyo</span>
                            <span className="text-xl font-bold">
                                {new Date().toLocaleTimeString('ja-JP', {timeZone: 'Asia/Tokyo', hour: '2-digit', minute:'2-digit'})}
                            </span>
                            <span className="text-xs text-gray-500">+16 HRS</span>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'stopwatch' && (
                <div className="flex flex-col items-center w-full max-w-md animate-in slide-in-from-bottom-4 duration-300">
                    <div className="mb-12">
                        {formatSw(swTime)}
                    </div>
                    
                    <div className="flex gap-4 mb-8">
                        <button 
                            onClick={() => setSwRunning(!swRunning)}
                            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${swRunning ? 'bg-red-500 text-white shadow-red-500/30' : 'bg-green-500 text-white shadow-green-500/30'} shadow-lg`}
                        >
                            {swRunning ? <Pause fill="currentColor" /> : <Play fill="currentColor" className="ml-1" />}
                        </button>
                        <button 
                            onClick={() => {
                                if (swRunning) setLaps([swTime, ...laps]);
                                else { setSwTime(0); setLaps([]); }
                            }}
                            className="w-14 h-14 rounded-full bg-gray-200 dark:bg-[#333] flex items-center justify-center hover:bg-gray-300 dark:hover:bg-[#444] transition-colors"
                        >
                            {swRunning ? <Flag size={20} /> : <RotateCcw size={20} />}
                        </button>
                    </div>

                    <div className="w-full h-64 overflow-y-auto pr-2 custom-scrollbar">
                        {laps.map((lap, i) => (
                            <div key={i} className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-800 text-sm font-mono animate-in slide-in-from-top-2">
                                <span className="text-gray-500">Lap {laps.length - i}</span>
                                <span>{Math.floor(lap/1000)}.{Math.floor((lap%1000)/10).toString().padStart(2,'0')}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'timer' && (
                 <div className="flex flex-col items-center animate-in zoom-in-95 duration-300">
                     {/* Circular Progress */}
                     <div className="relative w-64 h-64 mb-8">
                         <svg className="w-full h-full -rotate-90">
                             <circle cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100 dark:text-[#252526]" />
                             <circle 
                                cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="8" fill="transparent" 
                                className="text-blue-500 transition-all duration-100 ease-linear"
                                strokeDasharray={2 * Math.PI * 120}
                                strokeDashoffset={2 * Math.PI * 120 * (1 - (timerLeft / timerDuration))}
                                strokeLinecap="round"
                             />
                         </svg>
                         <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
                             <span className="text-5xl font-bold">
                                 {Math.floor(timerLeft / 60000).toString().padStart(2,'0')}:
                                 {Math.floor((timerLeft % 60000) / 1000).toString().padStart(2,'0')}
                             </span>
                             <span className="text-sm text-gray-400 mt-2">{timerRunning ? 'Running' : 'Paused'}</span>
                         </div>
                     </div>
                     
                     <div className="flex gap-4">
                         {!timerRunning && timerLeft === 0 ? (
                              <div className="flex gap-2">
                                  {[1, 5, 10, 15].map(min => (
                                      <button 
                                        key={min}
                                        onClick={() => { setTimerDuration(min*60000); setTimerLeft(min*60000); setTimerRunning(true); }}
                                        className="px-4 py-2 bg-gray-100 dark:bg-[#333] rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 transition-colors text-sm font-medium"
                                      >
                                          {min} min
                                      </button>
                                  ))}
                              </div>
                         ) : (
                            <>
                                <button 
                                    onClick={() => setTimerRunning(!timerRunning)}
                                    className={`px-8 py-3 rounded-full font-bold text-white shadow-lg transition-transform hover:scale-105 ${timerRunning ? 'bg-yellow-500' : 'bg-green-500'}`}
                                >
                                    {timerRunning ? 'Pause' : 'Resume'}
                                </button>
                                <button 
                                    onClick={() => { setTimerRunning(false); setTimerLeft(0); }}
                                    className="px-8 py-3 rounded-full font-bold bg-gray-200 dark:bg-[#333] text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-[#444] transition-colors"
                                >
                                    Reset
                                </button>
                            </>
                         )}
                     </div>
                 </div>
            )}
        </div>
    </div>
  );
};

export default ClockApp;
