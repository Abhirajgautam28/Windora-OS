
import React, { useState } from 'react';
import { ICONS } from '../../constants';
import { AppProps } from '../../types';

interface ImageViewerProps extends AppProps {
    initialContent?: string; // URL of image
}

const ImageViewerApp: React.FC<ImageViewerProps> = ({ initialContent }) => {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 300));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 25));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  return (
    <div className="flex flex-col h-full bg-[#222]">
        <div className="h-12 bg-[#333] flex items-center justify-center gap-4 border-b border-[#444]">
            <button onClick={handleZoomOut} className="p-2 hover:bg-white/10 rounded text-white"><ICONS.ZoomOut size={20} /></button>
            <span className="text-white text-sm w-12 text-center">{zoom}%</span>
            <button onClick={handleZoomIn} className="p-2 hover:bg-white/10 rounded text-white"><ICONS.ZoomIn size={20} /></button>
            <div className="w-[1px] h-6 bg-[#555]"></div>
            <button onClick={handleRotate} className="p-2 hover:bg-white/10 rounded text-white"><ICONS.RotateCw size={20} /></button>
            <button className="p-2 hover:bg-white/10 rounded text-white"><ICONS.Trash2 size={20} /></button>
        </div>
        <div className="flex-1 overflow-auto flex items-center justify-center p-8 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAADBJREFUOE9jVFZW/k8iAAqgA0dHRwZkQYgZgIkx41E9YDAQDAbCgJGRkUFAWlq6gQwA+jM2C/t7vF0AAAAASUVORK5CYII=')]">
            <div 
                className="transition-all duration-300 ease-out shadow-2xl"
                style={{ 
                    transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                    maxWidth: '100%',
                    maxHeight: '100%'
                }}
            >
                 {initialContent ? (
                     <img src={initialContent} alt="Preview" className="object-contain max-h-full" draggable={false} />
                 ) : (
                     <div className="text-white/50 flex flex-col items-center">
                         <ICONS.ImageIcon size={64} />
                         <span className="mt-2">No image selected</span>
                     </div>
                 )}
            </div>
        </div>
    </div>
  );
};

export default ImageViewerApp;
