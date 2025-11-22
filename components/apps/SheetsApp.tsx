
import React, { useState } from 'react';
import { ICONS } from '../../constants';
import { AppProps } from '../../types';

const COLS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const ROWS = Array.from({ length: 20 }, (_, i) => i + 1);

const SheetsApp: React.FC<AppProps> = () => {
  const [data, setData] = useState<Record<string, string>>({});
  const [selectedCell, setSelectedCell] = useState<string | null>('A1');
  const [formula, setFormula] = useState('');

  const handleCellClick = (cellId: string) => {
    setSelectedCell(cellId);
    setFormula(data[cellId] || '');
  };

  const handleCellChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedCell) {
        const val = e.target.value;
        setFormula(val);
        setData(prev => ({ ...prev, [selectedCell]: val }));
    }
  };

  const handleGridChange = (cellId: string, value: string) => {
      setData(prev => ({ ...prev, [cellId]: value }));
      if (cellId === selectedCell) setFormula(value);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-200 font-sans text-xs">
        {/* Toolbar */}
        <div className="h-16 flex flex-col border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#2d2d2d]">
            <div className="flex items-center gap-2 px-2 py-1 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-1 text-green-700 dark:text-green-500 font-bold pr-4 border-r border-gray-200 dark:border-gray-600">
                    <ICONS.Table size={18} /> Sheets
                </div>
                <button className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded"><ICONS.Save size={14} /></button>
                <button className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded"><ICONS.RotateCcw size={14} /></button>
                <button className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded"><ICONS.RotateCw size={14} /></button>
            </div>
            <div className="flex items-center px-2 py-1 gap-2">
                <div className="w-8 h-6 bg-white dark:bg-[#1e1e1e] border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-500 font-mono">
                    {selectedCell}
                </div>
                <div className="flex-1 relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 italic">fx</span>
                    <input 
                        className="w-full h-6 pl-8 pr-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#1e1e1e] focus:outline-none focus:border-blue-500"
                        value={formula}
                        onChange={handleCellChange}
                    />
                </div>
            </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-auto relative">
            <div className="inline-block min-w-full">
                {/* Header Row */}
                <div className="flex sticky top-0 z-10">
                    <div className="w-10 h-6 bg-gray-100 dark:bg-[#333] border-r border-b border-gray-300 dark:border-gray-600 flex-shrink-0"></div>
                    {COLS.map(col => (
                        <div key={col} className="w-24 h-6 bg-gray-100 dark:bg-[#333] border-r border-b border-gray-300 dark:border-gray-600 flex items-center justify-center font-semibold text-gray-600 dark:text-gray-400 flex-shrink-0">
                            {col}
                        </div>
                    ))}
                </div>

                {/* Rows */}
                {ROWS.map(row => (
                    <div key={row} className="flex h-6">
                        <div className="w-10 bg-gray-100 dark:bg-[#333] border-r border-b border-gray-300 dark:border-gray-600 flex items-center justify-center font-semibold text-gray-600 dark:text-gray-400 flex-shrink-0 sticky left-0 z-10">
                            {row}
                        </div>
                        {COLS.map(col => {
                            const cellId = `${col}${row}`;
                            const isSelected = selectedCell === cellId;
                            return (
                                <div 
                                    key={cellId} 
                                    className={`w-24 border-r border-b border-gray-200 dark:border-gray-700 flex-shrink-0 relative ${isSelected ? 'ring-2 ring-blue-500 z-10' : ''}`}
                                    onClick={() => handleCellClick(cellId)}
                                >
                                    <input 
                                        className="w-full h-full px-1 bg-transparent border-none outline-none text-gray-800 dark:text-gray-200"
                                        value={data[cellId] || ''}
                                        onChange={(e) => handleGridChange(cellId, e.target.value)}
                                    />
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
        
        {/* Footer */}
        <div className="h-8 bg-gray-100 dark:bg-[#252526] border-t border-gray-300 dark:border-gray-700 flex items-center px-2 gap-2">
            <button className="px-3 py-0.5 bg-white dark:bg-[#1e1e1e] text-blue-600 font-medium rounded-t shadow-sm border-t border-l border-r border-gray-300 dark:border-gray-600 translate-y-[1px]">Sheet1</button>
            <button className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded"><ICONS.Plus size={12} /></button>
        </div>
    </div>
  );
};

export default SheetsApp;
