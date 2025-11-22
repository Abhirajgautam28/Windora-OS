
import React, { useState, useEffect } from 'react';
import { ICONS } from '../../constants';
import { AppProps } from '../../types';
import { Trash2, HardDrive } from 'lucide-react';
import { SystemSounds } from '../../services/soundService';

const DiskCleanupApp: React.FC<AppProps> = ({ addNotification }) => {
  const [scanning, setScanning] = useState(true);
  const [progress, setProgress] = useState(0);
  const [cleaned, setCleaned] = useState(false);
  
  const [items, setItems] = useState([
      { id: 'temp', name: 'Temporary Internet Files', size: 245, unit: 'MB', checked: true },
      { id: 'downloads', name: 'Downloaded Program Files', size: 12, unit: 'MB', checked: false },
      { id: 'recycle', name: 'Recycle Bin', size: 850, unit: 'MB', checked: true },
      { id: 'cache', name: 'System Cache', size: 120, unit: 'MB', checked: true },
      { id: 'logs', name: 'System Error Memory Dump', size: 45, unit: 'MB', checked: false },
      { id: 'thumbnails', name: 'Thumbnails', size: 15, unit: 'MB', checked: true },
  ]);

  useEffect(() => {
      // Simulate Scanning
      const interval = setInterval(() => {
          setProgress(prev => {
              if (prev >= 100) {
                  clearInterval(interval);
                  setScanning(false);
                  return 100;
              }
              return prev + Math.random() * 10;
          });
      }, 200);
      return () => clearInterval(interval);
  }, []);

  const handleToggle = (id: string) => {
      setItems(items.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const handleClean = () => {
      const totalSize = items.filter(i => i.checked).reduce((acc, curr) => acc + curr.size, 0);
      
      if (totalSize === 0) return;

      // Simulate deletion
      setScanning(true);
      setProgress(0);
      
      const interval = setInterval(() => {
          setProgress(prev => {
              if (prev >= 100) {
                  clearInterval(interval);
                  setScanning(false);
                  setCleaned(true);
                  SystemSounds.playNotification();
                  if (addNotification) addNotification('Disk Cleanup', `Successfully freed up ${totalSize} MB of space.`);
                  return 100;
              }
              return prev + 20;
          });
      }, 200);
  };

  const totalSelected = items.filter(i => i.checked).reduce((acc, curr) => acc + curr.size, 0);

  return (
    <div className="flex flex-col h-full bg-[#f0f0f0] dark:bg-[#1e1e1e] text-gray-900 dark:text-white font-sans text-sm p-4">
        <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white dark:bg-[#2d2d2d] rounded border border-gray-300 dark:border-gray-600 flex items-center justify-center shadow-sm">
                <ICONS.Brush size={20} className="text-gray-500 dark:text-gray-400" />
            </div>
            <div>
                <h2 className="font-bold text-base">Disk Cleanup for (C:)</h2>
                <span className="text-xs text-gray-500 dark:text-gray-400">Windora System Drive</span>
            </div>
        </div>

        {scanning ? (
            <div className="flex-1 flex flex-col items-center justify-center">
                <p className="mb-4 text-gray-600 dark:text-gray-300">{cleaned ? "Cleaning up files..." : "Calculating..."}</p>
                <div className="w-full max-w-xs h-4 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden border border-gray-400 dark:border-gray-600">
                    <div className="h-full bg-green-600 transition-all duration-200" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="mt-2 text-xs text-gray-500">Scanning: System Error Memory Dump Files...</p>
            </div>
        ) : cleaned ? (
            <div className="flex-1 flex flex-col items-center justify-center animate-in zoom-in-95">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 mb-4">
                    <ICONS.Check size={32} />
                </div>
                <h3 className="text-lg font-bold mb-2">Cleanup Complete</h3>
                <p className="text-gray-600 dark:text-gray-400 text-center">You have successfully freed up disk space on your system.</p>
                <button onClick={() => setCleaned(false)} className="mt-6 px-6 py-2 bg-gray-200 dark:bg-[#333] rounded hover:bg-gray-300 dark:hover:bg-[#444] transition-colors">Back</button>
            </div>
        ) : (
            <>
                <div className="bg-white dark:bg-[#2d2d2d] border border-gray-300 dark:border-gray-600 p-4 rounded mb-4">
                    <p className="mb-2">You can use Disk Cleanup to free up to <span className="font-bold">{items.reduce((acc, i) => acc + i.size, 0)} MB</span> of disk space on (C:).</p>
                    <div className="font-semibold mb-2 mt-4">Files to delete:</div>
                    <div className="border border-gray-300 dark:border-gray-600 h-48 overflow-y-auto bg-white dark:bg-[#252526]">
                        {items.map(item => (
                            <div key={item.id} className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 dark:hover:bg-white/5 cursor-pointer" onClick={() => handleToggle(item.id)}>
                                <input type="checkbox" checked={item.checked} onChange={() => {}} className="cursor-pointer" />
                                <div className="flex-1 flex justify-between">
                                    <span>{item.name}</span>
                                    <span>{item.size} {item.unit}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4">
                        <div className="font-semibold text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">Description</div>
                        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                            Downloaded Program Files are temporary ActiveX controls and Java applets downloaded automatically from the Internet when you view certain pages. They are temporarily stored in the Downloaded Program Files folder on your hard disk.
                        </p>
                    </div>
                </div>

                <div className="flex justify-end items-center gap-4 mt-auto">
                    <div className="mr-auto">
                        <span className="text-gray-600 dark:text-gray-400 mr-2">Total amount of disk space you gain:</span>
                        <span className="font-bold">{totalSelected} MB</span>
                    </div>
                    <button className="px-6 py-2 bg-white dark:bg-[#333] border border-gray-300 dark:border-gray-500 rounded hover:bg-gray-50 dark:hover:bg-[#444] transition-colors shadow-sm">
                        Clean up system files
                    </button>
                    <button onClick={handleClean} className="px-6 py-2 bg-blue-600 text-white border border-blue-700 rounded hover:bg-blue-700 transition-colors shadow-sm">
                        OK
                    </button>
                </div>
            </>
        )}
    </div>
  );
};

export default DiskCleanupApp;
