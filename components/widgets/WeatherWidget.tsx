
import React from 'react';
import { CloudSun, Map, Wind, Droplets } from 'lucide-react';

const WeatherWidget = () => {
  return (
    <div className="w-64 h-32 p-4 text-gray-800 dark:text-white flex flex-col justify-between bg-gradient-to-br from-blue-400/20 to-purple-400/20">
       <div className="flex justify-between items-start">
           <div>
               <div className="flex items-center gap-1 text-xs font-medium opacity-70 mb-1">
                   <Map size={10} /> San Francisco
               </div>
               <div className="text-4xl font-bold tracking-tighter">72°</div>
           </div>
           <CloudSun size={40} className="text-yellow-500" />
       </div>
       
       <div className="flex justify-between items-end">
           <div className="text-xs font-medium">Partly Cloudy</div>
           <div className="flex gap-3 text-[10px] opacity-70">
               <div className="flex items-center gap-1"><Wind size={10} /> 8mph</div>
               <div className="flex items-center gap-1"><Droplets size={10} /> 12%</div>
           </div>
       </div>
    </div>
  );
};

export default WeatherWidget;
