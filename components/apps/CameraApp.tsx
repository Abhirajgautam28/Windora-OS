
import React, { useEffect, useRef, useState } from 'react';
import { ICONS } from '../../constants';
import { AppProps, FileSystemNode } from '../../types';

interface CameraAppProps extends AppProps {
  fileSystem?: FileSystemNode[];
  setFileSystem?: React.Dispatch<React.SetStateAction<FileSystemNode[]>>;
}

const CameraApp: React.FC<CameraAppProps> = ({ setFileSystem }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsActive(true);
        }
      } catch (err) {
        setError("Camera access denied or not available.");
        setIsActive(false);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const takePhoto = () => {
      // Simulation of taking a photo
      const flash = document.getElementById('camera-flash');
      if(flash) {
          flash.style.opacity = '1';
          setTimeout(() => flash.style.opacity = '0', 100);
      }
      
      // In a real implementation, we'd capture the canvas to blob and save to fileSystem
      // For simulation, we just flash.
  };

  return (
    <div className="flex flex-col h-full bg-black text-white relative overflow-hidden">
       <div id="camera-flash" className="absolute inset-0 bg-white opacity-0 pointer-events-none transition-opacity duration-75 z-50"></div>

       {isActive ? (
           <video 
             ref={videoRef} 
             autoPlay 
             playsInline 
             className="flex-1 object-cover transform scale-x-[-1]" // Mirror effect
           />
       ) : (
           <div className="flex-1 flex items-center justify-center flex-col gap-4 text-gray-500">
               <ICONS.Camera size={48} />
               <p>{error || "Initializing Camera..."}</p>
           </div>
       )}

       {/* Controls */}
       <div className="h-24 bg-black/50 absolute bottom-0 left-0 right-0 backdrop-blur-md flex items-center justify-center gap-8">
           <button className="p-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
               <ICONS.ImageIcon size={24} />
           </button>
           <button 
             onClick={takePhoto}
             className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all"
           >
               <div className="w-12 h-12 bg-white rounded-full"></div>
           </button>
           <button className="p-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
               <ICONS.RotateCcw size={24} />
           </button>
       </div>
    </div>
  );
};

export default CameraApp;
