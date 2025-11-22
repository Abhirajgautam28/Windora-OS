import React, { useState, useEffect, useRef } from 'react';
import { TerminalMode } from '../types';
import { simulatePythonExecution } from '../services/geminiService';

interface TerminalAppProps {
  windowId: string;
}

const TerminalApp: React.FC<TerminalAppProps> = () => {
  const [history, setHistory] = useState<string[]>([
    "Windora OS Kernel v3.0.0 [Hybrid Architecture]",
    "(c) 2024 Windora Corp. All rights reserved.",
    "",
    "System initialization complete.",
    "Type 'help' for available commands.",
    ""
  ]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<TerminalMode>(TerminalMode.BASH);
  const [cwd, setCwd] = useState("C:\\Users\\Admin");
  const [installedPackages, setInstalledPackages] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const addToHistory = (line: string) => {
    setHistory(prev => [...prev, line]);
  };

  const handleCommand = async (cmd: string) => {
    const trimmed = cmd.trim();
    
    // Prompt Display
    const prompt = mode === TerminalMode.BASH 
      ? `${cwd}>` 
      : '>>>';
      
    if (!trimmed) {
      addToHistory(`${prompt} `);
      return;
    }

    addToHistory(`${prompt} ${trimmed}`);

    if (mode === TerminalMode.PYTHON) {
      if (trimmed === 'exit()' || trimmed === 'quit()') {
        setMode(TerminalMode.BASH);
        addToHistory("Exiting Python environment...");
      } else {
        setIsProcessing(true);
        const result = await simulatePythonExecution(trimmed, history);
        setIsProcessing(false);
        if (result) addToHistory(result);
      }
      return;
    }

    // BASH MODE COMMANDS
    const parts = trimmed.split(' ');
    const command = parts[0].toLowerCase();

    switch (command) {
      case 'help':
        addToHistory("Available commands:");
        addToHistory("  help               - Show this help message");
        addToHistory("  cls / clear        - Clear screen");
        addToHistory("  dir / ls           - List directory contents");
        addToHistory("  pkg install <name> - Install packages (e.g., python, node)");
        addToHistory("  python             - Start Python interpreter");
        addToHistory("  whoami             - Display current user");
        break;
      case 'cls':
      case 'clear':
        setHistory([]);
        break;
      case 'whoami':
        addToHistory("windora\\admin");
        break;
      case 'dir':
      case 'ls':
        addToHistory(" Directory of " + cwd);
        addToHistory("");
        addToHistory("10/24/2024  02:22 PM    <DIR>          Documents");
        addToHistory("10/24/2024  02:22 PM    <DIR>          Downloads");
        addToHistory("10/24/2024  02:22 PM    <DIR>          Desktop");
        addToHistory("10/24/2024  02:24 PM                45 welcome.py");
        addToHistory("               1 File(s)             45 bytes");
        addToHistory("               3 Dir(s)   512,000,000 bytes free");
        break;
      case 'pkg':
        if (parts[1] === 'install') {
          const pkg = parts[2];
          if (!pkg) {
            addToHistory("Error: Package name required. Usage: pkg install <package_name>");
          } else if (installedPackages.includes(pkg)) {
             addToHistory(`Package '${pkg}' is already installed.`);
          } else {
            setIsProcessing(true);
            addToHistory(`Resolving dependencies for ${pkg}...`);
            
            // Simulate network delay and installation
            setTimeout(() => {
                addToHistory(`Downloading ${pkg}-core-v3.1...`);
                setTimeout(() => {
                    addToHistory(`Unpacking objects...`);
                    setTimeout(() => {
                        addToHistory(`Setting up ${pkg} (3.10.4)...`);
                        addToHistory(`Successfully installed ${pkg}.`);
                        setInstalledPackages(prev => [...prev, pkg]);
                        setIsProcessing(false);
                        if (pkg === 'python') {
                             addToHistory(`You can now run 'python' to start the interpreter.`);
                        }
                        // refocus input after async op
                        setTimeout(() => inputRef.current?.focus(), 50);
                    }, 800);
                }, 800);
            }, 800);
          }
        } else {
          addToHistory("Usage: pkg install <package_name>");
        }
        break;
      case 'python':
      case 'python3':
        if (installedPackages.includes('python') || installedPackages.includes('python3')) {
          setMode(TerminalMode.PYTHON);
          addToHistory("Python 3.10.4 (main, Oct 14 2024, 14:22:11) [GCC 9.4.0] on windora-os");
          addToHistory('Type "help", "copyright", "credits" or "license" for more information.');
        } else {
          addToHistory("'python' is not recognized as an internal or external command.");
          addToHistory("Try installing it via: pkg install python");
        }
        break;
      default:
        addToHistory(`'${command}' is not recognized as an internal or external command,`);
        addToHistory("operable program or batch file.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput("");
    }
    if (e.key === 'c' && e.ctrlKey) {
        addToHistory("^C");
        setInput("");
    }
  };

  return (
    <div 
      className="h-full w-full bg-[#0c0c0c] text-[#cccccc] p-4 font-mono text-sm flex flex-col overflow-hidden rounded-b-lg select-text" 
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex-1 overflow-y-auto scrollbar-hide font-mono">
        {history.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap break-words leading-snug">{line}</div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="mt-2 flex items-center pb-1">
        <span className="mr-2 text-white font-semibold select-none">
          {mode === TerminalMode.BASH ? `${cwd}>` : '>>>'}
        </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none outline-none text-[#cccccc] font-mono caret-white"
          autoFocus
          autoComplete="off"
          disabled={isProcessing}
        />
      </div>
    </div>
  );
};

export default TerminalApp;