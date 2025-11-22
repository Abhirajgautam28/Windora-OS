import React, { useState, useEffect } from 'react';
import { HardDrive, ArrowRight, CheckCircle2, Cpu } from 'lucide-react';

interface InstallerProps {
  onComplete: () => void;
}

const Installer: React.FC<InstallerProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [bootText, setBootText] = useState<string[]>([]);

  // Boot sequence simulation
  useEffect(() => {
    if (step === 0) {
      const lines = [
        "Windora OS Bootloader v2.1.0 (Build 24H2)",
        "Initializing WebAssembly Virtualization Core...",
        "Allocating Virtual Memory Pages...",
        "Loading Hybrid Kernel (Darwin/NT)... OK",
        "Mounting Virtual File System... OK",
        "Starting Installer Service..."
      ];
      let currentLine = 0;
      const interval = setInterval(() => {
        if (currentLine >= lines.length) {
          clearInterval(interval);
          setTimeout(() => setStep(1), 1000);
        } else {
          setBootText(prev => [...prev, lines[currentLine]]);
          currentLine++;
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [step]);

  // Installation progress simulation
  useEffect(() => {
    if (step === 3) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep(4), 1500);
            return 100;
          }
          // Random speed variation for realism
          return prev + (Math.random() * 1.5);
        });
      }, 150);
      return () => clearInterval(interval);
    }
  }, [step]);

  const renderBootScreen = () => (
    <div className="bg-black text-gray-400 font-mono h-full w-full p-8 text-sm cursor-none">
      {bootText.map((line, i) => (
        <div key={i} className="mb-1">{line}</div>
      ))}
      <div className="animate-pulse mt-2 text-white">_</div>
    </div>
  );

  const renderWelcome = () => (
    <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 h-full w-full flex items-center justify-center font-sans text-white select-none">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-3xl shadow-2xl max-w-2xl w-full text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
        
        <div className="mb-8 flex justify-center relative">
           <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 rounded-full"></div>
           <div className="relative w-24 h-24 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-2xl shadow-lg flex items-center justify-center mb-4">
             <Cpu size={48} className="text-white" />
           </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-2 tracking-tight">Install Windora OS</h1>
        <p className="text-blue-200 mb-8 text-lg font-light">The next generation hybrid operating system.</p>
        
        <div className="space-y-4 text-left bg-black/30 p-6 rounded-xl border border-white/5 mb-8">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-green-400 flex-shrink-0" size={20} /> 
            <span className="text-sm text-gray-200">Virtualize hardware abstraction layer</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-green-400 flex-shrink-0" size={20} /> 
            <span className="text-sm text-gray-200">Initialize local secure storage environment</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-green-400 flex-shrink-0" size={20} /> 
            <span className="text-sm text-gray-200">Download core developer packages (Python, Node)</span>
          </div>
        </div>

        <button 
          onClick={() => setStep(2)}
          className="group relative px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-full font-semibold transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2 mx-auto overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2">Start Installation <ArrowRight size={18} /></span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>
    </div>
  );

  const renderPartition = () => (
    <div className="bg-[#F3F4F6] text-black h-full w-full flex items-center justify-center font-sans select-none">
      <div className="bg-white border border-gray-300 shadow-2xl w-[700px] h-[500px] flex flex-col rounded-lg overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="h-12 bg-white border-b flex items-center px-6 justify-between">
          <span className="text-lg font-semibold text-gray-800">Windora OS Setup</span>
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
        </div>
        <div className="flex-1 p-10 flex flex-col">
          <h2 className="text-2xl font-light mb-6 text-gray-800">Where do you want to install Windora OS?</h2>
          
          <div className="border border-gray-300 rounded bg-white flex-1 mb-6 overflow-hidden flex flex-col">
            <div className="grid grid-cols-12 bg-gray-100 p-2 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase">
              <div className="col-span-6">Name</div>
              <div className="col-span-3">Total Size</div>
              <div className="col-span-3">Type</div>
            </div>
            <div className="p-2 bg-blue-50 border-b border-blue-100 flex items-center cursor-pointer">
              <div className="grid grid-cols-12 w-full items-center">
                <div className="col-span-6 flex items-center gap-2">
                  <HardDrive size={16} className="text-gray-600" />
                  <span className="text-sm font-medium">Drive 0 Unallocated Space</span>
                </div>
                <div className="col-span-3 text-sm text-gray-600">1024.0 GB</div>
                <div className="col-span-3 text-sm text-gray-600">System</div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-auto pt-4 border-t">
             <div className="text-xs text-gray-400">Build 22621.ni_release</div>
             <div className="flex gap-3">
               <button className="px-6 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded transition-colors">Refresh</button>
               <button 
                 onClick={() => setStep(3)}
                 className="px-8 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium shadow-md transition-all transform active:scale-95"
               >
                 Next
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInstalling = () => (
    <div className="bg-black text-white h-full w-full flex items-center justify-center font-sans relative overflow-hidden">
       <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] opacity-30 bg-cover bg-center blur-sm"></div>
       <div className="z-10 w-[600px] text-center backdrop-blur-md bg-black/40 p-12 rounded-2xl border border-white/10">
          <h2 className="text-3xl font-light mb-2">Installing Windora OS</h2>
          <p className="text-gray-400 mb-10">Please keep your computer on and plugged in.</p>
          
          <div className="relative h-1 bg-gray-700 rounded-full overflow-hidden mb-4">
            <div className="absolute top-0 left-0 h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-200 ease-out" style={{ width: `${progress}%` }}></div>
          </div>
          
          <div className="flex justify-between text-sm text-blue-200 font-mono mb-8">
            <span>{progress < 30 ? "Copying files..." : progress < 70 ? "Expanding features..." : "Finalizing setup..."}</span>
            <span>{Math.round(progress)}%</span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-left text-sm text-gray-400">
             <div className="flex items-center gap-2 opacity-80">
                <div className={`w-2 h-2 rounded-full ${progress > 0 ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                Copying Windora OS files
             </div>
             <div className="flex items-center gap-2 opacity-80">
                <div className={`w-2 h-2 rounded-full ${progress > 20 ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                Getting files ready
             </div>
             <div className="flex items-center gap-2 opacity-80">
                <div className={`w-2 h-2 rounded-full ${progress > 50 ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                Installing features
             </div>
             <div className="flex items-center gap-2 opacity-80">
                <div className={`w-2 h-2 rounded-full ${progress > 80 ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                Installing updates
             </div>
          </div>
       </div>
    </div>
  );

  const renderComplete = () => (
    <div className="bg-black h-full w-full flex flex-col items-center justify-center text-white animate-in fade-in duration-1000">
      <div className="relative w-20 h-20 mb-8">
        <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <h2 className="text-2xl font-light tracking-wide mb-2">Just a moment...</h2>
      <p className="text-gray-500">Setting up your personalized desktop environment</p>
      {/* Auto advance after delay */}
      {setTimeout(() => onComplete(), 4000) && null}
    </div>
  );

  switch (step) {
    case 0: return renderBootScreen();
    case 1: return renderWelcome();
    case 2: return renderPartition();
    case 3: return renderInstalling();
    case 4: return renderComplete();
    default: return null;
  }
};

export default Installer;