
import React, { useState, useRef } from 'react';
import { ICONS } from '../../constants';
import { AppProps } from '../../types';

const VideoPlayerApp: React.FC<AppProps> = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black text-white group">
      <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden">
        <video
          ref={videoRef}
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          className="max-w-full max-h-full object-contain"
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(false)}
          loop
        />
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20" onClick={togglePlay}>
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
               <ICONS.Play size={32} fill="white" className="ml-1" />
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="h-16 bg-gray-900/90 backdrop-blur border-t border-white/10 flex flex-col px-4 justify-center">
         <div className="relative h-1 bg-gray-700 rounded-full mb-3 cursor-pointer group/slider">
            <div 
                className="absolute top-0 left-0 h-full bg-blue-500 rounded-full" 
                style={{ width: `${progress}%` }}
            ></div>
            <div 
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover/slider:opacity-100 transition-opacity"
                style={{ left: `${progress}%` }}
            ></div>
         </div>
         
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button onClick={togglePlay} className="hover:text-blue-400 transition-colors">
                    {isPlaying ? <ICONS.Minus size={20} className="rotate-90" /> : <ICONS.Play size={20} fill="currentColor" />}
                </button>
                <button className="hover:text-blue-400 transition-colors"><ICONS.RotateCcw size={18} /></button>
                <span className="text-xs text-gray-400 font-mono">00:{(videoRef.current?.currentTime || 0).toFixed(0).padStart(2,'0')} / 00:06</span>
            </div>
            
            <div className="flex items-center gap-3">
                <ICONS.Volume2 size={18} className="text-gray-400" />
                <input 
                    type="range" 
                    min="0" max="100" 
                    value={volume} 
                    onChange={(e) => { setVolume(Number(e.target.value)); if(videoRef.current) videoRef.current.volume = Number(e.target.value)/100; }}
                    className="w-24 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <button className="ml-2 hover:text-blue-400 transition-colors"><ICONS.Maximize size={18} /></button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default VideoPlayerApp;
