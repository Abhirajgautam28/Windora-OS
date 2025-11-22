
import React, { useState, useEffect, useRef } from 'react';
import { FileSystemNode, ViewMode, AppConfig } from '../types';
import { ICONS } from '../constants';
import { ChevronRight, ArrowLeft, ArrowUp, ArrowDown, ArrowRight as ArrowRightIcon, X, Plus, Check } from 'lucide-react';
import { SystemSounds } from '../services/soundService';

interface FileExplorerProps {
  windowId: string;
  fileSystem: FileSystemNode[];
  setFileSystem: React.Dispatch<React.SetStateAction<FileSystemNode[]>>;
  onOpenApp: (appId: string, data?: any) => void;
  apps: AppConfig[];
  onQuickLook?: (node: FileSystemNode) => void;
}

type IconSize = 'small' | 'medium' | 'large' | 'extra';
type SortKey = 'name' | 'date' | 'type' | 'size';
type SortDirection = 'asc' | 'desc';
type ToolbarItemKey = 'newFolder' | 'newFile' | 'cut' | 'copy' | 'paste' | 'rename' | 'delete' | 'properties' | 'sort' | 'view';

const RECYCLE_BIN_ID = 'trash';
const RECENTS_ID = 'recents';
const HIDDEN_VERSION_FOLDER = '.versions';

const TOOLBAR_OPTIONS: { id: ToolbarItemKey; label: string }[] = [
    { id: 'newFolder', label: 'New Folder' },
    { id: 'newFile', label: 'New File' },
    { id: 'cut', label: 'Cut' },
    { id: 'copy', label: 'Copy' },
    { id: 'paste', label: 'Paste' },
    { id: 'rename', label: 'Rename' },
    { id: 'delete', label: 'Delete' },
    { id: 'properties', label: 'Properties' },
    { id: 'sort', label: 'Sort Options' },
    { id: 'view', label: 'View Options' },
];

interface ExplorerTab {
    id: string;
    history: string[][];
    historyIndex: number;
    searchTerm: string;
}

// --- Syntax Highlighter Component ---
const SyntaxHighlight = ({ content, extension }: { content: string, extension: string }) => {
    const code = content || '';
    if (!['js', 'ts', 'tsx', 'jsx', 'py', 'html', 'css', 'json'].includes(extension)) return <>{code}</>;
    const parts = [];
    let lastIndex = 0;
    let regex: RegExp | null = null;
    if (['js', 'ts', 'tsx', 'jsx'].includes(extension)) regex = /(\/\/.*$|\/\*[\s\S]*?\*\/|["'`].*?["'`]|\b(?:const|let|var|function|return|if|else|for|while|import|export|from|class|new|this|async|await|try|catch|switch|case|break|continue|default|typeof|void|delete)\b|\b\d+\b)/gm;
    else if (extension === 'py') regex = /(#.*$|["'].*?["']|\b(?:def|class|import|from|return|if|else|elif|print|for|in|while|try|except|with|as|pass|break|continue|lambda|global|nonlocal|True|False|None)\b|\b\d+\b)/gm;
    else if (extension === 'html') regex = /(<!--[\s\S]*?-->|<\/?[a-z0-9]+(?: [^>]*)?>)/gi;
    else if (extension === 'css') regex = /(\/\*[\s\S]*?\*\/|[{}:;]|\b(?:color|background|margin|padding|font|border|width|height|display|position|top|left|right|bottom|flex|grid)\b)/gi;
    else if (extension === 'json') regex = /(".*?"(?=:)|".*?"|\b\d+\b|\b(?:true|false|null)\b)/g;

    if (!regex) return <>{code}</>;
    let match;
    while ((match = regex.exec(code)) !== null) {
        if (match.index > lastIndex) parts.push(<span key={`text-${lastIndex}`}>{code.slice(lastIndex, match.index)}</span>);
        const text = match[0];
        let className = "text-gray-800 dark:text-gray-200";
        if (text.startsWith('//') || text.startsWith('/*') || text.startsWith('#') || text.startsWith('<!--')) className = "text-gray-400 italic";
        else if ((text.startsWith('"') || text.startsWith("'") || text.startsWith('`')) && extension !== 'css' && extension !== 'json') className = "text-green-600 dark:text-green-400";
        else if (extension === 'json' && text.startsWith('"') && code[match.index + text.length] === ':') className = "text-blue-700 dark:text-blue-400 font-semibold";
        else if (extension === 'json' && text.startsWith('"')) className = "text-green-600 dark:text-green-400";
        else if (text.startsWith('<') && extension === 'html') className = "text-blue-600 dark:text-blue-400";
        else if (!isNaN(Number(text))) className = "text-orange-600 dark:text-orange-400";
        else className = "text-purple-600 dark:text-purple-400 font-semibold";
        if (extension === 'css') { if (text.match(/[{}:;]/)) className = "text-gray-500 dark:text-gray-400"; else if (!text.startsWith('/*')) className = "text-blue-600 dark:text-blue-400"; }
        parts.push(<span key={`match-${match.index}`} className={className}>{text}</span>);
        lastIndex = regex.lastIndex;
    }
    if (lastIndex < code.length) parts.push(<span key={`end-${lastIndex}`}>{code.slice(lastIndex)}</span>);
    return <>{parts}</>;
};

const FileExplorerApp: React.FC<FileExplorerProps> = ({ fileSystem, setFileSystem, onOpenApp, apps, onQuickLook }) => {
  const [tabs, setTabs] = useState<ExplorerTab[]>([ { id: '1', history: [['root']], historyIndex: 0, searchTerm: '' } ]);
  const [activeTabId, setActiveTabId] = useState<string>('1');

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];
  const history = activeTab.history;
  const historyIndex = activeTab.historyIndex;
  const currentPath = history[historyIndex] || ['root'];
  const searchTerm = activeTab.searchTerm;

  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [iconSize, setIconSize] = useState<IconSize>('medium');
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'name', direction: 'asc' });

  const [fileAssociations, setFileAssociations] = useState<Record<string, string>>({});
  const [openWithModal, setOpenWithModal] = useState<{ isOpen: boolean; nodeId: string | null }>({ isOpen: false, nodeId: null });
  const [openWithSelectedApp, setOpenWithSelectedApp] = useState<string | null>(null);
  const [openWithAlwaysUse, setOpenWithAlwaysUse] = useState(false);

  const [clipboard, setClipboard] = useState<{ id: string; action: 'copy' | 'cut' } | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; targetId: string | null } | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  
  const [tooltipData, setTooltipData] = useState<{ content: React.ReactNode, x: number, y: number } | null>(null);
  const tooltipTimeout = useRef<any>(null);

  const [propertiesId, setPropertiesId] = useState<string | null>(null);
  const [isCalculatingSize, setIsCalculatingSize] = useState(false);
  const [propertiesActiveTab, setPropertiesActiveTab] = useState<'general' | 'permissions'>('general');

  const [operation, setOperation] = useState<{ type: 'copying' | 'moving' | 'deleting'; progress: number; itemCount: number; sourceName: string } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const viewMenuRef = useRef<HTMLDivElement>(null);
  const sortMenuRef = useRef<HTMLDivElement>(null);
  const toolbarMenuRef = useRef<HTMLDivElement>(null);
  const operationIntervalRef = useRef<any>(null);
  const isMounted = useRef(true);

  const [visibleToolbarItems, setVisibleToolbarItems] = useState<ToolbarItemKey[]>(['newFolder', 'newFile', 'cut', 'copy', 'paste', 'rename', 'delete', 'properties', 'sort', 'view']);
  const [toolbarMenu, setToolbarMenu] = useState<{x: number, y: number} | null>(null);

  useEffect(() => {
      isMounted.current = true;
      return () => { 
          isMounted.current = false; 
          if (operationIntervalRef.current) clearInterval(operationIntervalRef.current);
      };
  }, []);

  const getRecursiveNode = (nodes: FileSystemNode[], id: string): FileSystemNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = getRecursiveNode(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const getCurrentFolder = () => {
      if (currentPath[currentPath.length - 1] === RECENTS_ID) {
          return { id: RECENTS_ID, name: 'Recents', type: 'folder', children: [] } as FileSystemNode;
      }
      let current = fileSystem.find(n => n.id === 'root');
      for (let i = 1; i < currentPath.length; i++) {
          if (current && current.children) current = current.children.find(c => c.id === currentPath[i]);
      }
      return current || null;
  };
  const currentFolder = getCurrentFolder();

  const getAllFiles = (nodes: FileSystemNode[]): FileSystemNode[] => {
      let files: FileSystemNode[] = [];
      for (const node of nodes) {
          if (node.type === 'file' && node.name !== HIDDEN_VERSION_FOLDER) {
              files.push(node);
          }
          if (node.children) {
              files = [...files, ...getAllFiles(node.children)];
          }
      }
      return files;
  };

  const renameNodeRecursive = (nodes: FileSystemNode[], id: string, newName: string): FileSystemNode[] => nodes.map(node => node.id === id ? { ...node, name: newName } : node.children ? { ...node, children: renameNodeRecursive(node.children, id, newName) } : node);
  const deleteNodeRecursive = (nodes: FileSystemNode[], id: string): FileSystemNode[] => nodes.filter(node => node.id !== id).map(node => ({ ...node, children: node.children ? deleteNodeRecursive(node.children, id) : undefined }));
  const updateTree = (nodes: FileSystemNode[], targetPath: string[], depth: number, operation: (node: FileSystemNode) => FileSystemNode): FileSystemNode[] => nodes.map(node => node.id === targetPath[depth] ? (depth === targetPath.length - 1 ? operation(node) : { ...node, children: updateTree(node.children || [], targetPath, depth + 1, operation) }) : node);
  const addChildToNode = (nodes: FileSystemNode[], targetId: string, childToAdd: FileSystemNode): FileSystemNode[] => nodes.map(node => node.id === targetId ? { ...node, children: [...(node.children || []), childToAdd] } : node.children ? { ...node, children: addChildToNode(node.children, targetId, childToAdd) } : node);
  const deepCloneNode = (node: FileSystemNode): FileSystemNode => ({ ...node, id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, dateModified: new Date(), dateCreated: new Date(), children: node.children ? node.children.map(deepCloneNode) : undefined });
  const countNodes = (node: FileSystemNode): number => { let count = 1; if (node.children) count += node.children.reduce((acc, c) => acc + countNodes(c), 0); return count; };
  const getFolderCounts = (node: FileSystemNode): { files: number, folders: number } => { let files = 0; let folders = 0; if (node.children) { node.children.forEach(child => { if (child.type === 'file') files++; else folders++; }); } return { files, folders }; };
  const isDescendant = (possibleParentId: string, targetId: string): boolean => {
    const parent = getRecursiveNode(fileSystem, possibleParentId);
    if (!parent || !parent.children) return false;
    const check = (nodes: FileSystemNode[]): boolean => { for (const node of nodes) { if (node.id === targetId) return true; if (node.children && check(node.children)) return true; } return false; };
    return check(parent.children || []);
  };
  const parseSize = (sizeStr?: string): number => { if (!sizeStr) return 0; const match = sizeStr.match(/^([\d.]+)\s*([a-zA-Z]+)$/); if (!match) return 0; const value = parseFloat(match[1]); const unit = match[2].toUpperCase(); const multipliers: any = { 'B': 1, 'KB': 1024, 'MB': 1024 * 1024, 'GB': 1024 * 1024 * 1024 }; return value * (multipliers[unit] || 1); };
  const formatBytes = (bytes: number) => { if (bytes === 0) return '0 Bytes'; const k = 1024; const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']; const i = Math.floor(Math.log(bytes) / Math.log(k)); return parseFloat((bytes / Math.pow(k, i < 0 ? 0 : i)).toFixed(2)) + ' ' + sizes[i < 0 ? 0 : i]; };
  const calculateFolderSize = (node: FileSystemNode): number => { if (node.type === 'file') return parseSize(node.size); if (node.children) return node.children.reduce((acc, child) => acc + calculateFolderSize(child), 0); return 0; };
  const formatSize = (node: FileSystemNode) => node.type === 'folder' ? '' : node.size || '0 KB';
  const formatDate = (date?: Date) => date ? new Date(date).toLocaleDateString() + ' ' + new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
  
  const getFileIcon = (node: FileSystemNode, size: number) => {
      if (node.id === RECYCLE_BIN_ID) return <ICONS.Trash2 size={size} className="text-gray-500 dark:text-gray-400 drop-shadow-sm" />;
      const isFolder = node.type === 'folder';
      if (isFolder) return <ICONS.Folder size={size} className="text-yellow-400 drop-shadow-sm" fill="currentColor" />;
      const ext = node.name.split('.').pop()?.toLowerCase();
      switch(ext) {
        case 'jpg': case 'jpeg': case 'png': case 'gif': case 'bmp': case 'webp': case 'svg': case 'ico': return <ICONS.ImageIcon size={size} className="text-purple-500" />;
        case 'mp3': case 'wav': case 'ogg': case 'flac': case 'm4a': return <ICONS.Music size={size} className="text-pink-500" />;
        case 'mp4': case 'mov': case 'avi': case 'mkv': case 'webm': return <ICONS.Video size={size} className="text-red-500" />;
        case 'js': case 'ts': case 'tsx': case 'jsx': case 'py': case 'html': case 'css': case 'json': case 'md': case 'xml': case 'java': case 'c': case 'cpp': case 'php': return <ICONS.Code2 size={size} className="text-green-500" />;
        case 'zip': case 'rar': case '7z': case 'tar': case 'gz': return <ICONS.FolderOpen size={size} className="text-orange-500" />;
        case 'pdf': return <ICONS.FileText size={size} className="text-red-600" />;
        case 'doc': case 'docx': return <ICONS.FileText size={size} className="text-blue-600" />;
        case 'xls': case 'xlsx': case 'csv': return <ICONS.FileText size={size} className="text-emerald-600" />;
        case 'ppt': case 'pptx': return <ICONS.FileText size={size} className="text-orange-600" />;
        default: return <ICONS.FileText size={size} className="text-blue-400" />;
      }
  };

  const getQuickAccessId = (name: string) => { const root = fileSystem[0]; return root.children?.find(c => c.name === name)?.id || null; };
  const getQuickAccessPath = (name: string) => { const id = getQuickAccessId(name); return id ? ['root', id] : null; };
  const isTextFile = (id: string) => {
      const node = getRecursiveNode(fileSystem, id);
      if(!node) return false;
      const ext = node.name.split('.').pop()?.toLowerCase() || '';
      return ['txt', 'md', 'js', 'ts', 'py', 'json', 'css', 'html'].includes(ext);
  };

  const updateActiveTab = (updates: Partial<ExplorerTab>) => setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, ...updates } : t));
  const handleNewTab = () => { const newId = Date.now().toString(); setTabs(prev => [...prev, { id: newId, history: [['root']], historyIndex: 0, searchTerm: '' }]); setActiveTabId(newId); setSelectedItem(null); };
  const handleCloseTab = (e: React.MouseEvent, id: string) => { e.stopPropagation(); if (tabs.length === 1) return; const newTabs = tabs.filter(t => t.id !== id); setTabs(newTabs); if (activeTabId === id) { setActiveTabId(newTabs[newTabs.length - 1].id); setSelectedItem(null); } };
  const navigate = (path: string[]) => { const nextHistory = history.slice(0, historyIndex + 1); nextHistory.push(path); updateActiveTab({ history: nextHistory, historyIndex: nextHistory.length - 1, searchTerm: '' }); setSelectedItem(null); };
  const handleGoBack = () => { if (historyIndex > 0) { updateActiveTab({ historyIndex: historyIndex - 1 }); setSelectedItem(null); } };
  const handleGoForward = () => { if (historyIndex < history.length - 1) { updateActiveTab({ historyIndex: historyIndex + 1 }); setSelectedItem(null); } };
  const handleGoUp = () => { if (currentPath.length > 1) navigate(currentPath.slice(0, -1)); };
  const setSearchTerm = (term: string) => updateActiveTab({ searchTerm: term });
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };
  const handleSidebarClick = (path: string[]) => navigate(path);
  const handleNavigate = (id: string) => {
      if (id === RECENTS_ID) { navigate(['root', RECENTS_ID]); return; }
      const node = getRecursiveNode(fileSystem, id);
      if(!node) return;
      if (node.type === 'folder') navigate([...currentPath, id]);
      else {
          const ext = node.name.split('.').pop()?.toLowerCase() || '';
          const appId = fileAssociations[ext];
          if (appId) onOpenApp(appId, node.content);
          else if (node.name.match(/\.(jpg|jpeg|png|gif)$/i)) setSelectedItem(id);
          else onOpenApp('code', node.content);
      }
  };

  const createNewFolder = () => { if (!currentFolder || currentFolder.id === RECENTS_ID) return; const newFolder: FileSystemNode = { id: `${Date.now()}`, name: 'New Folder', type: 'folder', dateModified: new Date(), dateCreated: new Date(), children: [] }; setFileSystem(updateTree(fileSystem, currentPath, 0, (n) => ({ ...n, children: [...(n.children || []), newFolder] }))); };
  const createNewFile = () => { if (!currentFolder || currentFolder.id === RECENTS_ID) return; let name = 'New Text Document.txt'; let counter = 1; const existing = currentFolder.children?.map(c => c.name) || []; while (existing.includes(name)) { name = `New Text Document (${counter}).txt`; counter++; } const newFile: FileSystemNode = { id: `${Date.now()}`, name: name, type: 'file', dateModified: new Date(), dateCreated: new Date(), content: '', size: '0 KB' }; setFileSystem(updateTree(fileSystem, currentPath, 0, (n) => ({ ...n, children: [...(n.children || []), newFile] }))); setTimeout(() => { setRenamingId(newFile.id); setRenameValue(newFile.name.replace('.txt', '')); }, 50); };
  const handleCopy = (id?: string) => { const targetId = id || selectedItem; if (!targetId) return; setClipboard({ id: targetId, action: 'copy' }); setContextMenu(null); showToast("Copied to clipboard"); SystemSounds.playClick(); };
  const handleCut = (id?: string) => { const targetId = id || selectedItem; if (!targetId) return; setClipboard({ id: targetId, action: 'cut' }); setContextMenu(null); showToast("Selection cut"); SystemSounds.playClick(); };
  const handlePaste = () => { if (!clipboard || !currentFolder || currentFolder.id === RECENTS_ID) return; const sourceNode = getRecursiveNode(fileSystem, clipboard.id); if (!sourceNode) return; if (clipboard.action === 'cut' && sourceNode.type === 'folder' && (isDescendant(sourceNode.id, currentFolder.id) || sourceNode.id === currentFolder.id)) return alert("Cannot move a folder into itself."); setOperation({ type: clipboard.action === 'copy' ? 'copying' : 'moving', progress: 0, itemCount: countNodes(sourceNode), sourceName: sourceNode.name }); setContextMenu(null); if (operationIntervalRef.current) clearInterval(operationIntervalRef.current); let p = 0; operationIntervalRef.current = setInterval(() => { if (!isMounted.current) return; p += Math.random() * 15 + 5; if (p > 100) p = 100; setOperation(prev => prev ? { ...prev, progress: p } : null); if (p >= 100) { clearInterval(operationIntervalRef.current); setTimeout(() => { if (!isMounted.current) return; let nodeToPaste = clipboard.action === 'copy' ? deepCloneNode(sourceNode) : { ...sourceNode }; let newName = nodeToPaste.name; let counter = 1; const existingNames = currentFolder.children?.map(c => c.name) || []; if (existingNames.includes(newName)) { const parts = newName.split('.'); const ext = parts.length > 1 ? '.' + parts.pop() : ''; const base = parts.join('.'); while (existingNames.includes(newName)) { newName = `${base} - Copy${counter > 1 ? ` (${counter})` : ''}${ext}`; counter++; } } nodeToPaste.name = newName; setFileSystem(prev => { let fs = prev; if (clipboard.action === 'cut') fs = deleteNodeRecursive(fs, clipboard.id); return addChildToNode(fs, currentFolder.id, nodeToPaste); }); if (clipboard.action === 'cut') setClipboard(null); setOperation(null); SystemSounds.playClick(); }, 300); } }, 150); };
  const handleDelete = (targetId?: string) => { const idToDelete = targetId || contextMenu?.targetId || selectedItem; if (!idToDelete) return; const node = getRecursiveNode(fileSystem, idToDelete); if (!node) return; const count = countNodes(node); const inRecycleBin = history[historyIndex].includes(RECYCLE_BIN_ID); if (operationIntervalRef.current) clearInterval(operationIntervalRef.current); if (inRecycleBin) { setOperation({ type: 'deleting', progress: 0, itemCount: count, sourceName: node.name }); let p = 0; operationIntervalRef.current = setInterval(() => { if (!isMounted.current) return; p += Math.random() * 20 + 10; if (p > 100) p = 100; setOperation(prev => prev ? { ...prev, progress: p } : null); if (p >= 100) { clearInterval(operationIntervalRef.current); setTimeout(() => { if (!isMounted.current) return; setFileSystem(prev => deleteNodeRecursive(prev, idToDelete)); setOperation(null); setSelectedItem(null); showToast("Item permanently deleted"); SystemSounds.playClick(); }, 300); } }, 100); setContextMenu(null); } else { setFileSystem(prev => addChildToNode(deleteNodeRecursive(prev, idToDelete), RECYCLE_BIN_ID, node)); setContextMenu(null); setSelectedItem(null); showToast("Moved to Recycle Bin"); SystemSounds.playClick(); } };
  const handleStartRename = () => { const targetId = contextMenu?.targetId || selectedItem; if (targetId) { const node = getRecursiveNode(fileSystem, targetId); if (node) { setRenamingId(targetId); setRenameValue(node.name); } } setContextMenu(null); };
  const submitRename = () => { if (renamingId && renameValue.trim()) setFileSystem(prev => renameNodeRecursive(prev, renamingId, renameValue)); setRenamingId(null); setRenameValue(""); };
  const handleEmptyRecycleBin = () => { if (window.confirm("Permanently delete all items?")) setFileSystem(prev => prev.map(node => node.id === 'root' ? { ...node, children: node.children?.map(child => child.id === RECYCLE_BIN_ID ? { ...child, children: [] } : child) } : node)); };
  const handleSort = (key: SortKey) => { setSortConfig(prev => ({ key, direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc' })); setShowSortMenu(false); };
  const renderSortIcon = (key: SortKey) => sortConfig.key === key ? (sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />) : null;
  const handleContextMenu = (e: React.MouseEvent, id: string | null) => { e.preventDefault(); e.stopPropagation(); let x = e.clientX, y = e.clientY; if (x + 224 > window.innerWidth) x = window.innerWidth - 224 - 10; if (y + 300 > window.innerHeight) y = window.innerHeight - 300 - 10; setContextMenu({ x, y, targetId: id }); if (id) setSelectedItem(id); };
  const handleProperties = () => { const targetId = contextMenu?.targetId || selectedItem || (contextMenu ? currentFolder?.id : null); if (targetId) { setPropertiesId(targetId); setPropertiesActiveTab('general'); setContextMenu(null); const node = getRecursiveNode(fileSystem, targetId); if (node && node.type === 'folder') { setIsCalculatingSize(true); setTimeout(() => { if (isMounted.current) setIsCalculatingSize(false); }, 800); } } };
  const handleOpenWith = (appId: string) => { const targetId = contextMenu?.targetId || selectedItem; if (targetId) { const node = getRecursiveNode(fileSystem, targetId); if (node?.type === 'file') onOpenApp(appId, node.content); setContextMenu(null); } };
  const handleOpenWithDialog = () => { const targetId = contextMenu?.targetId || selectedItem; if(targetId) { setOpenWithModal({ isOpen: true, nodeId: targetId }); const node = getRecursiveNode(fileSystem, targetId); const ext = node?.name.split('.').pop()?.toLowerCase() || ''; const def = fileAssociations[ext]; setOpenWithSelectedApp(def || null); setOpenWithAlwaysUse(!!def); setContextMenu(null); } };
  const handleToolbarContextMenu = (e: React.MouseEvent) => { e.preventDefault(); setToolbarMenu({ x: e.clientX, y: e.clientY }); };
  const toggleToolbarItem = (id: ToolbarItemKey) => setVisibleToolbarItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  const handleDragStart = (e: React.DragEvent, node: FileSystemNode) => { setDraggedItemId(node.id); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', node.id); handleMouseLeaveItem(); };
  const handleDragOver = (e: React.DragEvent, id: string, isFolder: boolean) => { e.preventDefault(); if (draggedItemId === id) return; if (isFolder) { setDragOverId(id); e.dataTransfer.dropEffect = 'move'; } else { setDragOverId(null); e.dataTransfer.dropEffect = 'none'; } };
  const handleDragLeave = () => setDragOverId(null);
  const handleDrop = (e: React.DragEvent, targetId: string) => { e.preventDefault(); setDragOverId(null); const sourceId = e.dataTransfer.getData('text/plain'); if (sourceId && sourceId !== targetId) { const source = getRecursiveNode(fileSystem, sourceId); const target = getRecursiveNode(fileSystem, targetId); if (source && target && target.type === 'folder') { if (source.type === 'folder' && (isDescendant(source.id, targetId) || source.id === targetId)) return showToast("Cannot move a folder into itself"); setFileSystem(prev => addChildToNode(deleteNodeRecursive(prev, sourceId), targetId, source)); showToast(`Moved ${source.name}`); SystemSounds.playClick(); } } setDraggedItemId(null); };
  const handleMouseEnterItem = (e: React.MouseEvent, node: FileSystemNode) => { if (draggedItemId) return; if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current); tooltipTimeout.current = setTimeout(() => setTooltipData({ content: <div className="flex flex-col gap-1"><div className="font-bold">{node.name}</div><div>Type: {node.type === 'folder' ? 'File folder' : node.name.split('.').pop()?.toUpperCase() + ' File'}</div><div>Size: {node.type === 'folder' ? formatBytes(calculateFolderSize(node)) : node.size}</div><div>Date: {formatDate(node.dateModified)}</div></div>, x: e.clientX + 10, y: e.clientY + 10 }), 1000); };
  const handleMouseLeaveItem = () => { if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current); setTooltipData(null); };

  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          if (renamingId || openWithModal.isOpen) return;
          if (contextMenu && e.key === 'Escape') setContextMenu(null);
          if (e.altKey) {
              if(e.key === 'ArrowLeft') { e.preventDefault(); handleGoBack(); }
              if(e.key === 'ArrowRight') { e.preventDefault(); handleGoForward(); }
              if(e.key === 'ArrowUp') { e.preventDefault(); handleGoUp(); }
          }
          if (e.key === 'Enter' && selectedItem && !e.altKey && !e.ctrlKey) handleNavigate(selectedItem);
          if (e.key === 'Delete' && selectedItem) handleDelete();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history, renamingId, openWithModal.isOpen, selectedItem, contextMenu]);

  const sortNodes = (nodes: FileSystemNode[]) => [...nodes].sort((a, b) => {
      if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
      let comparison = 0;
      switch (sortConfig.key) {
        case 'name': comparison = a.name.localeCompare(b.name, undefined, { sensitivity: 'base', numeric: true }); break;
        case 'size': comparison = calculateFolderSize(a) - calculateFolderSize(b); break;
        case 'date': comparison = (new Date(a.dateModified || 0).getTime()) - (new Date(b.dateModified || 0).getTime()); break;
        case 'type': comparison = (a.name.split('.').pop() || '').localeCompare(b.name.split('.').pop() || '', undefined, { sensitivity: 'base' }); break;
      }
      return sortConfig.direction === 'asc' ? comparison : -comparison;
  });

  const getSearchResults = (nodes: FileSystemNode[], term: string): FileSystemNode[] => {
    let matches: FileSystemNode[] = [];
    for (const node of nodes) {
      if (node.name.toLowerCase().includes(term.toLowerCase())) matches.push(node);
      if (node.children) matches = [...matches, ...getSearchResults(node.children, term)];
    }
    return matches;
  };

  const rawChildren = searchTerm ? getSearchResults(currentFolder?.children || [], searchTerm) : (currentPath[currentPath.length-1] === RECENTS_ID ? getAllFiles(fileSystem).sort((a,b) => (b.dateModified?.getTime() || 0) - (a.dateModified?.getTime() || 0)).slice(0, 20) : currentFolder?.children || []);
  const displayedChildren = searchTerm || currentPath[currentPath.length-1] === RECENTS_ID ? rawChildren : sortNodes(rawChildren.filter(n => n.name !== HIDDEN_VERSION_FOLDER));
  const sizeConfig = { small: { gridMin: 70, icon: 32, folderIcon: 36, text: 'text-[10px]' }, medium: { gridMin: 100, icon: 48, folderIcon: 56, text: 'text-xs' }, large: { gridMin: 130, icon: 64, folderIcon: 72, text: 'text-sm' }, extra: { gridMin: 180, icon: 96, folderIcon: 110, text: 'text-base' } }[iconSize];

  const getNodePath = (targetId: string): string => {
      const findPath = (nodes: FileSystemNode[], currentPath: string): string | null => {
          for (const node of nodes) {
              const newPath = currentPath ? `${currentPath}\\${node.name}` : node.name;
              if (node.id === targetId) return newPath;
              if (node.children) {
                  const found = findPath(node.children, newPath);
                  if (found) return found;
              }
          }
          return null;
      };
      return findPath(fileSystem, 'C:') || 'Unknown location';
  };

  const togglePermission = (nodeId: string, perm: 'read' | 'write' | 'execute') => {
      setFileSystem(prev => {
          const update = (nodes: FileSystemNode[]): FileSystemNode[] => nodes.map(node => {
              if (node.id === nodeId) {
                  const permissions = node.permissions || { read: true, write: true, execute: true };
                  return { ...node, permissions: { ...permissions, [perm]: !permissions[perm] } };
              }
              if (node.children) return { ...node, children: update(node.children) };
              return node;
          });
          return update(prev);
      });
  };

  const applyRecursivePermissions = () => {
      if (!propertiesId) return;
      const node = getRecursiveNode(fileSystem, propertiesId);
      if (!node) return;
      const perms = node.permissions || { read: true, write: true, execute: true };
      
      setFileSystem(prev => {
          const update = (nodes: FileSystemNode[], apply: boolean): FileSystemNode[] => nodes.map(n => {
              let newNode = { ...n };
              let shouldApply = apply;
              if (n.id === propertiesId) shouldApply = true;
              else if (apply) newNode.permissions = { ...perms };
              
              if (newNode.children) newNode.children = update(newNode.children, shouldApply);
              return newNode;
          });
          return update(prev, false);
      });
      showToast("Permissions applied recursively");
  };

  const renderPropertiesModal = () => {
    if (!propertiesId) return null;
    const node = getRecursiveNode(fileSystem, propertiesId);
    if (!node) return null;
    const type = node.type === 'folder' ? 'File folder' : `${node.name.split('.').pop()?.toUpperCase() || 'FILE'} File`;
    const path = getNodePath(node.id);
    const perms = node.permissions || { read: true, write: true, execute: true };
    let sizeDisplay = <span className="text-gray-400 animate-pulse">Calculating...</span>;
    let containsDisplay = <span className="text-gray-400 animate-pulse">Scanning...</span>;

    if (!isCalculatingSize) {
        const sizeBytes = calculateFolderSize(node);
        sizeDisplay = <span className="text-gray-800 dark:text-gray-300">{formatBytes(sizeBytes)} ({sizeBytes.toLocaleString()} bytes)</span>;
        const { files, folders } = node.type === 'folder' ? getFolderCounts(node) : { files: 0, folders: 0 };
        containsDisplay = <span className="text-gray-800 dark:text-gray-300">{files} Files, {folders} Folders</span>;
    }
    
    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/20 backdrop-blur-[1px]" onClick={() => setPropertiesId(null)}>
            <div className="w-80 bg-[#f0f0f0] dark:bg-[#2d2d2d] rounded-lg shadow-xl border border-gray-300 dark:border-gray-600 overflow-hidden text-sm text-gray-900 dark:text-white" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between px-3 py-2 bg-white dark:bg-[#333] border-b border-gray-200 dark:border-gray-600">
                    <span className="font-medium">{node.name} Properties</span>
                    <button onClick={() => setPropertiesId(null)} className="hover:bg-red-500 hover:text-white p-1 rounded"><X size={12} /></button>
                </div>
                <div className="flex border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-[#252526]">
                      <button className={`flex-1 py-2 text-xs font-medium border-b-2 transition-colors ${propertiesActiveTab === 'general' ? 'border-blue-500 text-blue-600 bg-white dark:bg-[#333]' : 'border-transparent text-gray-600 dark:text-gray-400'}`} onClick={() => setPropertiesActiveTab('general')}>General</button>
                      <button className={`flex-1 py-2 text-xs font-medium border-b-2 transition-colors ${propertiesActiveTab === 'permissions' ? 'border-blue-500 text-blue-600 bg-white dark:bg-[#333]' : 'border-transparent text-gray-600 dark:text-gray-400'}`} onClick={() => setPropertiesActiveTab('permissions')}>Permissions</button>
                </div>
                <div className="p-4">
                    {propertiesActiveTab === 'general' ? (
                        <>
                            <div className="flex items-center gap-4 mb-4">
                                {getFileIcon(node, 32)}
                                <div className="flex-1"><input className="border border-gray-300 dark:border-gray-500 rounded px-2 py-1 w-full bg-white dark:bg-[#1e1e1e]" value={node.name} onChange={(e) => setFileSystem(prev => renameNodeRecursive(prev, node.id, e.target.value))} /></div>
                            </div>
                            <div className="grid grid-cols-[80px_1fr] gap-y-2 text-xs">
                                <span className="text-gray-500">Type:</span><span>{type}</span>
                                <span className="text-gray-500">Location:</span><span className="truncate">{path}</span>
                                <span className="text-gray-500">Size:</span><span>{sizeDisplay}</span>
                                {node.type === 'folder' && <><span className="text-gray-500">Contains:</span>{containsDisplay}</>}
                                <span className="text-gray-500">Created:</span><span>{formatDate(node.dateCreated)}</span>
                                <span className="text-gray-500">Modified:</span><span>{formatDate(node.dateModified)}</span>
                            </div>
                        </>
                    ) : (
                         <div className="space-y-2">
                             <div className="flex items-center justify-between"><span className="text-xs">Read</span><input type="checkbox" checked={perms.read} onChange={() => togglePermission(node.id, 'read')} /></div>
                             <div className="flex items-center justify-between"><span className="text-xs">Write</span><input type="checkbox" checked={perms.write} onChange={() => togglePermission(node.id, 'write')} /></div>
                             <div className="flex items-center justify-between"><span className="text-xs">Execute</span><input type="checkbox" checked={perms.execute} onChange={() => togglePermission(node.id, 'execute')} /></div>
                             {node.type === 'folder' && <button onClick={applyRecursivePermissions} className="w-full mt-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700">Apply to children</button>}
                         </div>
                    )}
                    <div className="flex justify-end gap-2 mt-6">
                        <button onClick={() => setPropertiesId(null)} className="px-4 py-1 bg-gray-200 dark:bg-[#444] border border-gray-300 dark:border-gray-500 rounded text-xs hover:bg-gray-300 dark:hover:bg-[#555] transition-colors">OK</button>
                    </div>
                </div>
            </div>
        </div>
    );
  };

  const renderOperationModal = () => {
      if (!operation) return null;
      return (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/10 backdrop-blur-[1px]">
              <div className="w-96 bg-[#f0f0f0] dark:bg-[#2d2d2d] rounded-lg shadow-xl border border-gray-300 dark:border-gray-600 overflow-hidden p-4 text-sm text-gray-900 dark:text-white">
                  <div className="font-medium mb-2">{operation.type === 'copying' ? 'Copying' : operation.type === 'moving' ? 'Moving' : 'Deleting'} {operation.itemCount} items...</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">{operation.type === 'deleting' ? 'From' : 'To'} {currentFolder?.name || 'Destination'}</div>
                  <div className="h-4 bg-gray-200 dark:bg-[#444] rounded-full overflow-hidden border border-gray-300 dark:border-gray-500 relative">
                      <div className="h-full bg-green-500 transition-all duration-150" style={{ width: `${operation.progress}%` }}></div>
                  </div>
                  <div className="flex justify-between text-xs mt-2"><span>{Math.round(operation.progress)}% complete</span><button className="text-blue-600 hover:underline">Cancel</button></div>
              </div>
          </div>
      );
  };

  const renderOpenWithModal = () => {
      if (!openWithModal.isOpen) return null;
      return (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/20 backdrop-blur-[1px]" onClick={() => setOpenWithModal({ ...openWithModal, isOpen: false })}>
              <div className="w-96 bg-[#f0f0f0] dark:bg-[#2d2d2d] rounded-lg shadow-xl border border-gray-300 dark:border-gray-600 overflow-hidden flex flex-col max-h-[500px]" onClick={e => e.stopPropagation()}>
                  <div className="p-4 bg-white dark:bg-[#333] border-b border-gray-200 dark:border-gray-600">
                      <h3 className="font-medium text-gray-900 dark:text-white">How do you want to open this file?</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 space-y-1">
                      {apps.filter(a => !['files', 'settings'].includes(a.id)).map(app => (
                          <div key={app.id} onClick={() => setOpenWithSelectedApp(app.id)} className={`flex items-center gap-3 p-2 rounded cursor-pointer ${openWithSelectedApp === app.id ? 'bg-blue-100 dark:bg-blue-900/30 ring-1 ring-blue-500' : 'hover:bg-gray-200 dark:hover:bg-white/5'}`}>
                              <div className={`w-8 h-8 rounded flex items-center justify-center text-white ${app.color}`}><app.icon size={16} /></div>
                              <span className="text-sm text-gray-800 dark:text-gray-200">{app.name}</span>
                          </div>
                      ))}
                  </div>
                  <div className="p-4 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-[#2d2d2d]">
                      <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 mb-4 cursor-pointer"><input type="checkbox" checked={openWithAlwaysUse} onChange={(e) => setOpenWithAlwaysUse(e.target.checked)} /> Always use this app to open files</label>
                      <div className="flex justify-end gap-2">
                          <button onClick={() => setOpenWithModal({ ...openWithModal, isOpen: false })} className="px-4 py-1.5 bg-gray-200 dark:bg-[#444] border border-gray-300 dark:border-gray-500 rounded text-xs hover:bg-gray-300 dark:hover:bg-[#555] transition-colors text-gray-800 dark:text-white">Cancel</button>
                          <button onClick={() => { if (openWithSelectedApp && openWithModal.nodeId) { const node = getRecursiveNode(fileSystem, openWithModal.nodeId); if (node) { if (openWithAlwaysUse) { const ext = node.name.split('.').pop()?.toLowerCase() || ''; setFileAssociations(prev => ({ ...prev, [ext]: openWithSelectedApp })); } onOpenApp(openWithSelectedApp, node.content); } } setOpenWithModal({ ...openWithModal, isOpen: false }); }} className="px-4 py-1.5 bg-blue-600 text-white border border-blue-700 rounded text-xs hover:bg-blue-700 transition-colors" disabled={!openWithSelectedApp}>OK</button>
                      </div>
                  </div>
              </div>
          </div>
      );
  };

  return (
    <div className="flex h-full flex-col bg-white dark:bg-[#1e1e1e] text-gray-800 dark:text-gray-200 font-sans select-none relative transition-colors" onContextMenu={(e) => handleContextMenu(e, null)}>
      
      {/* Tabs Bar */}
      <div className="h-9 bg-[#d3d3d3] dark:bg-[#191919] flex items-end px-1.5 gap-1 pt-1.5 border-b border-gray-300 dark:border-black">
          {tabs.map(tab => {
              let tabTitle = 'Root';
              if (tab.history[tab.historyIndex][tab.history.length-1] === RECENTS_ID) tabTitle = 'Recents';
              else {
                  const tabCurrentNode = getRecursiveNode(fileSystem, tab.history[tab.historyIndex][tab.history.length-1]);
                  if (tabCurrentNode) tabTitle = tabCurrentNode.name;
              }
              return (
                  <div key={tab.id} onClick={() => setActiveTabId(tab.id)} className={`group relative h-[30px] px-3 min-w-[120px] max-w-[200px] rounded-t-md flex items-center gap-2 text-xs select-none cursor-default transition-all ${activeTabId === tab.id ? 'bg-[#f0f4f9] dark:bg-[#2d2d2d] text-gray-900 dark:text-white z-10 shadow-[0_-1px_4px_rgba(0,0,0,0.1)]' : 'bg-[#e0e0e0] dark:bg-[#252526] text-gray-600 dark:text-gray-400 hover:bg-[#e8e8e8] dark:hover:bg-[#2a2a2a]'}`}>
                      {tab.history[tab.historyIndex][tab.history.length-1] === RECENTS_ID ? <ICONS.Clock size={14} className="text-blue-500" /> : <ICONS.Folder size={14} className={activeTabId === tab.id ? "text-yellow-500" : "text-gray-400"} fill={activeTabId === tab.id ? "currentColor" : "none"} />}
                      <span className="flex-1 truncate">{tabTitle}</span>
                      <button onClick={(e) => handleCloseTab(e, tab.id)} className={`p-0.5 rounded-full hover:bg-gray-300 dark:hover:bg-white/20 transition-opacity ${tabs.length === 1 ? 'hidden' : 'opacity-0 group-hover:opacity-100'}`}><X size={10} /></button>
                      {activeTabId !== tab.id && <div className="absolute right-0 top-2 bottom-2 w-[1px] bg-gray-400/30"></div>}
                  </div>
              );
          })}
          <button onClick={handleNewTab} className="w-8 h-[30px] flex items-center justify-center hover:bg-white/40 dark:hover:bg-white/10 rounded-t-md transition-colors text-gray-600 dark:text-gray-400"><Plus size={14} /></button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col border-b border-gray-200 dark:border-gray-700 bg-[#f0f4f9] dark:bg-[#2d2d2d]">
        <div className="flex items-center gap-1 px-2 py-1.5 relative" onContextMenu={handleToolbarContextMenu}>
          {visibleToolbarItems.includes('newFolder') && <button onClick={createNewFolder} disabled={currentPath[currentPath.length-1] === RECENTS_ID} className="flex flex-col items-center gap-1 px-3 py-2 hover:bg-white dark:hover:bg-white/10 rounded-md transition-colors text-xs text-gray-700 dark:text-gray-300 disabled:opacity-30"><ICONS.Folder size={20} className="text-yellow-500" fill="currentColor" /> <span>New Folder</span></button>}
          {visibleToolbarItems.includes('newFile') && <button onClick={createNewFile} disabled={currentPath[currentPath.length-1] === RECENTS_ID} className="flex flex-col items-center gap-1 px-3 py-2 hover:bg-white dark:hover:bg-white/10 rounded-md transition-colors text-xs text-gray-700 dark:text-gray-300 disabled:opacity-30"><ICONS.FileText size={20} className="text-blue-500" /> <span>New File</span></button>}
          {(visibleToolbarItems.includes('newFolder') || visibleToolbarItems.includes('newFile')) && (visibleToolbarItems.length > 2) && <div className="w-[1px] h-8 bg-gray-300 dark:bg-gray-600 mx-1"></div>}
          {visibleToolbarItems.includes('cut') && <button disabled={!selectedItem} onClick={() => handleCut()} className="flex flex-col items-center gap-1 px-3 py-2 hover:bg-white dark:hover:bg-white/10 rounded-md transition-colors text-xs text-gray-700 dark:text-gray-300 disabled:opacity-30 disabled:hover:bg-transparent"><ICONS.Scissors size={20} /> <span>Cut</span></button>}
          {visibleToolbarItems.includes('copy') && <button disabled={!selectedItem} onClick={() => handleCopy()} className="flex flex-col items-center gap-1 px-3 py-2 hover:bg-white dark:hover:bg-white/10 rounded-md transition-colors text-xs text-gray-700 dark:text-gray-300 disabled:opacity-30 disabled:hover:bg-transparent"><ICONS.Copy size={20} /> <span>Copy</span></button>}
          {visibleToolbarItems.includes('paste') && <button disabled={!clipboard || currentPath[currentPath.length-1] === RECENTS_ID} onClick={handlePaste} className={`flex flex-col items-center gap-1 px-3 py-2 rounded-md transition-colors text-xs ${!clipboard ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-white/10'} disabled:opacity-30 disabled:hover:bg-transparent ${clipboard ? 'animate-pulse' : ''}`}><ICONS.Clipboard size={20} /> <span>Paste</span></button>}
          {visibleToolbarItems.includes('rename') && <button disabled={!selectedItem} onClick={handleStartRename} className="flex flex-col items-center gap-1 px-3 py-2 hover:bg-white dark:hover:bg-white/10 rounded-md transition-colors text-xs text-gray-700 dark:text-gray-300 disabled:opacity-30 disabled:hover:bg-transparent"><ICONS.Edit size={20} /> <span>Rename</span></button>}
          {visibleToolbarItems.includes('delete') && <button disabled={!selectedItem} onClick={() => handleDelete()} className="flex flex-col items-center gap-1 px-3 py-2 hover:bg-white dark:hover:bg-white/10 rounded-md transition-colors text-xs text-gray-700 dark:text-gray-300 disabled:opacity-30 disabled:hover:bg-transparent"><ICONS.Trash2 size={20} /> <span>Delete</span></button>}
          {visibleToolbarItems.includes('properties') && <button disabled={!selectedItem && !currentFolder} onClick={handleProperties} className="flex flex-col items-center gap-1 px-3 py-2 hover:bg-white dark:hover:bg-white/10 rounded-md transition-colors text-xs text-gray-700 dark:text-gray-300 disabled:opacity-30 disabled:hover:bg-transparent"><ICONS.Info size={20} /> <span>Properties</span></button>}
          
          {visibleToolbarItems.includes('sort') && (
              <div className="relative">
                <button onClick={(e) => { e.stopPropagation(); setShowSortMenu(!showSortMenu); }} className="flex flex-col items-center gap-1 px-3 py-2 hover:bg-white dark:hover:bg-white/10 rounded-md transition-colors text-xs text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-1"><ArrowUp size={14} className="text-gray-500" /><ArrowDown size={14} className="text-gray-500 -ml-1" /></div><span>Sort</span>
                </button>
                {showSortMenu && (
                  <div ref={sortMenuRef} className="absolute top-full left-0 mt-1 w-48 bg-[#f9f9f9]/95 dark:bg-[#1c1c1e]/95 backdrop-blur-xl rounded-lg shadow-2xl border border-gray-200/50 p-1 animate-in fade-in zoom-in-95 duration-100 z-50" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => handleSort('name')} className="w-full text-left flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-blue-600 hover:text-white rounded transition-colors"><span>Name</span>{sortConfig.key === 'name' && renderSortIcon('name')}</button>
                      <button onClick={() => handleSort('date')} className="w-full text-left flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-blue-600 hover:text-white rounded transition-colors"><span>Date modified</span>{sortConfig.key === 'date' && renderSortIcon('date')}</button>
                      <button onClick={() => handleSort('type')} className="w-full text-left flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-blue-600 hover:text-white rounded transition-colors"><span>Type</span>{sortConfig.key === 'type' && renderSortIcon('type')}</button>
                      <button onClick={() => handleSort('size')} className="w-full text-left flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-blue-600 hover:text-white rounded transition-colors"><span>Size</span>{sortConfig.key === 'size' && renderSortIcon('size')}</button>
                      <div className="h-[1px] bg-gray-300 my-1 mx-2"></div>
                      <button onClick={() => setSortConfig(prev => ({ ...prev, direction: 'asc' }))} className="w-full text-left flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-blue-600 hover:text-white rounded transition-colors"><span>Ascending</span>{sortConfig.direction === 'asc' && <div className="w-2 h-2 rounded-full bg-black/50 dark:bg-white/50"></div>}</button>
                      <button onClick={() => setSortConfig(prev => ({ ...prev, direction: 'desc' }))} className="w-full text-left flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-blue-600 hover:text-white rounded transition-colors"><span>Descending</span>{sortConfig.direction === 'desc' && <div className="w-2 h-2 rounded-full bg-black/50 dark:bg-white/50"></div>}</button>
                  </div>
                )}
              </div>
          )}
          
          {currentFolder?.id === RECYCLE_BIN_ID && (
              <>
                  <div className="w-[1px] h-8 bg-gray-300 mx-1"></div>
                  <button onClick={handleEmptyRecycleBin} className="flex flex-col items-center gap-1 px-3 py-2 hover:bg-white rounded-md transition-colors text-xs text-red-600 hover:text-red-700"><ICONS.Trash2 size={20} /><span>Empty Recycle Bin</span></button>
              </>
          )}
          <button onClick={(e) => { e.stopPropagation(); const rect = e.currentTarget.getBoundingClientRect(); setToolbarMenu({ x: rect.left, y: rect.bottom + 5 }); }} className="flex flex-col items-center gap-1 px-3 py-2 hover:bg-white dark:hover:bg-white/10 rounded-md transition-colors text-xs text-gray-700 dark:text-gray-300 ml-1" title="Customize Toolbar"><ICONS.MoreHorizontal size={20} /><span>More</span></button>
          <div className="flex-1"></div>
          {visibleToolbarItems.includes('view') && (
              <div className="relative">
                  <button onClick={(e) => { e.stopPropagation(); setShowViewMenu(!showViewMenu); }} className="flex flex-col items-center gap-1 px-3 py-2 hover:bg-white dark:hover:bg-white/10 rounded-md transition-colors text-xs text-gray-700 dark:text-gray-300 relative"><ICONS.Eye size={20} /><span className="flex items-center gap-0.5">View <ChevronRight size={10} className="rotate-90" /></span></button>
                  {showViewMenu && (
                      <div ref={viewMenuRef} className="absolute right-0 top-full mt-1 w-48 bg-[#f9f9f9]/95 dark:bg-[#1c1c1e]/95 backdrop-blur-xl rounded-lg shadow-2xl border border-gray-200/50 p-1 animate-in fade-in zoom-in-95 duration-100 z-50">
                          <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Layout</div>
                          <button onClick={() => setViewMode('list')} className="w-full text-left flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-blue-600 hover:text-white rounded transition-colors"><div className="flex items-center gap-3"><ICONS.List size={16} /> List</div>{viewMode === 'list' && <ICONS.Check size={14} />}</button>
                          <button onClick={() => setViewMode('grid')} className="w-full text-left flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-blue-600 hover:text-white rounded transition-colors"><div className="flex items-center gap-3"><ICONS.Grid size={16} /> Grid</div>{viewMode === 'grid' && <ICONS.Check size={14} />}</button>
                          <div className="h-[1px] bg-gray-300 my-1 mx-2"></div>
                          <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Icons</div>
                          {['small', 'medium', 'large', 'extra'].map((s) => (
                              <button key={s} onClick={() => setIconSize(s as IconSize)} className="w-full text-left flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-blue-600 hover:text-white rounded transition-colors">
                                  <span className="capitalize">{s} Icons</span>{iconSize === s && <ICONS.Check size={14} />}
                              </button>
                          ))}
                      </div>
                  )}
              </div>
          )}
        </div>

        {/* Address Bar Row */}
        <div className="flex items-center gap-3 px-3 py-2 bg-white dark:bg-[#252526] border-t border-gray-100 dark:border-gray-700">
             <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                <button onClick={handleGoBack} disabled={historyIndex <= 0} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-30 transition-colors"><ArrowLeft size={16} /></button>
                <button onClick={handleGoForward} disabled={historyIndex >= history.length - 1} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-30 transition-colors"><ArrowRightIcon size={16} /></button>
                <button onClick={handleGoUp} disabled={currentPath.length <= 1} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 disabled:opacity-30 transition-colors"><ArrowUp size={16} /></button>
             </div>
             <div className="flex-1 flex items-center px-3 py-1.5 bg-gray-100 dark:bg-[#333] border border-transparent focus-within:border-blue-500 focus-within:bg-white dark:focus-within:bg-black/20 rounded-md text-sm text-gray-600 dark:text-gray-300 shadow-inner transition-all">
                 <ICONS.Monitor size={14} className="mr-2 text-gray-500" />
                 <span>{currentPath[currentPath.length-1] === RECENTS_ID ? 'Recents' : 'This PC'}</span>
                 {currentPath.slice(1).map((seg, i) => (
                     <React.Fragment key={i}>
                         <span className="mx-2 text-gray-400"><ChevronRight size={12} /></span>
                         <span className="cursor-pointer hover:underline" onClick={() => navigate(currentPath.slice(0, i + 2))}>
                             {seg === RECENTS_ID ? 'Recents' : getRecursiveNode(fileSystem, seg)?.name || seg}
                         </span>
                     </React.Fragment>
                 ))}
             </div>
             <div className="w-48 flex items-center px-3 py-1.5 bg-gray-100 dark:bg-[#333] rounded-md text-sm text-gray-500 focus-within:bg-white dark:focus-within:bg-black/20 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all border border-transparent">
                 <ICONS.Search size={14} className="mr-2 text-gray-400" />
                 <input type="text" placeholder="Search" className="bg-transparent border-none outline-none w-full placeholder-gray-400 text-gray-700 dark:text-gray-200 text-sm h-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
             </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <div className="w-56 bg-white dark:bg-[#252526] border-r border-gray-200 dark:border-gray-700 flex flex-col py-2 overflow-y-auto text-gray-700 dark:text-gray-300">
             <div className="px-4 pt-2 pb-1 text-xs font-semibold text-gray-500 dark:text-gray-400">Quick Access</div>
             <button onClick={() => handleNavigate(RECENTS_ID)} className={`flex items-center gap-3 px-4 py-1.5 transition-colors text-sm group border-l-2 ${currentPath[currentPath.length-1] === RECENTS_ID ? 'bg-gray-100 dark:bg-white/10 border-blue-500' : 'hover:bg-gray-100 dark:hover:bg-white/5 border-transparent hover:border-blue-500'}`}>
                 <ICONS.Clock size={16} className="text-blue-500" /> Recents
             </button>
             {['Desktop', 'Documents', 'Downloads', 'Pictures', 'Music'].map(item => (
                 <button key={item} onClick={() => { const path = getQuickAccessPath(item); if(path) navigate(path); }} className="flex items-center gap-3 px-4 py-1.5 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-sm group border-l-2 border-transparent hover:border-blue-500">
                     <ICONS.Folder size={16} className="text-yellow-500" /> {item}
                 </button>
             ))}
             
             <div className="my-2 border-t border-gray-100 mx-4"></div>
          
             <div className="px-4 pt-2 pb-1 text-xs font-semibold text-gray-500 dark:text-gray-400">Locations</div>
             <button onClick={() => handleSidebarClick(['root'])} className="flex items-center gap-3 px-4 py-1.5 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-sm group border-l-2 border-transparent hover:border-blue-500">
                <ICONS.HardDrive size={16} className="text-gray-500 dark:text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white">Local Disk (C:)</span>
             </button>
             {fileSystem[0].children?.filter(child => child.id === 'usb' || child.name.includes('Drive')).map(drive => (
                <button key={drive.id} onClick={() => handleSidebarClick(['root', drive.id])} className="flex items-center gap-3 px-4 py-1.5 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-sm group border-l-2 border-transparent hover:border-blue-500">
                    <ICONS.HardDrive size={16} className="text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white">{drive.name}</span>
                </button>
             ))}
             <button onClick={() => handleSidebarClick(['root', RECYCLE_BIN_ID])} className="flex items-center gap-3 px-4 py-1.5 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-sm group border-l-2 border-transparent hover:border-blue-500">
                <ICONS.Trash2 size={16} className="text-gray-500 dark:text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white">Recycle Bin</span>
             </button>
        </div>

        {/* File Grid/List */}
        <div className="flex-1 bg-white dark:bg-[#1e1e1e] overflow-y-auto p-2">
            {/* Context Header for Recents */}
            {currentPath[currentPath.length-1] === RECENTS_ID && (
                 <div className="px-4 py-2 mb-2 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center animate-in fade-in slide-in-from-top-1">
                     <span className="text-lg font-medium">Recent Files</span>
                     <button className="text-xs text-blue-600 hover:underline">Clear recent history</button>
                 </div>
            )}

             {/* List Headers */}
             {viewMode === 'list' && (
                 <div className="grid grid-cols-12 px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800 mb-1 select-none">
                    <div className="col-span-6 pl-2 hover:bg-gray-100 cursor-pointer flex items-center gap-1 rounded py-1" onClick={() => handleSort('name')}>Name {renderSortIcon('name')}</div>
                    <div className="col-span-3 hover:bg-gray-100 cursor-pointer flex items-center gap-1 rounded py-1" onClick={() => handleSort('date')}>{searchTerm ? "Location" : "Date Modified"} {renderSortIcon('date')}</div>
                    <div className="col-span-2 hover:bg-gray-100 cursor-pointer flex items-center gap-1 rounded py-1" onClick={() => handleSort('type')}>Type {renderSortIcon('type')}</div>
                    <div className="col-span-1 text-right hover:bg-gray-100 cursor-pointer flex items-center justify-end gap-1 rounded py-1" onClick={() => handleSort('size')}>Size {renderSortIcon('size')}</div>
                 </div>
             )}
             {/* Content */}
             <div className={viewMode === 'grid' ? 'grid gap-1' : 'flex flex-col gap-0.5'} style={viewMode === 'grid' ? { gridTemplateColumns: `repeat(auto-fill, minmax(${sizeConfig.gridMin}px, 1fr))` } : {}}>
                {displayedChildren.map(node => {
                    const isSelected = selectedItem === node.id;
                    const isDragOver = dragOverId === node.id;
                    const isCut = clipboard?.id === node.id && clipboard.action === 'cut';
                    const isDragged = draggedItemId === node.id;

                    return (
                        <div 
                           key={node.id}
                           draggable
                           onMouseEnter={(e) => handleMouseEnterItem(e, node)}
                           onMouseLeave={handleMouseLeaveItem}
                           onDragStart={(e) => handleDragStart(e, node)}
                           onDragOver={(e) => handleDragOver(e, node.id, node.type === 'folder')}
                           onDragLeave={handleDragLeave}
                           onDrop={(e) => handleDrop(e, node.id)}
                           onClick={(e) => { e.stopPropagation(); setSelectedItem(node.id); }}
                           onDoubleClick={(e) => { e.stopPropagation(); handleNavigate(node.id); }}
                           onContextMenu={(e) => handleContextMenu(e, node.id)}
                           className={`
                              relative group rounded-sm cursor-pointer border transition-all duration-200
                              ${isSelected ? 'bg-blue-100/50 dark:bg-blue-500/30 border-blue-200 dark:border-blue-500/50' : isDragOver ? 'bg-blue-100 border-blue-500 ring-2 ring-blue-500/20' : 'border-transparent hover:bg-gray-50 dark:hover:bg-white/5'}
                              ${viewMode === 'grid' ? 'flex flex-col items-center gap-1 p-3' : 'grid grid-cols-12 items-center px-4 py-1.5'}
                              ${isDragged ? 'opacity-50 scale-95 grayscale filter' : (isCut ? 'opacity-40 grayscale' : 'opacity-100')}
                           `}
                        >
                            {/* Drop Overlay */}
                             {isDragOver && node.type === 'folder' && (
                                 <div className="absolute inset-0 bg-blue-500/10 z-20 flex items-center justify-center backdrop-blur-[1px] animate-in fade-in duration-200 rounded-sm pointer-events-none">
                                     <div className="bg-white/90 shadow-lg text-blue-600 px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 transform scale-100 animate-in zoom-in duration-200 border border-blue-100">Move Here</div>
                                 </div>
                             )}

                            <div className={viewMode === 'grid' ? 'w-full flex justify-center' : 'col-span-6 flex items-center gap-2'}>
                                {getFileIcon(node, viewMode === 'grid' ? sizeConfig.icon : 20)}
                                <span className={`truncate text-gray-700 dark:text-gray-300 ${viewMode === 'grid' ? 'w-full text-center mt-1 text-xs' : 'flex-1 text-sm'}`}>{node.name}</span>
                            </div>
                            {viewMode === 'list' && (
                                <>
                                   <div className="col-span-3 text-xs text-gray-500 dark:text-gray-400">{formatDate(node.dateModified)}</div>
                                   <div className="col-span-2 text-xs text-gray-500 dark:text-gray-400">{node.type}</div>
                                   <div className="col-span-1 text-xs text-gray-500 dark:text-gray-400 text-right">{formatSize(node)}</div>
                                </>
                            )}
                        </div>
                    );
                })}
             </div>
             {displayedChildren.length === 0 && (
                <div className="flex flex-col items-center justify-center text-gray-400 py-20 opacity-60 select-none">
                    {searchTerm ? (
                        <>
                          <ICONS.Search size={48} className="mb-4 opacity-50" />
                          <span className="text-sm">No items found for "{searchTerm}"</span>
                        </>
                    ) : (
                        <span className="text-sm">This folder is empty.</span>
                    )}
                </div>
             )}
        </div>
        {/* Preview Pane */}
        {selectedItem && (
            <div className="w-64 bg-white dark:bg-[#252526] border-l border-gray-200 dark:border-gray-700 p-4 flex flex-col">
                <div className="text-center py-4">
                     {(() => {
                         const node = getRecursiveNode(fileSystem, selectedItem);
                         if(!node) return null;
                         const isImage = node.type === 'file' && node.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);
                         const isText = node.type === 'file' && isTextFile(node.id);
                         return (
                             <div className="flex flex-col h-full">
                                 <div className="flex justify-center mb-4 py-4 border-b border-gray-100 dark:border-gray-700">
                                     {isImage && node.content ? <div className="w-full aspect-video bg-gray-100 dark:bg-black/20 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-700"><img src={node.content} alt={node.name} className="max-w-full max-h-full object-contain" /></div> : getFileIcon(node, 80)}
                                 </div>
                                 <div className="mb-6"><div className="font-semibold text-lg break-all text-gray-800 dark:text-gray-100 mb-1">{node.name}</div><div className="text-xs text-gray-500 dark:text-gray-400">{node.type === 'folder' ? 'File folder' : `${node.name.split('.').pop()?.toUpperCase() || 'FILE'} File`}</div></div>
                                 <div className="space-y-3 mb-6">
                                     <div className="grid grid-cols-[80px_1fr] gap-2 text-xs"><span className="text-gray-500 dark:text-gray-400">Size</span><span className="text-gray-700 dark:text-gray-300 font-medium">{node.type === 'folder' ? formatBytes(calculateFolderSize(node)) : node.size || '0 KB'}</span></div>
                                     <div className="grid grid-cols-[80px_1fr] gap-2 text-xs"><span className="text-gray-500 dark:text-gray-400">Date modified</span><span className="text-gray-700 dark:text-gray-300">{formatDate(node.dateModified)}</span></div>
                                 </div>
                                 {isText && <div className="flex-1 flex flex-col min-h-0"><div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Preview</div><div className="flex-1 bg-gray-50 dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-md p-3 text-left overflow-hidden shadow-inner"><pre className="text-[10px] font-mono text-gray-600 dark:text-gray-300 whitespace-pre-wrap h-full overflow-y-auto custom-scrollbar selection:bg-blue-200 dark:selection:bg-blue-800"><SyntaxHighlight content={node.content || ''} extension={node.name.split('.').pop() || ''} /></pre></div></div>}
                             </div>
                         );
                     })()}
                </div>
            </div>
        )}
      </div>

      {/* Other Modals */}
      {renderPropertiesModal()}
      {renderOperationModal()}
      {renderOpenWithModal()}
      {toast && <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800/90 backdrop-blur text-white px-4 py-2 rounded-full shadow-lg text-xs font-medium animate-in slide-in-from-bottom-2 fade-in duration-300 z-50">{toast}</div>}
      
      {/* Toolbar Menu */}
      {toolbarMenu && (
        <div ref={toolbarMenuRef} className="fixed z-[10000] w-56 bg-[#f9f9f9]/95 dark:bg-[#1c1c1e]/95 backdrop-blur-xl rounded-lg shadow-2xl border border-gray-200/50 p-2 animate-in fade-in zoom-in-95 duration-100 flex flex-col gap-1" style={{ left: toolbarMenu.x, top: toolbarMenu.y }} onClick={(e) => e.stopPropagation()}>
            <div className="px-2 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Customize Toolbar</div>
            {TOOLBAR_OPTIONS.map(opt => (
                <button key={opt.id} onClick={() => toggleToolbarItem(opt.id)} className="w-full text-left flex items-center justify-between px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 hover:bg-blue-500 hover:text-white rounded-md transition-colors"><span>{opt.label}</span>{visibleToolbarItems.includes(opt.id) && <ICONS.Check size={12} />}</button>
            ))}
            <div className="h-[1px] bg-gray-200 dark:bg-gray-700 my-1"></div>
            <button onClick={() => { setVisibleToolbarItems(['newFolder', 'newFile', 'cut', 'copy', 'paste', 'rename', 'delete', 'properties', 'sort', 'view']); setToolbarMenu(null); }} className="w-full text-left px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors">Reset to Defaults</button>
        </div>
      )}

      {/* Context Menu */}
      {contextMenu && (
        <div ref={contextMenuRef} className="fixed z-[9999] w-56 bg-[#f9f9f9]/95 backdrop-blur-xl rounded-lg shadow-2xl border border-gray-200/50 p-1 animate-in fade-in zoom-in-95 duration-100" style={{ left: contextMenu.x, top: contextMenu.y }}>
          {contextMenu.targetId ? (
             <>
                <button onClick={() => { handleNavigate(contextMenu.targetId!); setContextMenu(null); }} className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-600 hover:text-white rounded transition-colors"><ICONS.ExternalLink size={16} /> Open</button>
                {getRecursiveNode(fileSystem, contextMenu.targetId!)?.type === 'file' && (
                  <div className="relative group/submenu w-full">
                    <button className="w-full text-left flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-blue-600 hover:text-white rounded transition-colors"><div className="flex items-center gap-3"><ICONS.AppWindow size={16} /> Open With</div><ChevronRight size={14} /></button>
                    <div className="absolute left-full top-0 w-56 bg-[#f9f9f9]/95 backdrop-blur-xl rounded-lg shadow-2xl border border-gray-200/50 p-1 hidden group-hover/submenu:block animate-in fade-in zoom-in-95 duration-100 -ml-1">
                        <button onClick={() => handleOpenWith('notepad')} className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-600 hover:text-white rounded transition-colors"><ICONS.FileText size={16} /> Notepad</button>
                        <button onClick={() => handleOpenWith('code')} className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-600 hover:text-white rounded transition-colors"><ICONS.Code2 size={16} /> VS Code</button>
                        <button onClick={() => handleOpenWith('browser')} className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-600 hover:text-white rounded transition-colors"><ICONS.Globe size={16} /> Browser</button>
                        <div className="h-[1px] bg-gray-300 my-1 mx-2"></div>
                        <button onClick={handleOpenWithDialog} className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-600 hover:text-white rounded transition-colors"><ICONS.AppWindow size={16} /> Choose another app...</button>
                    </div>
                  </div>
                )}
                <div className="h-[1px] bg-gray-300 my-1 mx-2"></div>
                <button onClick={() => handleCut(contextMenu.targetId!)} className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-600 hover:text-white rounded transition-colors"><ICONS.Scissors size={16} /> Cut</button>
                <button onClick={() => handleCopy(contextMenu.targetId!)} className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-600 hover:text-white rounded transition-colors"><ICONS.Copy size={16} /> Copy</button>
                <button onClick={handleStartRename} className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-600 hover:text-white rounded transition-colors"><ICONS.Edit size={16} /> Rename</button>
                <button onClick={handleProperties} className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-600 hover:text-white rounded transition-colors"><ICONS.Info size={16} /> Properties</button>
                <div className="h-[1px] bg-gray-300 my-1 mx-2"></div>
                <button onClick={() => handleDelete(contextMenu.targetId!)} className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-600 hover:text-white rounded transition-colors"><ICONS.Trash2 size={16} /> Delete</button>
             </>
          ) : (
             <>
                <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">View</div>
                <button onClick={() => setIconSize('extra')} className="w-full text-left flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-blue-600 hover:text-white rounded transition-colors"><span>Extra Large Icons</span>{iconSize === 'extra' && <ICONS.Check size={14} />}</button>
                <button onClick={() => setIconSize('medium')} className="w-full text-left flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-blue-600 hover:text-white rounded transition-colors"><span>Medium Icons</span>{iconSize === 'medium' && <ICONS.Check size={14} />}</button>
                <button onClick={() => setIconSize('small')} className="w-full text-left flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-blue-600 hover:text-white rounded transition-colors"><span>Small Icons</span>{iconSize === 'small' && <ICONS.Check size={14} />}</button>
                <div className="h-[1px] bg-gray-300 my-1 mx-2"></div>
                <button disabled={!clipboard} onClick={handlePaste} className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-600 hover:text-white rounded transition-colors disabled:opacity-50"><ICONS.Clipboard size={16} /> Paste</button>
                <div className="h-[1px] bg-gray-300 my-1 mx-2"></div>
                <button onClick={createNewFolder} className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-600 hover:text-white rounded transition-colors"><ICONS.Folder size={16} className="text-yellow-500" fill="currentColor" /> New Folder</button>
                <button onClick={createNewFile} className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-600 hover:text-white rounded transition-colors"><ICONS.FileText size={16} className="text-blue-500" /> New Text Document</button>
                <div className="h-[1px] bg-gray-300 my-1 mx-2"></div>
                <button onClick={handleProperties} className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-600 hover:text-white rounded transition-colors"><ICONS.Info size={16} /> Properties</button>
             </>
          )}
        </div>
      )}
    </div>
  );
};

export default FileExplorerApp;
