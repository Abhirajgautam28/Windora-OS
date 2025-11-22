
import React from 'react';
import { X, Wifi, Bluetooth, Moon, Sun, Bell, Settings, Eye, Trash2, BellOff } from 'lucide-react';
import { OSNotification, AppConfig } from '../types';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
  isNightLight: boolean;
  toggleNightLight: () => void;
  notifications: OSNotification[];
  clearNotifications: () => void;
  apps: AppConfig[];
  isFocusMode: boolean;
  toggleFocusMode: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ 
  isOpen, 
  onClose, 
  toggleTheme, 
  isDarkMode, 
  isNightLight, 
  toggleNightLight,
  notifications,
  clearNotifications,
  apps,
  isFocusMode,
  toggleFocusMode
}) => {
  if (!isOpen) return null;

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - new Date(date).getTime()) / 60000); 
    if (diff < 1) return 'Now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return 'Yesterday';
  };

  const getAppIcon = (appId: string) => {
      if (appId === 'system') return <Bell size={12} />;
      const app = apps.find(a => a.id === appId);
      return app ? <app.icon size={12} /> : <Bell size={12} />;
  };

  const getAppName = (appId: string) => {
      if (appId === 'system') return 'System';
      const app = apps.find(a => a.id === appId);
      return app ? app.name : 'System';
  };

  const getAppColor = (appId: string) => {
      if (appId === 'system') return 'bg-blue-500';
      const app = apps.find(a => a.id === appId);
      return app ? app.color.split(' ')[0] : 'bg-gray-500';
  };

  return (
    <div className="absolute top-10 right-2 w-80 h-[calc(100vh-100px)] bg-[#f9f9f9]/95 dark:bg-[#1c1c1e]/95 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl z-[6000] overflow-hidden flex flex-col animate-in slide-in-from-right-10 duration-200 text-gray-900 dark:text-white will-change-transform">
       <div className="p-4 border-b border-gray-200/50 dark:border-white/10 flex justify-between items-center">
          <span className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              Notifications {isFocusMode && <BellOff size={14} className="text-gray-400" />}
          </span>
          <div className="flex gap-2">
             {notifications.length > 0 && (
                 <button onClick={clearNotifications} className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors text-gray-500 dark:text-gray-400" title="Clear all">
                    <Trash2 size={14} />
                 </button>
             )}
             <button onClick={onClose} className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors">
                <X size={16} className="text-gray-500 dark:text-gray-400" />
             </button>
          </div>
       </div>

       <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {isFocusMode && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 p-3 rounded-xl flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                      <BellOff size={16} />
                  </div>
                  <div>
                      <div className="text-xs font-bold">Focus Assist is On</div>
                      <div className="text-[10px] opacity-70">You won't hear notification sounds.</div>
                  </div>
              </div>
          )}

          {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                  <Bell size={32} className="mb-2 opacity-20" />
                  <span className="text-sm">No new notifications</span>
              </div>
          ) : (
              notifications.map(notif => (
                  <div key={notif.id} className="bg-white dark:bg-white/5 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 animate-in slide-in-from-right-4 fade-in duration-300">
                     <div className="flex items-center gap-2 mb-1">
                        <div className={`w-5 h-5 rounded flex items-center justify-center text-white ${getAppColor(notif.appId)}`}>
                            {getAppIcon(notif.appId)}
                        </div>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{getAppName(notif.appId)}</span>
                        <span className="text-[10px] text-gray-400 ml-auto">{formatTime(notif.timestamp)}</span>
                     </div>
                     <div className="text-sm font-medium text-gray-800 dark:text-white mt-1">{notif.title}</div>
                     <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-tight">{notif.message}</div>
                  </div>
              ))
          )}
       </div>

       <div className="p-4 bg-gray-50/50 dark:bg-white/5 border-t border-gray-200/50 dark:border-white/10">
          <div className="grid grid-cols-4 gap-2 mb-4">
             <button className="aspect-square rounded-xl bg-blue-500 text-white flex flex-col items-center justify-center gap-1 hover:opacity-90 transition-opacity">
                <Wifi size={20} />
             </button>
             <button className="aspect-square rounded-xl bg-blue-500 text-white flex flex-col items-center justify-center gap-1 hover:opacity-90 transition-opacity">
                <Bluetooth size={20} />
             </button>
             <button 
                onClick={toggleFocusMode}
                className={`aspect-square rounded-xl ${isFocusMode ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'} flex flex-col items-center justify-center gap-1 hover:opacity-90 transition-colors`}
                title="Focus Assist"
             >
                {isFocusMode ? <BellOff size={20} /> : <Bell size={20} />}
             </button>
             <button 
                onClick={toggleNightLight}
                className={`aspect-square rounded-xl ${isNightLight ? 'bg-orange-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'} flex flex-col items-center justify-center gap-1 hover:opacity-90 transition-colors`}
             >
                <Eye size={20} />
             </button>
             <button 
                onClick={toggleTheme}
                className={`aspect-square rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200 text-gray-800'} flex flex-col items-center justify-center gap-1 hover:opacity-90 transition-colors`}
             >
                {isDarkMode ? <Moon size={20} className="text-white" /> : <Sun size={20} />}
             </button>
             <button className="aspect-square rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white flex flex-col items-center justify-center gap-1 hover:opacity-90 transition-opacity">
                <Settings size={20} />
             </button>
          </div>
          
          <div className="bg-white dark:bg-white/10 p-3 rounded-xl flex items-center gap-3">
             <Sun size={16} className="text-gray-500 dark:text-gray-400" />
             <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                <div className="w-[70%] h-full bg-blue-500"></div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default NotificationCenter;
