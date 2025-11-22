
import React, { useEffect, useState } from 'react';

const BSOD = () => {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
      const interval = setInterval(() => {
          setPercent(p => {
              if (p >= 100) {
                  clearInterval(interval);
                  // Simulate reboot
                  setTimeout(() => window.location.reload(), 1000);
                  return 100;
              }
              return p + Math.floor(Math.random() * 10);
          });
      }, 800);
      return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[11000] bg-[#0078d7] text-white font-sans p-24 cursor-none flex flex-col justify-center">
        <div className="text-[10rem] leading-none mb-8">:(</div>
        <div className="text-3xl mb-8 max-w-4xl">
            Your device ran into a problem and needs to restart. We're just collecting some error info, and then we'll restart for you.
        </div>
        <div className="text-3xl mb-8">
            {Math.min(percent, 100)}% complete
        </div>
        
        <div className="flex items-start gap-4 mt-8">
            <div className="w-24 h-24 bg-white p-1">
                <div className="w-full h-full bg-black flex items-center justify-center">
                     {/* Fake QR */}
                     <div className="grid grid-cols-6 gap-1 w-16 h-16">
                         {Array.from({length: 36}).map((_, i) => (
                             <div key={i} className={`bg-white ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-0'}`}></div>
                         ))}
                     </div>
                </div>
            </div>
            <div className="text-sm space-y-1 pt-2">
                <p>For more information about this issue and possible fixes, visit https://www.windora.com/stopcode</p>
                <p>If you call a support person, give them this info:</p>
                <p>Stop code: CRITICAL_PROCESS_DIED</p>
            </div>
        </div>
    </div>
  );
};

export default BSOD;
