
import React, { useState, useEffect, useRef } from 'react';
import { ICONS } from '../../constants';
import { Mic, StopCircle, Play, Trash2, Share2 } from 'lucide-react';
import { AppProps } from '../../types';

const VoiceRecorderApp: React.FC<AppProps> = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [recordings, setRecordings] = useState<{id: number, name: string, duration: string, date: string}[]>([
      { id: 1, name: 'Meeting Notes', duration: '02:14', date: 'Yesterday' },
      { id: 2, name: 'Idea for App', duration: '00:45', date: '2 days ago' }
  ]);
  const [bars, setBars] = useState<number[]>(new Array(30).fill(20));
  const timerRef = useRef<any>(null);
  const visualizerRef = useRef<any>(null);

  useEffect(() => {
      return () => {
          if (timerRef.current) clearInterval(timerRef.current);
          if (visualizerRef.current) clearInterval(visualizerRef.current);
      };
  }, []);

  const toggleRecording = () => {
      if (isRecording) {
          // Stop
          setIsRecording(false);
          clearInterval(timerRef.current);
          clearInterval(visualizerRef.current);
          
          const mins = Math.floor(duration / 60);
          const secs = duration % 60;
          const durStr = `${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
          
          setRecordings([{
              id: Date.now(),
              name: `Recording ${recordings.length + 1}`,
              duration: durStr,
              date: 'Just now'
          }, ...recordings]);
          
          setDuration(0);
          setBars(new Array(30).fill(20));
      } else {
          // Start
          setIsRecording(true);
          timerRef.current = setInterval(() => setDuration(prev => prev + 1), 1000);
          
          // Simulate visualizer
          visualizerRef.current = setInterval(() => {
              setBars(prev => prev.map(() => Math.max(10, Math.random() * 100)));
          }, 100);
      }
  };

  const formatTime = (sec: number) => {
      const m = Math.floor(sec / 60);
      const s = sec % 60;
      return `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  };

  return (
    <div className="flex h-full bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-200">
       {/* Sidebar / List */}
       <div className="w-64 border-r border-gray-200 dark:border-gray-700 flex flex-col bg-gray-50 dark:bg-[#252526]">
           <div className="p-4 border-b border-gray-200 dark:border-gray-700 font-bold text-sm uppercase tracking-wider text-gray-500">Saved Recordings</div>
           <div className="flex-1 overflow-y-auto">
               {recordings.map(rec => (
                   <div key={rec.id} className="p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-white dark:hover:bg-white/5 cursor-pointer transition-colors group">
                       <div className="flex justify-between items-start mb-1">
                           <span className="font-medium text-sm">{rec.name}</span>
                           <span className="text-xs text-gray-400">{rec.duration}</span>
                       </div>
                       <div className="flex justify-between items-center">
                           <span className="text-[10px] text-gray-400">{rec.date}</span>
                           <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                               <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"><Play size={12} /></button>
                               <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full text-red-500"><Trash2 size={12} /></button>
                           </div>
                       </div>
                   </div>
               ))}
           </div>
       </div>

       {/* Main Recording Area */}
       <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
           <div className="absolute inset-0 opacity-5 pointer-events-none">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full blur-[100px]"></div>
           </div>

           <div className="text-6xl font-mono font-light tracking-widest mb-12 relative z-10">
               {formatTime(duration)}
           </div>

           {/* Visualizer */}
           <div className="h-32 flex items-center gap-1 mb-16">
               {bars.map((h, i) => (
                   <div 
                     key={i} 
                     className="w-2 bg-gradient-to-t from-blue-500 to-purple-500 rounded-full transition-all duration-100 ease-out"
                     style={{ height: `${h}%`, opacity: isRecording ? 1 : 0.3 }}
                   ></div>
               ))}
           </div>

           <button 
             onClick={toggleRecording}
             className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all transform hover:scale-105 active:scale-95 ${isRecording ? 'bg-white border-4 border-red-500' : 'bg-red-500 hover:bg-red-600'}`}
           >
               {isRecording ? (
                   <div className="w-8 h-8 bg-red-500 rounded-md"></div>
               ) : (
                   <div className="w-8 h-8 bg-white rounded-full"></div>
               )}
           </button>
           
           <div className="mt-4 text-sm text-gray-500 font-medium">
               {isRecording ? 'Recording...' : 'Ready to record'}
           </div>
       </div>
    </div>
  );
};

export default VoiceRecorderApp;
