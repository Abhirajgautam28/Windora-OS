
import React, { useState, useEffect } from 'react';

const ClockWidget = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
      const timer = setInterval(() => setTime(new Date()), 1000);
      return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-40 h-40 flex flex-col items-center justify-center p-4 text-gray-800 dark:text-white relative">
       <div className="text-3xl font-bold tracking-tight">
           {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
       </div>
       <div className="text-xs opacity-60 uppercase tracking-wider font-medium mt-1">
           {time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
       </div>
       
       {/* Analog Ring Simulation */}
       <div className="absolute inset-2 border-4 border-white/10 rounded-full"></div>
       <div className="absolute inset-2 border-t-4 border-blue-500/50 rounded-full animate-spin [animation-duration:3s]"></div>
    </div>
  );
};

export default ClockWidget;
