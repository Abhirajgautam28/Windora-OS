
import React, { useState, useEffect, useRef } from 'react';
import { ICONS } from '../constants';

interface RunDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onRun: (command: string) => void;
}

const RunDialog: React.FC<RunDialogProps> = ({ isOpen, onClose, onRun }) => {
    const [input, setInput] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setInput('');
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (input.trim()) {
            onRun(input.trim());
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-end left-4 bottom-4 pointer-events-none">
            <div className="pointer-events-auto bg-[#f0f0f0] dark:bg-[#2d2d2d] border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl w-[400px] overflow-hidden mb-16 ml-2 animate-in slide-in-from-bottom-4 zoom-in-95 duration-200">
                 <div className="flex justify-between items-center px-3 py-2 bg-white dark:bg-[#333]">
                     <span className="text-xs font-medium text-gray-700 dark:text-white">Run</span>
                     <button onClick={onClose} className="hover:bg-red-500 hover:text-white p-1 rounded"><ICONS.XIcon size={12} /></button>
                 </div>
                 <div className="p-4 flex gap-4">
                     <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
                         <ICONS.Command size={32} className="text-blue-600 dark:text-blue-400" />
                     </div>
                     <div className="flex-1">
                         <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">Type the name of a program, folder, document, or Internet resource, and Windora will open it for you.</p>
                         <div className="flex items-center gap-2 mb-4">
                             <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Open:</span>
                             <form onSubmit={handleSubmit} className="flex-1">
                                 <input 
                                    ref={inputRef}
                                    type="text" 
                                    className="w-full border border-gray-300 dark:border-gray-600 dark:bg-[#1e1e1e] dark:text-white px-2 py-1 text-sm outline-none focus:border-blue-500"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                 />
                             </form>
                         </div>
                         <div className="flex justify-end gap-2">
                             <button onClick={() => handleSubmit()} className="px-4 py-1 bg-gray-200 dark:bg-[#444] border border-gray-300 dark:border-gray-500 rounded-sm text-xs hover:bg-gray-300 dark:hover:bg-[#555] text-gray-800 dark:text-white shadow-sm transition-colors min-w-[70px]">OK</button>
                             <button onClick={onClose} className="px-4 py-1 bg-gray-200 dark:bg-[#444] border border-gray-300 dark:border-gray-500 rounded-sm text-xs hover:bg-gray-300 dark:hover:bg-[#555] text-gray-800 dark:text-white shadow-sm transition-colors min-w-[70px]">Cancel</button>
                         </div>
                     </div>
                 </div>
            </div>
        </div>
    );
};

export default RunDialog;
