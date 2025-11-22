
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ICONS } from '../constants';
import { AppConfig, FileSystemNode } from '../types';
import { Moon, Sun, Wifi, Bluetooth, Monitor, Volume2 } from 'lucide-react';

interface SpotlightSearchProps {
  isOpen: boolean;
  onClose: () => void;
  apps: AppConfig[];
  onOpenApp: (id: string, data?: any) => void;
  fileSystem: FileSystemNode[];
  toggleTheme: () => void;
  isDarkMode: boolean;
}

type ResultType = 'app' | 'file' | 'setting';

interface SearchResult {
  id: string;
  type: ResultType;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  action: () => void;
}

const SpotlightSearch: React.FC<SpotlightSearchProps> = ({ 
  isOpen, 
  onClose, 
  apps, 
  onOpenApp, 
  fileSystem, 
  toggleTheme, 
  isDarkMode 
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const searchResults = useMemo(() => {
      if (!query.trim()) return [];

      const lowerQuery = query.toLowerCase();
      const results: SearchResult[] = [];

      // 1. Apps
      apps.forEach(app => {
          if (app.name.toLowerCase().includes(lowerQuery)) {
              results.push({
                  id: `app-${app.id}`,
                  type: 'app',
                  title: app.name,
                  subtitle: 'Application',
                  icon: <div className={`w-full h-full flex items-center justify-center rounded ${app.color} text-white`}><app.icon size={16} /></div>,
                  action: () => onOpenApp(app.id)
              });
          }
      });

      // 2. Settings
      const settings = [
          { id: 'toggle_theme', title: isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode', keys: ['dark', 'light', 'mode', 'theme'], icon: isDarkMode ? <Sun size={16} /> : <Moon size={16} />, action: toggleTheme },
          { id: 'wifi', title: 'Wi-Fi Settings', keys: ['wifi', 'internet', 'network'], icon: <Wifi size={16} />, action: () => onOpenApp('settings') },
          { id: 'bluetooth', title: 'Bluetooth Settings', keys: ['bluetooth', 'device'], icon: <Bluetooth size={16} />, action: () => onOpenApp('settings') },
          { id: 'display', title: 'Display Settings', keys: ['display', 'monitor', 'screen', 'brightness'], icon: <Monitor size={16} />, action: () => onOpenApp('settings') },
          { id: 'sound', title: 'Sound Settings', keys: ['sound', 'volume', 'audio'], icon: <Volume2 size={16} />, action: () => onOpenApp('settings') },
      ];

      settings.forEach(setting => {
          if (setting.title.toLowerCase().includes(lowerQuery) || setting.keys.some(k => k.includes(lowerQuery))) {
              results.push({
                  id: `setting-${setting.id}`,
                  type: 'setting',
                  title: setting.title,
                  subtitle: 'System Setting',
                  icon: <div className="w-full h-full flex items-center justify-center bg-gray-500 text-white rounded">{setting.icon}</div>,
                  action: setting.action
              });
          }
      });

      // 3. Files (Recursive)
      const searchFilesRecursive = (nodes: FileSystemNode[], path: string[]) => {
          for (const node of nodes) {
              if (node.type === 'file' && node.name.toLowerCase().includes(lowerQuery)) {
                  const extension = node.name.split('.').pop()?.toLowerCase();
                  let icon = <ICONS.FileText size={16} className="text-blue-500" />;
                  let openAction = () => onOpenApp('notepad', node.content);

                  if (['jpg', 'png', 'gif', 'webp'].includes(extension || '')) {
                      icon = <ICONS.ImageIcon size={16} className="text-purple-500" />;
                      openAction = () => onOpenApp('viewer', node.content);
                  } else if (['js', 'py', 'html', 'css', 'ts', 'json'].includes(extension || '')) {
                      icon = <ICONS.Code2 size={16} className="text-green-500" />;
                      openAction = () => onOpenApp('code', node.content);
                  } else if (['mp3', 'wav'].includes(extension || '')) {
                      icon = <ICONS.Music size={16} className="text-pink-500" />;
                      openAction = () => onOpenApp('music');
                  } else if (['mp4', 'mov'].includes(extension || '')) {
                      icon = <ICONS.Video size={16} className="text-red-500" />;
                      openAction = () => onOpenApp('video');
                  }

                  results.push({
                      id: `file-${node.id}`,
                      type: 'file',
                      title: node.name,
                      subtitle: path.join(' > '),
                      icon: <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-white/10 rounded">{icon}</div>,
                      action: openAction
                  });
              }
              if (node.children) {
                  searchFilesRecursive(node.children, [...path, node.name]);
              }
          }
      };
      searchFilesRecursive(fileSystem, ['Root']);

      return results;
  }, [query, apps, isDarkMode, fileSystem, toggleTheme, onOpenApp]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, searchResults.length - 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    }
    if (e.key === 'Enter') {
       if (searchResults[selectedIndex]) {
           searchResults[selectedIndex].action();
           onClose();
       }
    }
  };

  if (!isOpen) return null;

  const appResults = searchResults.filter(r => r.type === 'app');
  const settingResults = searchResults.filter(r => r.type === 'setting');
  const fileResults = searchResults.filter(r => r.type === 'file');

  const renderItem = (item: SearchResult, index: number) => (
       <div 
         key={item.id}
         onClick={() => { item.action(); onClose(); }}
         className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${index === selectedIndex ? 'bg-blue-500 text-white shadow-md' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-white/10'}`}
       >
         <div className={`w-8 h-8 flex-shrink-0 ${index === selectedIndex ? 'text-white' : ''}`}>{item.icon}</div>
         <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium truncate">{item.title}</span>
            {item.subtitle && <span className={`text-xs truncate ${index === selectedIndex ? 'text-blue-100' : 'text-gray-400'}`}>{item.subtitle}</span>}
         </div>
         {index === selectedIndex && <span className="ml-auto text-xs opacity-80 font-medium">Enter</span>}
       </div>
  );

  return (
    <div className="absolute inset-0 z-[9999] flex items-start justify-center pt-[15vh] bg-black/30 backdrop-blur-[2px]" onClick={onClose}>
      <div 
        className="w-[600px] bg-[#f9f9f9]/95 dark:bg-[#1c1c1e]/95 backdrop-blur-2xl rounded-xl shadow-2xl border border-white/20 dark:border-white/10 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 will-change-transform"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-4 border-b border-gray-200/50 dark:border-white/5 gap-3">
          <ICONS.Search size={24} className="text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Spotlight Search"
            className="flex-1 bg-transparent text-2xl font-light text-gray-800 dark:text-white placeholder-gray-400 outline-none"
            value={query}
            onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDown}
          />
        </div>
        
        <div className="max-h-[500px] overflow-y-auto p-2">
            {searchResults.length === 0 && query && (
                <div className="p-8 text-center text-gray-500">No results found for "{query}"</div>
            )}
            {appResults.length > 0 && (
                <div className="mb-2">
                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-3 py-1.5 uppercase tracking-wider">Applications</div>
                    {appResults.map(item => renderItem(item, searchResults.indexOf(item)))}
                </div>
            )}
            {settingResults.length > 0 && (
                <div className="mb-2">
                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-3 py-1.5 uppercase tracking-wider">Settings</div>
                    {settingResults.map(item => renderItem(item, searchResults.indexOf(item)))}
                </div>
            )}
            {fileResults.length > 0 && (
                <div className="mb-2">
                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-3 py-1.5 uppercase tracking-wider">Files</div>
                    {fileResults.map(item => renderItem(item, searchResults.indexOf(item)))}
                </div>
            )}
        </div>
        
        <div className="px-4 py-2 bg-gray-50 dark:bg-white/5 border-t border-gray-200/50 dark:border-white/5 flex justify-between items-center text-[10px] text-gray-400">
            <div className="flex gap-4">
                <span><span className="font-bold border border-gray-300 dark:border-gray-600 rounded px-1">↓</span> <span className="font-bold border border-gray-300 dark:border-gray-600 rounded px-1">↑</span> to navigate</span>
                <span><span className="font-bold border border-gray-300 dark:border-gray-600 rounded px-1">↵</span> to open</span>
            </div>
            <span>Windora OS</span>
        </div>
      </div>
    </div>
  );
};

export default SpotlightSearch;
