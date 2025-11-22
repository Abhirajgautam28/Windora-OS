
import React, { useState, useRef, useEffect } from 'react';
import { ICONS } from '../../constants';
import { AppProps, FileSystemNode } from '../../types';

interface ScreenRecorderProps extends AppProps {
  fileSystem?: FileSystemNode[];
  setFileSystem?: React.Dispatch<React.SetStateAction<FileSystemNode[]>>;
}

const ScreenRecorderApp: React.FC<ScreenRecorderProps> = ({ fileSystem, setFileSystem }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  const startRecording = async () => {
    try {
      setError(null);
      // Cast constraints to any to avoid TS error with cursor property which is valid but not in standard types
      const videoConstraints: any = { cursor: "always" };
      
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: videoConstraints,
        audio: false
      });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = handleStop;

      mediaRecorder.start();
      setIsRecording(true);
      
      // Start timer
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      // Stop recording if user stops sharing via browser UI
      stream.getVideoTracks()[0].onended = () => {
        if (mediaRecorder.state !== 'inactive') {
          mediaRecorder.stop();
        }
      };

    } catch (err) {
      console.error("Error starting screen recording:", err);
      setError("Failed to start recording. Permission denied or cancelled.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      // Stop all tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleStop = () => {
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);

    const blob = new Blob(chunksRef.current, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const fileSizeMB = (blob.size / (1024 * 1024)).toFixed(1);

    // Save to virtual file system
    if (setFileSystem) {
        const fileName = `Screen Recording ${new Date().toLocaleString().replace(/[\/\,\:]/g, '-')}.webm`;
        
        const newFile: FileSystemNode = {
            id: `rec-${Date.now()}`,
            name: fileName,
            type: 'file',
            content: url, // Storing Blob URL (note: temporary for session)
            size: `${fileSizeMB} MB`,
            dateModified: new Date(),
            dateCreated: new Date()
        };

        setFileSystem(prev => {
            // Find Videos folder or create it, simplified logic assumes root structure
            const updateRecursive = (nodes: FileSystemNode[]): FileSystemNode[] => {
                return nodes.map(node => {
                    if (node.name === 'Videos' && node.type === 'folder') {
                        return { ...node, children: [...(node.children || []), newFile] };
                    }
                    if (node.children) {
                        return { ...node, children: updateRecursive(node.children) };
                    }
                    return node;
                });
            };
            return updateRecursive(prev);
        });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white items-center justify-center p-8 text-center">
      <div className="mb-8">
          <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center mb-4 mx-auto transition-all duration-300 ${isRecording ? 'border-red-500 animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.6)]' : 'border-gray-600'}`}>
              {isRecording ? (
                  <div className="w-8 h-8 bg-red-500 rounded-sm"></div>
              ) : (
                  <div className="w-10 h-10 bg-red-500 rounded-full"></div>
              )}
          </div>
          <h2 className="text-2xl font-bold mb-2">
              {isRecording ? 'Recording in Progress' : 'Screen Recorder'}
          </h2>
          <div className="text-4xl font-mono font-light tracking-widest text-gray-300">
              {formatTime(recordingTime)}
          </div>
      </div>

      {error && (
          <div className="mb-6 text-red-400 text-sm bg-red-900/20 px-4 py-2 rounded border border-red-900/50">
              {error}
          </div>
      )}

      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`px-8 py-3 rounded-full font-semibold text-sm transition-all transform active:scale-95 shadow-lg flex items-center gap-2 ${
            isRecording 
            ? 'bg-gray-700 hover:bg-gray-600 text-white' 
            : 'bg-red-600 hover:bg-red-700 text-white'
        }`}
      >
        {isRecording ? (
            <>
                <ICONS.CircleDot className="animate-pulse" size={18} /> Stop Recording
            </>
        ) : (
            <>
                <ICONS.Video size={18} /> Start Recording
            </>
        )}
      </button>

      <p className="mt-8 text-xs text-gray-500 max-w-xs">
          Recordings are automatically saved to the <b>Videos</b> folder in File Explorer.
      </p>
    </div>
  );
};

export default ScreenRecorderApp;
