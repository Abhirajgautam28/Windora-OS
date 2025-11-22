
import React, { useEffect, useState } from 'react';
import { Cpu, Activity, HardDrive, Wifi } from 'lucide-react';
import { AppProps } from '../../types';

const SystemMonitorApp: React.FC<AppProps> = () => {
  const [cpuData, setCpuData] = useState<number[]>(new Array(20).fill(0));
  const [memData, setMemData] = useState<number[]>(new Array(20).fill(0));

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuData(prev => [...prev.slice(1), Math.random() * 30 + 10]); // Random 10-40% load
      setMemData(prev => [...prev.slice(1), Math.random() * 10 + 40]); // Random 40-50% load
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const drawGraph = (data: number[], color: string) => {
      return (
          <div className="flex items-end gap-1 h-16 w-full">
              {data.map((val, i) => (
                  <div key={i} className={`flex-1 ${color} opacity-50 rounded-t-sm transition-all duration-500`} style={{ height: `${val}%` }}></div>
              ))}
          </div>
      )
  }

  return (
    <div className="flex h-full bg-white text-gray-800">
       <div className="w-48 bg-gray-50 border-r border-gray-200 p-2 space-y-1">
           <div className="p-2 bg-blue-100 rounded flex items-center gap-3 cursor-pointer">
               <Cpu size={20} className="text-blue-600" />
               <div className="flex flex-col">
                   <span className="text-xs font-bold">CPU</span>
                   <span className="text-xs text-gray-500">{Math.round(cpuData[cpuData.length - 1])}%</span>
               </div>
           </div>
           <div className="p-2 hover:bg-gray-100 rounded flex items-center gap-3 cursor-pointer">
               <Activity size={20} className="text-purple-600" />
               <div className="flex flex-col">
                   <span className="text-xs font-bold">Memory</span>
                   <span className="text-xs text-gray-500">8.2 / 16 GB</span>
               </div>
           </div>
           <div className="p-2 hover:bg-gray-100 rounded flex items-center gap-3 cursor-pointer">
               <HardDrive size={20} className="text-green-600" />
               <div className="flex flex-col">
                   <span className="text-xs font-bold">Disk 0 (C:)</span>
                   <span className="text-xs text-gray-500">SSD</span>
               </div>
           </div>
           <div className="p-2 hover:bg-gray-100 rounded flex items-center gap-3 cursor-pointer">
               <Wifi size={20} className="text-red-600" />
               <div className="flex flex-col">
                   <span className="text-xs font-bold">Wi-Fi</span>
                   <span className="text-xs text-gray-500">S: 240 Mbps</span>
               </div>
           </div>
       </div>
       
       <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto">
           <div>
               <h3 className="text-lg font-bold mb-2">CPU Usage</h3>
               <div className="bg-gray-50 border rounded p-4">
                   <div className="flex justify-between mb-4 text-sm text-gray-500">
                       <span>Utilization</span>
                       <span>100%</span>
                   </div>
                   {drawGraph(cpuData, 'bg-blue-500')}
                   <div className="grid grid-cols-3 gap-4 mt-4 text-xs">
                       <div>
                           <span className="text-gray-500 block">Speed</span>
                           <span className="text-lg">3.20 GHz</span>
                       </div>
                       <div>
                           <span className="text-gray-500 block">Processes</span>
                           <span className="text-lg">142</span>
                       </div>
                       <div>
                           <span className="text-gray-500 block">Up time</span>
                           <span className="text-lg">0:04:21:12</span>
                       </div>
                   </div>
               </div>
           </div>

           <div>
               <h3 className="text-lg font-bold mb-2">Memory Usage</h3>
               <div className="bg-gray-50 border rounded p-4">
                   {drawGraph(memData, 'bg-purple-500')}
                   <div className="flex justify-between mt-2 text-xs text-gray-500">
                       <span>In use (Compressed)</span>
                       <span>Available</span>
                   </div>
                   <div className="flex justify-between text-sm font-bold">
                       <span>8.2 GB (120 MB)</span>
                       <span>7.8 GB</span>
                   </div>
               </div>
           </div>
       </div>
    </div>
  );
};

export default SystemMonitorApp;
