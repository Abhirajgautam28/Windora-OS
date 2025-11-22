
import React, { useState } from 'react';
import { ICONS } from '../constants';

interface CalendarWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const CalendarWidget: React.FC<CalendarWidgetProps> = ({ isOpen, onClose, className }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  if (!isOpen) return null;

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const startDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const today = new Date();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const isToday = (day: number) => {
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };

  const days = [];
  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(
      <div 
        key={i} 
        className={`w-8 h-8 flex items-center justify-center text-xs rounded-full cursor-pointer transition-colors
          ${isToday(i) ? 'bg-blue-600 text-white font-bold shadow-md' : 'hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200'}`}
      >
        {i}
      </div>
    );
  }

  const defaultClasses = "absolute top-10 right-2 w-80 bg-[#f9f9f9]/95 dark:bg-[#1c1c1e]/95 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl z-[6000] overflow-hidden flex flex-col animate-in slide-in-from-right-10 duration-200 p-4 select-none";

  return (
    <div 
        className={className || defaultClasses}
        onClick={(e) => e.stopPropagation()}
    >
        <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold text-gray-800 dark:text-white">
                {currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
            </span>
            <div className="flex gap-2">
                <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full">
                    <ICONS.ChevronLeft size={16} className="text-gray-600 dark:text-gray-300" />
                </button>
                <button onClick={handleNextMonth} className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full">
                    <ICONS.ChevronRight size={16} className="text-gray-600 dark:text-gray-300" />
                </button>
            </div>
        </div>

        <div className="grid grid-cols-7 gap-y-2 mb-2 text-center">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                <div key={i} className="text-[10px] font-bold text-gray-400">{day}</div>
            ))}
            {days}
        </div>
        
        <div className="pt-4 border-t border-gray-200/50 dark:border-white/10 mt-2">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Today's Events</div>
            <div className="text-sm text-gray-400 italic text-center py-4">
                No events scheduled
            </div>
        </div>
    </div>
  );
};

export default CalendarWidget;
