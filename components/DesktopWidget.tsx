
import React, { useRef, useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { WidgetData } from '../types';

interface DesktopWidgetProps {
    widget: WidgetData;
    onRemove: (id: string) => void;
    onUpdatePosition: (id: string, x: number, y: number) => void;
    children: React.ReactNode;
}

const DesktopWidget: React.FC<DesktopWidgetProps> = ({ widget, onRemove, onUpdatePosition, children }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const widgetRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        // Don't drag if clicking controls/buttons inside
        if ((e.target as HTMLElement).closest('button')) return;
        
        setIsDragging(true);
        if (widgetRef.current) {
            const rect = widgetRef.current.getBoundingClientRect();
            setDragOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
        }
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                const newX = e.clientX - dragOffset.x;
                const newY = e.clientY - dragOffset.y;
                onUpdatePosition(widget.id, newX, newY);
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragOffset, widget.id, onUpdatePosition]);

    return (
        <div 
            ref={widgetRef}
            className="absolute z-[5] group gpu-layer"
            style={{ transform: `translate3d(${widget.position.x}px, ${widget.position.y}px, 0)`, left: 0, top: 0 }}
            onMouseDown={handleMouseDown}
        >
            <div className="relative bg-white/30 dark:bg-black/30 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl shadow-lg transition-transform hover:scale-[1.01] active:scale-[0.99] cursor-move overflow-hidden">
                <button 
                    onClick={() => onRemove(widget.id)}
                    className="absolute top-2 right-2 z-20 p-1 bg-black/10 dark:bg-white/10 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all"
                >
                    <X size={12} />
                </button>
                {children}
            </div>
        </div>
    );
};

export default DesktopWidget;
