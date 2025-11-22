
import React, { useEffect, useState } from 'react';
import { Activity, Cpu, HardDrive } from 'lucide-react';

const SystemInfoWidget = () => {
  const [cpu, setCpu] = useState(0);
  const [ram, setRam] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpu(Math.floor(Math.random() * 30) + 10);
      setRam(Math.floor(Math.random() * 20) + 40);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-64 h-32 p-4 bg-white/50 dark:bg-black/50 text-gray-800 dark:text-white flex flex-col justify-between">
      <div className="flex items-center gap-2 border-b border-gray-400/20 pb-2">
        <Activity size={16} className="text-blue-500" />
        <span className="text-xs font-bold uppercase">System Load</span>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
           <Cpu size={14} className="text-gray-500" />
           <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
               <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${cpu}%` }}></div>
           </div>
           <span className="text-xs w-8 text-right">{cpu}%</span>
        </div>
        <div className="flex items-center gap-3">
           <HardDrive size={14} className="text-gray-500" />
           <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
               <div className="h-full bg-purple-500 transition-all duration-500" style={{ width: `${ram}%` }}></div>
           </div>
           <span className="text-xs w-8 text-right">{ram}%</span>
        </div>
      </div>
    </div>
  );
};

export default SystemInfoWidget;
