
import React, { useState, useEffect } from 'react';
import { ICONS } from '../constants';

interface SystemTrayProps {
  onToggleControlCenter: () => void;
  onToggleCalendar: () => void;
  isControlCenterOpen: boolean;
  isCalendarOpen: boolean;
}

const SystemTray: React.FC<SystemTrayProps> = ({ onToggleControlCenter, onToggleCalendar, isControlCenterOpen, isCalendarOpen }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center h-full gap-1 pl-2">
      {/* Status Icons Group */}
      <button 
        onClick={(e) => { e.stopPropagation(); onToggleControlCenter(); }}
        className={`h-[85%] px-2 flex items-center gap-2 rounded-md transition-all hover:bg-white/10 active:bg-white/20 ${isControlCenterOpen ? 'bg-white/10' : ''}`}
        title="Control Center"
      >
         <ICONS.ChevronUp size={12} className="text-white/70" />
         <ICONS.Wifi size={16} className="text-white" />
         <ICONS.Volume2 size={16} className="text-white" />
         <ICONS.Battery size={16} className="text-white" />
      </button>

      {/* Clock */}
      <button 
         onClick={(e) => { e.stopPropagation(); onToggleCalendar(); }}
         className={`h-[85%] px-2 flex flex-col justify-center items-end rounded-md transition-all hover:bg-white/10 active:bg-white/20 text-right min-w-[70px] ${isCalendarOpen ? 'bg-white/10' : ''}`}
      >
         <span className="text-xs font-medium text-white leading-tight">
             {time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}
         </span>
         <span className="text-[10px] text-white/80 leading-tight">
             {time.toLocaleDateString([], { month: 'numeric', day: 'numeric', year: 'numeric' })}
         </span>
      </button>

      {/* Show Desktop Helper */}
      <div className="w-1.5 h-[60%] border-l border-white/20 ml-1"></div>
    </div>
  );
};

export default SystemTray;
