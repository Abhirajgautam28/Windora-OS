
import React, { useState, useEffect } from 'react';
import { ICONS } from '../../constants';
import { AppProps, FileSystemNode } from '../../types';
import { ChevronRight, ChevronDown, X, Circle } from 'lucide-react';
import { SystemSounds } from '../../services/soundService';

interface VSCodeProps extends AppProps {
    initialContent?: string;
}

interface Tab {
    id: string;
    name: string;
    content: string;
    isDirty: boolean;
    path: string[]; // Track file path for saving
}

const VSCodeApp: React.FC<VSCodeProps> = ({ initialContent, fileSystem, setFileSystem }) => {
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['root']));

  // Initialize with a welcome tab or initial content
  useEffect(() => {
      if (initialContent) {
          const newTab = { id: 'init', name: 'Untitled', content: initialContent, isDirty: true, path: [] };
          setTabs([newTab]);
          setActiveTabId('init');
      } else if (tabs.length === 0) {
          const welcomeTab = { id: 'welcome', name: 'Welcome', content: '# Welcome to VS Code\n\nStart by opening a file from the explorer on the left.', isDirty: false, path: [] };
          setTabs([welcomeTab]);
          setActiveTabId('welcome');
      }
  }, []);

  // Recursive File Explorer Renderer
  const renderTree = (nodes: FileSystemNode[], path: string[] = []) => {
      return nodes.map(node => {
          const nodeId = node.id;
          const isExpanded = expandedFolders.has(nodeId);
          const isFolder = node.type === 'folder';
          const currentPath = [...path, node.id];

          return (
              <div key={node.id}>
                  <div 
                      className={`flex items-center gap-1 px-2 py-1 cursor-pointer hover:bg-[#2a2d2e] text-[#cccccc] ${activeTabId === node.id ? 'bg-[#37373d] text-white' : ''}`}
                      style={{ paddingLeft: `${path.length * 12 + 10}px` }}
                      onClick={() => handleNodeClick(node, currentPath)}
                  >
                      {isFolder && (
                          <span className="text-gray-400">
                              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                          </span>
                      )}
                      {!isFolder && (
                          <span className="ml-[18px]">
                              {getFileIcon(node.name)}
                          </span>
                      )}
                      <span className="text-sm truncate">{node.name}</span>
                  </div>
                  {isFolder && isExpanded && node.children && (
                      <div>{renderTree(node.children, currentPath)}</div>
                  )}
              </div>
          );
      });
  };

  const getFileIcon = (name: string) => {
      const ext = name.split('.').pop()?.toLowerCase();
      switch(ext) {
          case 'js': case 'ts': case 'jsx': case 'tsx': return <ICONS.Code2 size={14} className="text-yellow-400" />;
          case 'css': return <ICONS.Code2 size={14} className="text-blue-400" />;
          case 'html': return <ICONS.Code2 size={14} className="text-orange-400" />;
          case 'json': return <ICONS.FileText size={14} className="text-yellow-200" />;
          case 'py': return <ICONS.Code2 size={14} className="text-blue-300" />;
          case 'md': return <ICONS.Info size={14} className="text-blue-400" />;
          default: return <ICONS.FileText size={14} className="text-gray-400" />;
      }
  };

  const handleNodeClick = (node: FileSystemNode, path: string[]) => {
      if (node.type === 'folder') {
          const newExpanded = new Set(expandedFolders);
          if (newExpanded.has(node.id)) newExpanded.delete(node.id);
          else newExpanded.add(node.id);
          setExpandedFolders(newExpanded);
      } else {
          // Open file
          if (!tabs.find(t => t.id === node.id)) {
              const newTab: Tab = {
                  id: node.id,
                  name: node.name,
                  content: node.content || '',
                  isDirty: false,
                  path: path
              };
              setTabs([...tabs, newTab]);
          }
          setActiveTabId(node.id);
      }
  };

  const handleCloseTab = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      const newTabs = tabs.filter(t => t.id !== id);
      setTabs(newTabs);
      if (activeTabId === id && newTabs.length > 0) {
          setActiveTabId(newTabs[newTabs.length - 1].id);
      } else if (newTabs.length === 0) {
          setActiveTabId(null);
      }
  };

  const handleEditorChange = (newContent: string) => {
      if (!activeTabId) return;
      setTabs(tabs.map(t => t.id === activeTabId ? { ...t, content: newContent, isDirty: true } : t));
  };

  const handleSave = () => {
      const tab = tabs.find(t => t.id === activeTabId);
      if (!tab || !setFileSystem) return;

      // If it's a virtual/untitled file without a path, we can't save it back to FS in this simple sim (would need "Save As")
      if (tab.path.length === 0) return;

      // Helper to recursively update file content
      const updateContent = (nodes: FileSystemNode[], targetPath: string[], depth: number): FileSystemNode[] => {
          return nodes.map(node => {
              if (node.id === targetPath[depth]) {
                  if (depth === targetPath.length - 1) {
                      return { ...node, content: tab.content, dateModified: new Date() };
                  } else if (node.children) {
                      return { ...node, children: updateContent(node.children, targetPath, depth + 1) };
                  }
              }
              return node;
          });
      };

      // path[0] is usually 'root'
      // We need to find the node in the fileSystem array
      // Assuming fileSystem is array of roots, usually length 1
      
      // The path we stored includes root ID at index 0.
      // We pass the path to the recursive function
      
      setFileSystem(prev => updateContent(prev, tab.path, 0));
      setTabs(tabs.map(t => t.id === activeTabId ? { ...t, isDirty: false } : t));
      SystemSounds.playNotification(); // "Save" sound
  };

  // Keyboard Shortcuts
  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          if ((e.ctrlKey || e.metaKey) && e.key === 's') {
              e.preventDefault();
              handleSave();
          }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTabId, tabs]); // Dependencies important for closure

  const activeTab = tabs.find(t => t.id === activeTabId);

  return (
    <div className="flex h-full bg-[#1e1e1e] text-[#cccccc] font-sans text-sm select-none">
        {/* Activity Bar */}
        <div className="w-12 bg-[#333333] flex flex-col items-center py-3 gap-4 border-r border-[#111] shrink-0">
            <div className="border-l-2 border-white px-3 py-1"><ICONS.Copy size={24} className="text-white" /></div>
            <ICONS.Search size={24} className="text-[#858585] hover:text-white cursor-pointer transition-colors" />
            <ICONS.GitBranch size={24} className="text-[#858585] hover:text-white cursor-pointer transition-colors" />
            <ICONS.Code2 size={24} className="text-[#858585] hover:text-white cursor-pointer transition-colors" />
            <div className="mt-auto flex flex-col gap-4 mb-2">
                <ICONS.User size={24} className="text-[#858585] hover:text-white cursor-pointer transition-colors" />
                <ICONS.Settings size={24} className="text-[#858585] hover:text-white cursor-pointer transition-colors" />
            </div>
        </div>

        {/* Sidebar */}
        <div className="w-60 bg-[#252526] flex flex-col border-r border-[#111] shrink-0">
            <div className="h-9 flex items-center px-4 text-[11px] font-bold uppercase tracking-wider text-[#bbbbbb] shrink-0">Explorer</div>
            <div className="px-2 py-1 flex items-center gap-1 text-[#bbbbbb] font-bold bg-[#37373d] cursor-pointer shrink-0">
                <ChevronDown size={14} /> <span>WORKSPACE</span>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar py-1">
                {fileSystem && renderTree(fileSystem)}
            </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col bg-[#1e1e1e] overflow-hidden">
            {/* Tab Bar */}
            <div className="h-9 bg-[#252526] flex items-center overflow-x-auto scrollbar-hide shrink-0">
                {tabs.map(tab => (
                    <div 
                        key={tab.id}
                        onClick={() => setActiveTabId(tab.id)}
                        className={`
                            h-full px-3 flex items-center gap-2 border-t-2 border-r border-r-[#1e1e1e] text-xs min-w-[120px] max-w-[200px] cursor-pointer group
                            ${activeTabId === tab.id ? 'bg-[#1e1e1e] border-t-blue-500 text-white' : 'bg-[#2d2d2d] border-t-transparent text-[#969696] hover:bg-[#2a2d2e]'}
                        `}
                    >
                        <span className="truncate flex-1">{tab.name}</span>
                        {tab.isDirty ? (
                            <Circle size={8} className="text-white fill-white mr-1" />
                        ) : (
                            <X size={14} className="opacity-0 group-hover:opacity-100 hover:bg-[#444] rounded p-0.5 transition-opacity" onClick={(e) => handleCloseTab(tab.id, e)} />
                        )}
                    </div>
                ))}
            </div>

            {/* Breadcrumbs */}
            {activeTab && (
                <div className="h-6 flex items-center px-4 text-xs text-[#888] gap-1 border-b border-[#333] bg-[#1e1e1e] shrink-0">
                    <span>workspace</span>
                    {activeTab.path.slice(1).map(id => {
                        // Just visually showing dots for simplicity or trying to find names if we passed whole path names
                        return <React.Fragment key={id}><ChevronRight size={12} /> <span>...</span></React.Fragment>
                    })}
                    <ChevronRight size={12} /> <span className="text-white">{activeTab.name}</span>
                </div>
            )}

            {/* Editor Surface */}
            <div className="flex-1 relative font-mono text-sm overflow-hidden">
                {activeTab ? (
                    <>
                         <div className="absolute left-0 top-0 bottom-0 w-12 bg-[#1e1e1e] text-[#858585] text-right pr-4 pt-4 select-none leading-6 z-10">
                            {activeTab.content.split('\n').map((_, i) => <div key={i}>{i + 1}</div>)}
                        </div>
                        <textarea 
                            className="w-full h-full bg-[#1e1e1e] text-[#d4d4d4] p-4 pl-14 outline-none resize-none leading-6 custom-scrollbar whitespace-pre"
                            value={activeTab.content}
                            onChange={(e) => handleEditorChange(e.target.value)}
                            spellCheck={false}
                            autoFocus
                        />
                    </>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#3b3b3b]">
                        <ICONS.Code2 size={128} className="mb-4 opacity-10" />
                        <div className="text-sm">Select a file to start coding</div>
                        <div className="text-xs mt-2">Ctrl+S to save</div>
                    </div>
                )}
            </div>

            {/* Status Bar */}
            <div className="h-6 bg-[#007acc] text-white flex items-center px-3 text-xs justify-between select-none shrink-0">
                <div className="flex gap-3 items-center">
                    <div className="flex items-center gap-1 hover:bg-white/20 px-1 rounded cursor-pointer"><ICONS.GitBranch size={10} /> main*</div>
                    <div className="flex items-center gap-1 hover:bg-white/20 px-1 rounded cursor-pointer"><ICONS.XCircle size={10} /> 0</div>
                    <div className="flex items-center gap-1 hover:bg-white/20 px-1 rounded cursor-pointer"><ICONS.AlertTriangle size={10} /> 0</div>
                </div>
                <div className="flex gap-4">
                    <span className="hover:bg-white/20 px-1 rounded cursor-pointer">
                        Ln {activeTab ? activeTab.content.split('\n').length : 0}, Col {activeTab ? activeTab.content.length : 0}
                    </span>
                    <span className="hover:bg-white/20 px-1 rounded cursor-pointer">UTF-8</span>
                    <span className="hover:bg-white/20 px-1 rounded cursor-pointer">
                        {activeTab ? activeTab.name.split('.').pop()?.toUpperCase() : 'TXT'}
                    </span>
                    <span className="hover:bg-white/20 px-1 rounded cursor-pointer"><ICONS.Bell size={12} /></span>
                </div>
            </div>
        </div>
    </div>
  );
};

export default VSCodeApp;
