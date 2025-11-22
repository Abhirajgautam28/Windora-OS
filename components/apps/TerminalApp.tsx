
import React, { useState, useEffect, useRef } from 'react';
import { TerminalMode, AppProps, FileSystemNode } from '../../types';
import { simulatePythonExecution } from '../../services/geminiService';
import { ICONS } from '../../constants';
import { SystemSounds } from '../../services/soundService';

// Extend AppProps to ensure fileSystem is available
interface TerminalAppProps extends AppProps {
  // Explicitly using AppProps content
}

type Profile = 'powershell' | 'cmd' | 'wsl';

interface TerminalTab {
  id: string;
  profile: Profile;
  title: string;
  history: string[];
  currentInput: string;
  cwdPath: string[]; // Stores path as IDs array ['root', 'folder1', 'folder2']
  mode: TerminalMode;
}

const TerminalApp: React.FC<TerminalAppProps> = ({ fileSystem, setFileSystem, onOpenApp }) => {
  const [tabs, setTabs] = useState<TerminalTab[]>([
    {
      id: '1',
      profile: 'powershell',
      title: 'PowerShell',
      history: [
        "Windora PowerShell 7.3.6",
        "(c) Windora Corporation. All rights reserved.",
        "",
        "Try the new cross-platform PowerShell https://aka.ms/pscore6",
        ""
      ],
      currentInput: '',
      cwdPath: ['root'], // Start at root
      mode: TerminalMode.BASH
    }
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('1');
  const [showProfiles, setShowProfiles] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeTab.history, activeTabId]);

  // --- Helper Functions for File System ---

  const getNodeByPath = (path: string[]): FileSystemNode | null => {
      if (!fileSystem || fileSystem.length === 0) return null;
      let current: FileSystemNode | undefined = fileSystem.find(n => n.id === path[0]);
      
      for (let i = 1; i < path.length; i++) {
          if (current && current.children) {
              current = current.children.find(c => c.id === path[i]);
          } else {
              return null;
          }
      }
      return current || null;
  };

  const getDisplayPath = (pathIds: string[], profile: Profile): string => {
      if (!fileSystem) return '';
      // Map root to drive letter or ~
      let pathStr = '';
      
      if (profile === 'wsl') {
           if (pathIds.length === 1 && pathIds[0] === 'root') return '/';
           // build path names
           const names: string[] = [];
           let current = fileSystem.find(n => n.id === 'root');
           for(let i=1; i<pathIds.length; i++) {
               if(current && current.children) {
                   const next = current.children.find(c => c.id === pathIds[i]);
                   if(next) {
                       names.push(next.name);
                       current = next;
                   }
               }
           }
           return '/' + names.join('/');
      } else {
           // Windows style
           if (pathIds.length === 1 && pathIds[0] === 'root') return 'C:\\Users\\Admin';
           const names: string[] = [];
           let current = fileSystem.find(n => n.id === 'root');
           for(let i=1; i<pathIds.length; i++) {
               if(current && current.children) {
                   const next = current.children.find(c => c.id === pathIds[i]);
                   if(next) {
                       names.push(next.name);
                       current = next;
                   }
               }
           }
           return 'C:\\Users\\Admin\\' + names.join('\\');
      }
  };

  const resolvePath = (currentPath: string[], targetPathStr: string): string[] | null => {
      if (!targetPathStr || targetPathStr === '.') return currentPath;
      
      let newPath = [...currentPath];
      
      // Handle absolute root / or \ or C:
      if (targetPathStr.startsWith('/') || targetPathStr.startsWith('\\') || targetPathStr.match(/^[a-zA-Z]:/)) {
          newPath = ['root'];
          // For simplicity in this simulation, we treat absolute paths as relative to root children names if possible, 
          // but real path parsing is complex. We'll assume basic traversal.
          // Let's simplify: if starts with / or C:, go to root, then parse segments.
          // Removing drive prefix
          let cleanTarget = targetPathStr.replace(/^[a-zA-Z]:\\?/, '').replace(/^[\\/]/, '');
          if (!cleanTarget) return ['root'];
          const parts = cleanTarget.split(/[\\/]/).filter(p => p);
          
          // Traverse from root
          let currentContextNode = fileSystem?.find(n => n.id === 'root');
          if (!currentContextNode) return null;

          for (const part of parts) {
             const child = currentContextNode?.children?.find(c => c.name.toLowerCase() === part.toLowerCase());
             if (child && child.type === 'folder') {
                 newPath.push(child.id);
                 currentContextNode = child;
             } else {
                 return null; // Invalid path
             }
          }
          return newPath;
      }

      // Relative path
      const parts = targetPathStr.split(/[\\/]/).filter(p => p);
      
      for (const part of parts) {
          if (part === '..') {
              if (newPath.length > 1) newPath.pop();
          } else if (part === '.') {
              continue;
          } else {
              const currentNode = getNodeByPath(newPath);
              const child = currentNode?.children?.find(c => c.name.toLowerCase() === part.toLowerCase());
              if (child && child.type === 'folder') {
                  newPath.push(child.id);
              } else {
                  return null; // Invalid path
              }
          }
      }
      
      return newPath;
  };

  const updateFileSystem = (op: (nodes: FileSystemNode[]) => FileSystemNode[]) => {
      if (setFileSystem) {
          setFileSystem(prev => op(prev));
      }
  };

  // ---

  const handleAddTab = (profile: Profile) => {
    const newTab: TerminalTab = {
      id: Date.now().toString(),
      profile,
      title: profile === 'powershell' ? 'PowerShell' : profile === 'cmd' ? 'Command Prompt' : 'Ubuntu 22.04',
      history: [],
      currentInput: '',
      cwdPath: ['root'],
      mode: TerminalMode.BASH
    };

    if (profile === 'cmd') {
        newTab.history = ["Windora Command Processor [Version 10.0.22621.1]", "(c) Windora Corp. All rights reserved.", ""];
    } else if (profile === 'wsl') {
        newTab.history = ["Welcome to Ubuntu 22.04.2 LTS (GNU/Linux 5.15.90.1-microsoft-standard-WSL2 x86_64)", "", " * Documentation:  https://help.ubuntu.com", " * Management:     https://landscape.canonical.com", " * Support:        https://ubuntu.com/advantage", ""];
    } else {
        newTab.history = ["Windora PowerShell 7.3.6", "(c) Windora Corporation. All rights reserved.", ""];
    }

    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
    setShowProfiles(false);
  };

  const handleCloseTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length === 1) return; // Don't close last tab
    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);
    if (activeTabId === id) {
        setActiveTabId(newTabs[newTabs.length - 1].id);
    }
  };

  const updateTabState = (updates: Partial<TerminalTab>) => {
      setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, ...updates } : t));
  };

  const addToHistory = (line: string) => {
    setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, history: [...t.history, line] } : t));
  };

  const handleCommand = async (cmd: string) => {
    const trimmed = cmd.trim();
    const cwdDisplay = getDisplayPath(activeTab.cwdPath, activeTab.profile);
    
    // Prompt Display logic
    let prompt = '';
    if (activeTab.mode === TerminalMode.PYTHON) prompt = '>>>';
    else if (activeTab.profile === 'powershell') prompt = `PS ${cwdDisplay}>`;
    else if (activeTab.profile === 'cmd') prompt = `${cwdDisplay}>`;
    else if (activeTab.profile === 'wsl') prompt = `admin@windora:${cwdDisplay}$`;

    if (!trimmed) {
      addToHistory(`${prompt} `);
      return;
    }

    addToHistory(`${prompt} ${trimmed}`);

    // Python Mode Handler
    if (activeTab.mode === TerminalMode.PYTHON) {
      if (trimmed === 'exit()' || trimmed === 'quit()') {
        updateTabState({ mode: TerminalMode.BASH });
        addToHistory("Exiting Python environment...");
      } else {
        setIsProcessing(true);
        const result = await simulatePythonExecution(trimmed, activeTab.history);
        setIsProcessing(false);
        if (result) addToHistory(result);
      }
      return;
    }

    // Shell Command Handler
    const parts = trimmed.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
    const command = parts[0]?.toLowerCase();
    const args = parts.slice(1).map(a => a.replace(/"/g, ''));

    switch (command) {
      case 'help':
        addToHistory("Available commands:");
        addToHistory("  cd <dir>           - Change directory");
        addToHistory("  ls / dir           - List contents");
        addToHistory("  mkdir <name>       - Create directory");
        addToHistory("  touch <name>       - Create empty file");
        addToHistory("  rm <name>          - Remove file or directory");
        addToHistory("  cat <file>         - Read file content");
        addToHistory("  pwd                - Print working directory");
        addToHistory("  echo <text>        - Print text");
        addToHistory("  cls / clear        - Clear screen");
        addToHistory("  python             - Start Python interpreter");
        addToHistory("  code / chrome      - Launch apps");
        addToHistory("  exit               - Close tab");
        addToHistory("  crash              - Trigger BSOD (for testing)");
        break;
      case 'cls':
      case 'clear':
        updateTabState({ history: [] });
        break;
      case 'pwd':
        addToHistory(cwdDisplay);
        break;
      case 'echo':
        addToHistory(args.join(' '));
        break;
      case 'crash':
        addToHistory("Initiating critical system crash...");
        if (onOpenApp) onOpenApp('system:crash');
        break;
      case 'ls':
      case 'dir':
        const node = getNodeByPath(activeTab.cwdPath);
        if (node && node.children) {
            if (node.children.length === 0) {
                // nothing
            } else {
                // Simple column formatting
                node.children.forEach(child => {
                    const isDir = child.type === 'folder';
                    const date = child.dateModified ? new Date(child.dateModified).toLocaleDateString() : '';
                    const time = child.dateModified ? new Date(child.dateModified).toLocaleTimeString() : '';
                    // Windows CMD style output simulation
                    if (activeTab.profile === 'wsl') {
                        // Linux style usually just names, maybe colored
                        addToHistory(`${isDir ? 'd' : '-'}rwxr-xr-x  admin  admin  ${child.size || '0'}  ${child.name}`);
                    } else {
                        addToHistory(`${date}  ${time}    ${isDir ? '<DIR>' : '     '}          ${child.name}`);
                    }
                });
            }
        } else {
            addToHistory("Directory not found.");
        }
        break;
      case 'cd':
        if (!args[0]) {
            addToHistory(cwdDisplay);
        } else {
            const target = args[0];
            const newPath = resolvePath(activeTab.cwdPath, target);
            if (newPath) {
                updateTabState({ cwdPath: newPath });
            } else {
                addToHistory(`cd: ${target}: No such file or directory`);
            }
        }
        break;
      case 'mkdir':
        if (!args[0]) {
            addToHistory("mkdir: missing operand");
        } else {
            const currentNode = getNodeByPath(activeTab.cwdPath);
            if (currentNode && currentNode.type === 'folder') {
                if (currentNode.children?.find(c => c.name === args[0])) {
                    addToHistory(`mkdir: cannot create directory '${args[0]}': File exists`);
                } else {
                    const newFolder: FileSystemNode = {
                        id: `${Date.now()}`,
                        name: args[0],
                        type: 'folder',
                        dateModified: new Date(),
                        dateCreated: new Date(),
                        children: []
                    };
                    
                    // Recursive update helper
                    const addToPath = (nodes: FileSystemNode[], path: string[], depth: number): FileSystemNode[] => {
                        return nodes.map(n => {
                            if (n.id === path[depth]) {
                                if (depth === path.length - 1) {
                                    return { ...n, children: [...(n.children || []), newFolder] };
                                } else {
                                    return { ...n, children: addToPath(n.children || [], path, depth + 1) };
                                }
                            }
                            return n;
                        });
                    };
                    
                    updateFileSystem((prev) => addToPath(prev, activeTab.cwdPath, 0));
                }
            }
        }
        break;
      case 'touch':
         if (!args[0]) {
             addToHistory("touch: missing file operand");
         } else {
             const currentNode = getNodeByPath(activeTab.cwdPath);
             if (currentNode && currentNode.type === 'folder') {
                 if (currentNode.children?.find(c => c.name === args[0])) {
                     // Update time logic could go here
                 } else {
                     const newFile: FileSystemNode = {
                         id: `${Date.now()}`,
                         name: args[0],
                         type: 'file',
                         dateModified: new Date(),
                         dateCreated: new Date(),
                         content: '',
                         size: '0 KB'
                     };
                     const addToPath = (nodes: FileSystemNode[], path: string[], depth: number): FileSystemNode[] => {
                        return nodes.map(n => {
                            if (n.id === path[depth]) {
                                if (depth === path.length - 1) {
                                    return { ...n, children: [...(n.children || []), newFile] };
                                } else {
                                    return { ...n, children: addToPath(n.children || [], path, depth + 1) };
                                }
                            }
                            return n;
                        });
                    };
                    updateFileSystem((prev) => addToPath(prev, activeTab.cwdPath, 0));
                 }
             }
         }
         break;
      case 'rm':
         if (!args[0]) {
             addToHistory("rm: missing operand");
         } else {
             const targetName = args[0];
             const currentNode = getNodeByPath(activeTab.cwdPath);
             const targetNode = currentNode?.children?.find(c => c.name === targetName);
             
             if (targetNode) {
                 const deleteFromPath = (nodes: FileSystemNode[], path: string[], depth: number): FileSystemNode[] => {
                    return nodes.map(n => {
                        if (n.id === path[depth]) {
                            if (depth === path.length - 1) {
                                return { ...n, children: n.children?.filter(c => c.id !== targetNode.id) };
                            } else {
                                return { ...n, children: deleteFromPath(n.children || [], path, depth + 1) };
                            }
                        }
                        return n;
                    });
                };
                updateFileSystem((prev) => deleteFromPath(prev, activeTab.cwdPath, 0));
                addToHistory(`Removed '${targetName}'`);
             } else {
                 addToHistory(`rm: cannot remove '${targetName}': No such file or directory`);
             }
         }
         break;
      case 'cat':
         if (!args[0]) {
             addToHistory("cat: missing file operand");
         } else {
             const targetName = args[0];
             const currentNode = getNodeByPath(activeTab.cwdPath);
             const targetNode = currentNode?.children?.find(c => c.name === targetName);
             
             if (targetNode && targetNode.type === 'file') {
                 addToHistory(targetNode.content || '');
             } else if (targetNode && targetNode.type === 'folder') {
                 addToHistory(`cat: ${targetName}: Is a directory`);
             } else {
                 addToHistory(`cat: ${targetName}: No such file or directory`);
             }
         }
         break;
      case 'python':
      case 'python3':
        updateTabState({ mode: TerminalMode.PYTHON });
        addToHistory("Python 3.10.4 (main, Oct 14 2024, 14:22:11) [GCC 9.4.0] on windora");
        addToHistory('Type "help", "copyright", "credits" or "license" for more information.');
        break;
      case 'code':
         if (onOpenApp) onOpenApp('code');
         break;
      case 'chrome':
      case 'browser':
         if (onOpenApp) onOpenApp('browser');
         break;
      case 'notepad':
         if (onOpenApp) onOpenApp('notepad');
         break;
      case 'exit':
        if (tabs.length > 1) {
            const e = { stopPropagation: () => {} } as React.MouseEvent;
            handleCloseTab(activeTabId, e);
        } else {
            addToHistory("Cannot close the last tab.");
        }
        break;
      default:
        SystemSounds.playError();
        addToHistory(`'${command}' is not recognized as an internal or external command.`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(activeTab.currentInput);
      updateTabState({ currentInput: '' });
    }
  };

  // Get theme based on profile
  const getTheme = (profile: Profile) => {
      switch(profile) {
          case 'powershell': return { bg: 'bg-[#012456]', text: 'text-[#cccccc]', selection: 'bg-[#012456]' };
          case 'cmd': return { bg: 'bg-[#0c0c0c]', text: 'text-[#cccccc]', selection: 'bg-[#0c0c0c]' };
          case 'wsl': return { bg: 'bg-[#2c001e]', text: 'text-white', selection: 'bg-[#2c001e]' };
      }
  };

  const theme = getTheme(activeTab.profile);

  return (
    <div className={`h-full w-full flex flex-col overflow-hidden ${theme.bg} ${theme.text} transition-colors duration-200`}>
      {/* Tabs Header (Windows Terminal Style) */}
      <div className="h-9 bg-[#000000] flex items-center px-1 gap-1 select-none">
          {tabs.map(tab => (
              <div 
                key={tab.id} 
                onClick={() => setActiveTabId(tab.id)}
                className={`
                    h-8 px-3 flex items-center gap-2 rounded-t-md text-xs cursor-pointer border-t-2 transition-colors min-w-[140px] max-w-[200px] group
                    ${activeTabId === tab.id ? `${theme.bg} border-blue-500` : 'bg-transparent border-transparent hover:bg-[#1f1f1f] text-gray-400'}
                `}
              >
                  {tab.profile === 'powershell' && <ICONS.Terminal size={12} className="text-blue-400" />}
                  {tab.profile === 'cmd' && <ICONS.Command size={12} className="text-gray-200" />}
                  {tab.profile === 'wsl' && <ICONS.Server size={12} className="text-orange-400" />}
                  <span className="truncate flex-1">{tab.title}</span>
                  <button 
                    onClick={(e) => handleCloseTab(tab.id, e)}
                    className={`p-0.5 rounded hover:bg-white/20 ${activeTabId === tab.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                  >
                      <ICONS.XIcon size={10} />
                  </button>
              </div>
          ))}
          
          {/* New Tab Dropdown */}
          <div className="relative">
              <button 
                onClick={() => setShowProfiles(!showProfiles)}
                className="h-8 w-8 flex items-center justify-center hover:bg-[#1f1f1f] rounded text-gray-400 hover:text-white transition-colors"
              >
                  <ICONS.ChevronDown size={14} />
              </button>
              
              {showProfiles && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-[#2d2d2d] border border-[#454545] rounded shadow-xl z-50 py-1">
                      <button onClick={() => handleAddTab('powershell')} className="w-full px-4 py-2 text-left text-xs text-white hover:bg-[#3d3d3d] flex items-center gap-2">
                          <ICONS.Terminal size={14} className="text-blue-400" /> PowerShell
                      </button>
                      <button onClick={() => handleAddTab('cmd')} className="w-full px-4 py-2 text-left text-xs text-white hover:bg-[#3d3d3d] flex items-center gap-2">
                          <ICONS.Command size={14} className="text-gray-200" /> Command Prompt
                      </button>
                      <button onClick={() => handleAddTab('wsl')} className="w-full px-4 py-2 text-left text-xs text-white hover:bg-[#3d3d3d] flex items-center gap-2">
                          <ICONS.Server size={14} className="text-orange-400" /> Ubuntu (WSL)
                      </button>
                  </div>
              )}
          </div>
      </div>

      {/* Terminal Content */}
      <div 
        className="flex-1 p-2 font-mono text-sm overflow-y-auto custom-scrollbar"
        onClick={() => inputRef.current?.focus()}
      >
        {activeTab.history.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap break-words leading-snug">{line}</div>
        ))}
        
        <div className="mt-1 flex flex-wrap">
          <span className="mr-0 text-current font-semibold select-none whitespace-pre">
            {activeTab.mode === TerminalMode.PYTHON ? '>>> ' : 
             activeTab.profile === 'powershell' ? `PS ${getDisplayPath(activeTab.cwdPath, 'powershell')}> ` :
             activeTab.profile === 'wsl' ? `admin@windora:${getDisplayPath(activeTab.cwdPath, 'wsl')}$ ` :
             `${getDisplayPath(activeTab.cwdPath, 'cmd')}> `}
          </span>
          <input
            ref={inputRef}
            type="text"
            value={activeTab.currentInput}
            onChange={(e) => updateTabState({ currentInput: e.target.value })}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-current font-mono caret-current min-w-[50px]"
            autoFocus
            autoComplete="off"
            disabled={isProcessing}
          />
        </div>
        <div ref={endRef} />
      </div>
    </div>
  );
};

export default TerminalApp;
