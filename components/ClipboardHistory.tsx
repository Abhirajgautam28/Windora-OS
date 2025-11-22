
import React from 'react';
import { ICONS } from '../constants';
import { X, Trash2, Copy } from 'lucide-react';

interface ClipboardHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  history: string[];
  onSelect: (text: string) => void;
  onClear: () => void;
  accentColor: string;
}

const ClipboardHistory: React.FC<ClipboardHistoryProps> = ({ isOpen, onClose, history, onSelect, onClear, accentColor }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed bottom-16 right-4 w-80 bg-[#f9f9f9]/95 dark:bg-[#1c1c1e]/95 backdrop-blur-2xl rounded-xl shadow-2xl border border-white/20 dark:border-white/10 z-[7000] flex flex-col overflow-hidden animate-in slide-in-from-right-10 duration-200"
      style={{ maxHeight: '500px' }}
    >
      <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-white/50 dark:bg-black/20">
        <div className="flex items-center gap-2">
            <ICONS.Clipboard size={16} className={`text-${accentColor}-600 dark:text-${accentColor}-400`} />
            <span className="text-sm font-bold text-gray-800 dark:text-white">Clipboard</span>
        </div>
        <div className="flex gap-1">
            {history.length > 0 && (
                <button onClick={onClear} className="p-1.5 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 rounded-md transition-colors" title="Clear All">
                    <Trash2 size={14} />
                </button>
            )}
            <button onClick={onClose} className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-md transition-colors text-gray-500 dark:text-gray-400">
                <X size={14} />
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
        {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <ICONS.Clipboard size={32} className="mb-2 opacity-30" />
                <span className="text-xs">Clipboard is empty</span>
                <span className="text-[10px] opacity-70 mt-1">Copy something to see it here</span>
            </div>
        ) : (
            history.map((item, i) => (
                <div 
                    key={i} 
                    onClick={() => onSelect(item)}
                    className="group bg-white dark:bg-[#2c2c2e] p-3 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500/50 transition-all active:scale-[0.98]"
                >
                    <div className="text-xs text-gray-800 dark:text-gray-200 line-clamp-3 whitespace-pre-wrap break-words font-mono">
                        {item}
                    </div>
                    <div className="mt-2 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[9px] text-gray-400">Click to paste</span>
                        <Copy size={10} className="text-gray-400" />
                    </div>
                </div>
            ))
        )}
      </div>
      
      <div className="p-2 bg-gray-50 dark:bg-[#252526] border-t border-gray-200 dark:border-gray-700 text-[10px] text-center text-gray-500 dark:text-gray-400">
          Press <kbd className="font-sans bg-gray-200 dark:bg-[#333] px-1 rounded">Alt</kbd> + <kbd className="font-sans bg-gray-200 dark:bg-[#333] px-1 rounded">V</kbd> to toggle
      </div>
    </div>
  );
};

export default ClipboardHistory;
