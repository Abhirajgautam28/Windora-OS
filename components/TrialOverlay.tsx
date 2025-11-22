import React, { useEffect, useState } from 'react';
import { TRIAL_DURATION_MS } from '../constants';

const TrialOverlay: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(TRIAL_DURATION_MS);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1000) {
          clearInterval(interval);
          setExpired(true);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (expired) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black/90 flex flex-col items-center justify-center text-white backdrop-blur-xl animate-in fade-in duration-1000">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">AetherOS Trial Expired</h1>
        <p className="text-xl text-gray-400 mb-8">Thank you for trying the future of computing.</p>
        <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-full font-semibold transition-all shadow-lg shadow-blue-500/30" onClick={() => window.location.reload()}>
          Restart Trial
        </button>
      </div>
    );
  }

  return (
    <div className="fixed top-2 right-2 z-[9000] bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-4 py-1 text-xs font-mono text-white/80 shadow-lg flex items-center gap-2 hover:bg-black/60 transition-all">
      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
      Trial Version: {formatTime(timeLeft)} remaining
    </div>
  );
};

export default TrialOverlay;