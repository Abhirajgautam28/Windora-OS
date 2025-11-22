
import React, { useState, useEffect, useRef } from 'react';
import { AppConfig, WindowState, FileSystemNode, WidgetData, OSNotification } from './types';
import { ICONS, WALLPAPER_URLS, INITIAL_FILES } from './constants';
import Window from './components/Window';
import TrialOverlay from './components/TrialOverlay';
import TerminalApp from './components/apps/TerminalApp';
import Installer from './components/Installer';
import StartMenu from './components/StartMenu';
import FileExplorerApp from './components/FileExplorerApp';
import LockScreen from './components/LockScreen';
import NotificationCenter from './components/NotificationCenter';
import CalendarWidget from './components/CalendarWidget';
import SystemTray from './components/SystemTray';
import ControlCenter from './components/ControlCenter';
import TaskbarPreview from './components/TaskbarPreview';
import SpotlightSearch from './components/SpotlightSearch';
import DesktopWidget from './components/DesktopWidget';
import DesktopShortcut from './components/DesktopShortcut';
import QuickLook from './components/QuickLook';
import RunDialog from './components/RunDialog';
import Screensaver from './components/Screensaver';
import BSOD from './components/BSOD';
import ClipboardHistory from './components/ClipboardHistory';
import { SystemSounds } from './services/soundService';

// Widgets
import WeatherWidget from './components/widgets/WeatherWidget';
import ClockWidget from './components/widgets/ClockWidget';
import NewsWidget from './components/widgets/NewsWidget';
import SystemInfoWidget from './components/widgets/SystemInfoWidget';

// Apps
import CalculatorApp from './components/apps/CalculatorApp';
import SystemMonitorApp from './components/apps/SystemMonitorApp';
import AppStoreApp from './components/apps/AppStoreApp';
import SettingsApp from './components/apps/SettingsApp';
import VSCodeApp from './components/apps/VSCodeApp';
import ImageViewerApp from './components/apps/ImageViewerApp';
import TextEditorApp from './components/apps/TextEditorApp';
import MusicApp from './components/apps/MusicApp';
import CameraApp from './components/apps/CameraApp';
import ChromeApp from './components/apps/ChromeApp';
import PaintApp from './components/apps/PaintApp';
import VideoPlayerApp from './components/apps/VideoPlayerApp';
import StickyNotesApp from './components/apps/StickyNotesApp';
import VoiceRecorderApp from './components/apps/VoiceRecorderApp';
import ClockApp from './components/apps/ClockApp';
import MailApp from './components/apps/MailApp';
import TasksApp from './components/apps/TasksApp';
import WeatherApp from './components/apps/WeatherApp';
import ContactsApp from './components/apps/ContactsApp';
import AssistantApp from './components/apps/AssistantApp';
import SheetsApp from './components/apps/SheetsApp';
import MapsApp from './components/apps/MapsApp';
import MinesweeperApp from './components/apps/MinesweeperApp';
import PDFViewerApp from './components/apps/PDFViewerApp';
import SnakeApp from './components/apps/SnakeApp';
import ScreenRecorderApp from './components/apps/ScreenRecorderApp';
import TicTacToeApp from './components/apps/TicTacToeApp';
import Game2048App from './components/apps/Game2048App';
import DiskCleanupApp from './components/apps/DiskCleanupApp';
import WordApp from './components/apps/WordApp';
import SystemInfoApp from './components/apps/SystemInfoApp';
import SolitaireApp from './components/apps/SolitaireApp';

// --- Application Registry ---
const APPS: AppConfig[] = [
  { id: 'files', name: 'Explorer', icon: ICONS.FolderOpen, defaultWidth: 900, defaultHeight: 600, component: FileExplorerApp, color: 'bg-blue-500' }, 
  { id: 'browser', name: 'Chrome', icon: ICONS.Chrome, defaultWidth: 1000, defaultHeight: 700, component: ChromeApp, color: 'bg-white text-blue-500' },
  { id: 'store', name: 'Store', icon: ICONS.ShoppingBag, defaultWidth: 900, defaultHeight: 650, component: AppStoreApp, color: 'bg-indigo-500' },
  { id: 'assistant', name: 'Assistant', icon: ICONS.Bot, defaultWidth: 400, defaultHeight: 600, component: AssistantApp, color: 'bg-gradient-to-br from-purple-500 to-pink-500' },
  { id: 'code', name: 'VS Code', icon: ICONS.Code2, defaultWidth: 1000, defaultHeight: 700, component: VSCodeApp, color: 'bg-blue-600' },
  { id: 'terminal', name: 'Terminal', icon: ICONS.Terminal, defaultWidth: 800, defaultHeight: 500, component: TerminalApp, color: 'bg-gray-900' },
  { id: 'word', name: 'Word', icon: ICONS.FileText, defaultWidth: 900, defaultHeight: 700, component: WordApp, color: 'bg-blue-700' },
  { id: 'calculator', name: 'Calculator', icon: ICONS.Calculator, defaultWidth: 320, defaultHeight: 480, component: CalculatorApp, color: 'bg-orange-500' },
  { id: 'mail', name: 'Mail', icon: ICONS.Mail, defaultWidth: 950, defaultHeight: 650, component: MailApp, color: 'bg-blue-400' },
  { id: 'tasks', name: 'Tasks', icon: ICONS.CheckSquare, defaultWidth: 800, defaultHeight: 600, component: TasksApp, color: 'bg-green-500' },
  { id: 'sheets', name: 'Sheets', icon: ICONS.Table, defaultWidth: 1000, defaultHeight: 700, component: SheetsApp, color: 'bg-green-600' },
  { id: 'maps', name: 'Maps', icon: ICONS.Map, defaultWidth: 900, defaultHeight: 650, component: MapsApp, color: 'bg-purple-500' },
  { id: 'monitor', name: 'Monitor', icon: ICONS.Activity, defaultWidth: 700, defaultHeight: 500, component: SystemMonitorApp, color: 'bg-green-600' },
  { id: 'settings', name: 'Settings', icon: ICONS.Settings, defaultWidth: 800, defaultHeight: 600, component: SettingsApp, color: 'bg-gray-600' },
  { id: 'sysinfo', name: 'System Info', icon: ICONS.Info, defaultWidth: 500, defaultHeight: 400, component: SystemInfoApp, color: 'bg-blue-500' },
  { id: 'notepad', name: 'Notepad', icon: ICONS.FileText, defaultWidth: 600, defaultHeight: 450, component: TextEditorApp, color: 'bg-gray-400' },
  { id: 'paint', name: 'Paint', icon: ICONS.Palette, defaultWidth: 800, defaultHeight: 600, component: PaintApp, color: 'bg-yellow-500' },
  { id: 'music', name: 'Music', icon: ICONS.Music, defaultWidth: 850, defaultHeight: 550, component: MusicApp, color: 'bg-pink-500' },
  { id: 'video', name: 'Video', icon: ICONS.Film, defaultWidth: 800, defaultHeight: 500, component: VideoPlayerApp, color: 'bg-red-600' },
  { id: 'camera', name: 'Camera', icon: ICONS.Camera, defaultWidth: 700, defaultHeight: 525, component: CameraApp, color: 'bg-gray-800' },
  { id: 'screen-recorder', name: 'Screen Recorder', icon: ICONS.CircleDot, defaultWidth: 400, defaultHeight: 300, component: ScreenRecorderApp, color: 'bg-red-600' },
  { id: 'viewer', name: 'Photos', icon: ICONS.ImageIcon, defaultWidth: 800, defaultHeight: 600, component: ImageViewerApp, color: 'bg-purple-600' },
  { id: 'notes', name: 'Notes', icon: ICONS.StickyNote, defaultWidth: 400, defaultHeight: 400, component: StickyNotesApp, color: 'bg-yellow-400' },
  { id: 'recorder', name: 'Recorder', icon: ICONS.Mic, defaultWidth: 600, defaultHeight: 400, component: VoiceRecorderApp, color: 'bg-red-500' },
  { id: 'clock', name: 'Clock', icon: ICONS.Clock, defaultWidth: 500, defaultHeight: 400, component: ClockApp, color: 'bg-blue-400' },
  { id: 'weather', name: 'Weather', icon: ICONS.CloudSun, defaultWidth: 700, defaultHeight: 500, component: WeatherApp, color: 'bg-blue-400' },
  { id: 'contacts', name: 'Contacts', icon: ICONS.Users, defaultWidth: 800, defaultHeight: 600, component: ContactsApp, color: 'bg-orange-600' },
  { id: 'minesweeper', name: 'Minesweeper', icon: ICONS.Bomb, defaultWidth: 400, defaultHeight: 500, component: MinesweeperApp, color: 'bg-gray-500' },
  { id: 'tictactoe', name: 'Tic Tac Toe', icon: ICONS.Gamepad2, defaultWidth: 320, defaultHeight: 420, component: TicTacToeApp, color: 'bg-purple-500' },
  { id: '2048', name: '2048', icon: ICONS.Gamepad2, defaultWidth: 360, defaultHeight: 500, component: Game2048App, color: 'bg-yellow-600' },
  { id: 'solitaire', name: 'Solitaire', icon: ICONS.Gamepad2, defaultWidth: 800, defaultHeight: 600, component: SolitaireApp, color: 'bg-green-700' },
  { id: 'pdf', name: 'PDF Viewer', icon: ICONS.FileText, defaultWidth: 800, defaultHeight: 700, component: PDFViewerApp, color: 'bg-red-700' },
  { id: 'snake', name: 'Snake', icon: ICONS.Gamepad2, defaultWidth: 450, defaultHeight: 550, component: SnakeApp, color: 'bg-green-500' },
  { id: 'cleanup', name: 'Disk Cleanup', icon: ICONS.Brush, defaultWidth: 500, defaultHeight: 400, component: DiskCleanupApp, color: 'bg-gray-500' },
];

// Initial installed apps
const DEFAULT_INSTALLED_APPS = ['files', 'browser', 'store', 'settings', 'terminal', 'assistant', 'notepad', 'word', 'calculator', 'mail', 'tasks', 'sheets', 'maps', 'camera', 'screen-recorder', 'notes', 'recorder', 'clock', 'weather', 'contacts', 'minesweeper', 'tictactoe', 'solitaire', '2048', 'pdf', 'snake', 'cleanup', 'sysinfo', 'code', 'paint', 'music', 'video', 'viewer'];

export default function App() {
  const [isInstalled, setIsInstalled] = useState(() => localStorage.getItem('windora_is_installed') === 'true');
  const [isLocked, setIsLocked] = useState(true);
  const [isBSOD, setIsBSOD] = useState(false);
  
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [nextZIndex, setNextZIndex] = useState(10);
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const [notifications, setNotifications] = useState<OSNotification[]>([]);
  
  const [desktops, setDesktops] = useState<{id: number, name: string}[]>(() => {
      const saved = localStorage.getItem('windora_desktops');
      return saved ? JSON.parse(saved) : [{ id: 0, name: 'Desktop 1' }];
  });
  const [currentDesktopId, setCurrentDesktopId] = useState<number>(0);
  const [isTaskViewOpen, setIsTaskViewOpen] = useState(false);
  
  const [wallpaperIndex, setWallpaperIndex] = useState(() => {
      const saved = localStorage.getItem('windora_wallpaper_index');
      return saved ? parseInt(saved) : 0;
  });
  const [lockWallpaperIndex, setLockWallpaperIndex] = useState(() => {
      const saved = localStorage.getItem('windora_lock_wallpaper_index');
      return saved ? parseInt(saved) : 3;
  });
  
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('windora_dark_mode') === 'true');
  const [installedAppIds, setInstalledAppIds] = useState<string[]>(() => {
      const saved = localStorage.getItem('windora_installed_apps');
      return saved ? JSON.parse(saved) : DEFAULT_INSTALLED_APPS;
  });
  const [accentColor, setAccentColor] = useState(() => localStorage.getItem('windora_accent_color') || 'blue');
  
  const [isNightLight, setIsNightLight] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false); // Focus Mode State
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [isWidgetGalleryOpen, setIsWidgetGalleryOpen] = useState(false);
  const [isRunDialogOpen, setIsRunDialogOpen] = useState(false);
  const [isClipboardHistoryOpen, setIsClipboardHistoryOpen] = useState(false);
  const [clipboardHistory, setClipboardHistory] = useState<string[]>([]);
  const [globalClipboard, setGlobalClipboard] = useState<{id: string, action: 'copy'|'cut'} | null>(null); // For internal app ref

  const [quickLookNode, setQuickLookNode] = useState<FileSystemNode | null>(null);
  const [isScreensaverActive, setIsScreensaverActive] = useState(false);
  const idleTimerRef = useRef<any>(null);
  const [hoveredDockApp, setHoveredDockApp] = useState<string | null>(null);
  const dockHoverTimeoutRef = useRef<any>(null);
  
  const [fileSystem, setFileSystem] = useState<FileSystemNode[]>(INITIAL_FILES);
  const [desktopContextMenu, setDesktopContextMenu] = useState<{x: number, y: number} | null>(null);
  const [taskbarContextMenu, setTaskbarContextMenu] = useState<{x: number, y: number} | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const taskbarContextMenuRef = useRef<HTMLDivElement>(null);
  const [selectionBox, setSelectionBox] = useState<{ startX: number; startY: number; currentX: number; currentY: number; visible: boolean } | null>(null);
  const [widgets, setWidgets] = useState<WidgetData[]>([]);
  
  const [iconPositions, setIconPositions] = useState<Record<string, {x: number, y: number}>>(() => {
      const saved = localStorage.getItem('windora_icon_positions');
      return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => { localStorage.setItem('windora_is_installed', String(isInstalled)); }, [isInstalled]);
  useEffect(() => { localStorage.setItem('windora_wallpaper_index', String(wallpaperIndex)); }, [wallpaperIndex]);
  useEffect(() => { localStorage.setItem('windora_lock_wallpaper_index', String(lockWallpaperIndex)); }, [lockWallpaperIndex]);
  useEffect(() => { 
      localStorage.setItem('windora_dark_mode', String(isDarkMode));
      if (isDarkMode) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);
  useEffect(() => { 
      localStorage.setItem('windora_accent_color', accentColor);
      document.documentElement.style.setProperty('--accent-color', accentColor);
  }, [accentColor]);
  useEffect(() => { localStorage.setItem('windora_installed_apps', JSON.stringify(installedAppIds)); }, [installedAppIds]);
  useEffect(() => { localStorage.setItem('windora_desktops', JSON.stringify(desktops)); }, [desktops]);
  useEffect(() => { localStorage.setItem('windora_icon_positions', JSON.stringify(iconPositions)); }, [iconPositions]);

  // Idle Timer
  useEffect(() => {
      const resetIdle = () => {
          if (isScreensaverActive) setIsScreensaverActive(false);
          if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
          if (!isLocked && isInstalled && !isBSOD) {
              idleTimerRef.current = setTimeout(() => setIsScreensaverActive(true), 60000);
          }
      };
      window.addEventListener('mousemove', resetIdle);
      window.addEventListener('keydown', resetIdle);
      window.addEventListener('click', resetIdle);
      resetIdle();
      return () => {
          window.removeEventListener('mousemove', resetIdle);
          window.removeEventListener('keydown', resetIdle);
          window.removeEventListener('click', resetIdle);
          if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      };
  }, [isLocked, isInstalled, isScreensaverActive, isBSOD]);

  useEffect(() => {
      if (isInstalled && !isLocked && notifications.length === 0) {
          setTimeout(() => addNotification("Welcome to Windora OS", "System initialized successfully. Click to explore.", "system"), 2000);
      }
  }, [isInstalled, isLocked]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
       if (desktopContextMenu && contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) setDesktopContextMenu(null);
       if (taskbarContextMenu && taskbarContextMenuRef.current && !taskbarContextMenuRef.current.contains(e.target as Node)) setTaskbarContextMenu(null);
       if (isCalendarOpen && !(e.target as HTMLElement).closest('.system-tray-calendar')) setIsCalendarOpen(false);
       if (isStartOpen && !(e.target as HTMLElement).closest('.start-menu-trigger') && !(e.target as HTMLElement).closest('.start-menu-container')) setIsStartOpen(false);
       if (isControlCenterOpen && !(e.target as HTMLElement).closest('.system-tray-control')) setIsControlCenterOpen(false);
       if (isWidgetGalleryOpen && !(e.target as HTMLElement).closest('.widget-gallery')) setIsWidgetGalleryOpen(false);
       if (isTaskViewOpen && !(e.target as HTMLElement).closest('.task-view-container') && !(e.target as HTMLElement).closest('.task-view-trigger')) setIsTaskViewOpen(false);
       if (isClipboardHistoryOpen && !(e.target as HTMLElement).closest('.clipboard-history-container')) setIsClipboardHistoryOpen(false);
    };
    
    const handleGlobalKeys = (e: KeyboardEvent) => {
        if (e.altKey && e.code === 'Space') { e.preventDefault(); setIsSpotlightOpen(prev => !prev); }
        if (e.altKey && e.key.toLowerCase() === 'r') { e.preventDefault(); setIsRunDialogOpen(prev => !prev); }
        if (e.altKey && e.key.toLowerCase() === 'v') { e.preventDefault(); setIsClipboardHistoryOpen(prev => !prev); }
        if (e.key === 'Escape') {
            setQuickLookNode(null);
            setIsStartOpen(false);
            setIsCalendarOpen(false);
            setIsControlCenterOpen(false);
            setIsTaskViewOpen(false);
            setIsClipboardHistoryOpen(false);
        }
    };
    window.addEventListener('click', handleClickOutside);
    window.addEventListener('keydown', handleGlobalKeys);
    return () => {
        window.removeEventListener('click', handleClickOutside);
        window.removeEventListener('keydown', handleGlobalKeys);
    };
  }, [desktopContextMenu, taskbarContextMenu, isCalendarOpen, isWidgetGalleryOpen, quickLookNode, isStartOpen, isControlCenterOpen, isTaskViewOpen, isClipboardHistoryOpen]);

  const addNotification = (title: string, message: string, appId: string = 'system') => {
      setNotifications(prev => [{ id: Date.now().toString(), title, message, timestamp: new Date(), appId, read: false }, ...prev]);
      if (!isFocusMode) SystemSounds.playNotification();
  };
  const clearNotifications = () => setNotifications([]);
  const installApp = (appId: string) => {
      if (!installedAppIds.includes(appId)) {
          setInstalledAppIds(prev => [...prev, appId]);
          addNotification("App Installed", `${APPS.find(a => a.id === appId)?.name} is ready to use.`, "store");
      }
  };
  const uninstallApp = (appId: string) => {
      setInstalledAppIds(prev => prev.filter(id => id !== appId));
      setWindows(prev => prev.filter(w => w.appId !== appId));
      addNotification("App Uninstalled", "Application has been removed from the system.", "system");
  };
  const handleQuickLook = (node: FileSystemNode) => setQuickLookNode(node);

  // Clipboard Manager
  const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
      setClipboardHistory(prev => {
          const newHist = [text, ...prev.filter(item => item !== text)].slice(0, 20);
          return newHist;
      });
      addNotification("Clipboard", "Text copied to clipboard history", "system");
  };

  const renderAppContent = (appId: string, windowId: string, data?: any) => {
    const commonProps = { windowId, addNotification, accentColor, setAccentColor, isDarkMode, toggleTheme: () => setIsDarkMode(!isDarkMode) };
    switch(appId) {
      case 'files': return <FileExplorerApp {...commonProps} fileSystem={fileSystem} setFileSystem={setFileSystem} onOpenApp={openApp} apps={APPS.filter(a => installedAppIds.includes(a.id))} onQuickLook={handleQuickLook} />;
      case 'terminal': return <TerminalApp {...commonProps} fileSystem={fileSystem} setFileSystem={setFileSystem} onOpenApp={openApp} />;
      case 'browser': return <ChromeApp {...commonProps} />;
      case 'settings': return <SettingsApp {...commonProps} wallpaperIndex={wallpaperIndex} setWallpaperIndex={setWallpaperIndex} lockWallpaperIndex={lockWallpaperIndex} setLockWallpaperIndex={setLockWallpaperIndex} />;
      case 'store': return <AppStoreApp {...commonProps} apps={APPS} installedAppIds={installedAppIds} onInstallApp={installApp} onUninstallApp={uninstallApp} onOpenApp={openApp} />;
      case 'calculator': return <CalculatorApp {...commonProps} />;
      case 'monitor': return <SystemMonitorApp {...commonProps} />;
      case 'code': return <VSCodeApp {...commonProps} initialContent={data} fileSystem={fileSystem} setFileSystem={setFileSystem} />;
      case 'viewer': return <ImageViewerApp {...commonProps} initialContent={data} />;
      case 'notepad': return <TextEditorApp {...commonProps} initialContent={data} fileSystem={fileSystem} setFileSystem={setFileSystem} />;
      case 'word': return <WordApp {...commonProps} />;
      case 'sysinfo': return <SystemInfoApp {...commonProps} />;
      case 'paint': return <PaintApp {...commonProps} />;
      case 'music': return <MusicApp {...commonProps} />;
      case 'video': return <VideoPlayerApp {...commonProps} />;
      case 'camera': return <CameraApp {...commonProps} fileSystem={fileSystem} setFileSystem={setFileSystem} />;
      case 'screen-recorder': return <ScreenRecorderApp {...commonProps} fileSystem={fileSystem} setFileSystem={setFileSystem} />;
      case 'notes': return <StickyNotesApp {...commonProps} />;
      case 'recorder': return <VoiceRecorderApp {...commonProps} />;
      case 'clock': return <ClockApp {...commonProps} />;
      case 'mail': return <MailApp {...commonProps} />;
      case 'tasks': return <TasksApp {...commonProps} />;
      case 'weather': return <WeatherApp {...commonProps} />;
      case 'contacts': return <ContactsApp {...commonProps} />;
      case 'assistant': return <AssistantApp {...commonProps} />;
      case 'sheets': return <SheetsApp {...commonProps} />;
      case 'maps': return <MapsApp {...commonProps} />;
      case 'minesweeper': return <MinesweeperApp {...commonProps} />;
      case 'tictactoe': return <TicTacToeApp {...commonProps} />;
      case 'solitaire': return <SolitaireApp {...commonProps} />;
      case '2048': return <Game2048App {...commonProps} />;
      case 'cleanup': return <DiskCleanupApp {...commonProps} />;
      case 'pdf': return <PDFViewerApp {...commonProps} initialContent={data} />;
      case 'snake': return <SnakeApp {...commonProps} />;
      default: return <TextEditorApp {...commonProps} initialContent={data} fileSystem={fileSystem} setFileSystem={setFileSystem} />;
    }
  };

  const openApp = (appId: string, data?: any) => {
    if (appId === 'system:crash') { setIsBSOD(true); return; }
    if (!installedAppIds.includes(appId) && appId !== 'viewer') { if (appId !== 'viewer') return; }

    let actualAppId = appId;
    let title = "";
    let width = 800;
    let height = 600;

    const appConfig = APPS.find(a => a.id === appId);
    if (appConfig) {
        title = appConfig.name;
        width = appConfig.defaultWidth;
        height = appConfig.defaultHeight;
    } else {
        if (appId === 'viewer') { title = 'Photos'; width = 800; height = 600; actualAppId = 'viewer'; }
    }

    const newWindow: WindowState = {
      id: `${actualAppId}-${Date.now()}`,
      appId: actualAppId,
      title: title || 'Window',
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      isAlwaysOnTop: false,
      position: { x: 100 + (windows.length * 30), y: 80 + (windows.length * 30) },
      size: { width, height },
      zIndex: nextZIndex,
      desktopId: currentDesktopId,
      content: renderAppContent(actualAppId, `${actualAppId}-${Date.now()}`, data)
    };

    setWindows([...windows, newWindow]);
    setNextZIndex(prev => prev + 1);
    setIsStartOpen(false);
    SystemSounds.playWindowOpen();
  };
  
  // Window Management (Click, Drag, Resize) - largely same as before, just ensuring state integrity
  const handleDockClick = (appId: string) => {
      const runningWindows = windows.filter(w => w.appId === appId && w.desktopId === currentDesktopId);
      if (runningWindows.length > 0) {
          const activeWindow = runningWindows.sort((a, b) => b.zIndex - a.zIndex)[0];
          if (activeWindow.isMinimized) {
               setWindows(windows.map(w => w.id === activeWindow.id ? { ...w, isMinimized: false, zIndex: (w.isAlwaysOnTop ? 5000 : 10) + nextZIndex } : w));
               setNextZIndex(prev => prev + 1);
               SystemSounds.playWindowOpen();
          } else {
              const topMostGlobal = [...windows].filter(w => w.desktopId === currentDesktopId).sort((a, b) => b.zIndex - a.zIndex)[0];
              if (topMostGlobal.id === activeWindow.id) {
                  setWindows(windows.map(w => w.id === activeWindow.id ? { ...w, isMinimized: true } : w));
                  SystemSounds.playWindowClose();
              } else {
                  bringToFront(activeWindow.id);
              }
          }
      } else {
          openApp(appId);
      }
  };

  const handleDockEnter = (appId: string) => { if (dockHoverTimeoutRef.current) { clearTimeout(dockHoverTimeoutRef.current); dockHoverTimeoutRef.current = null; } setHoveredDockApp(appId); };
  const handleDockLeave = () => { dockHoverTimeoutRef.current = setTimeout(() => { setHoveredDockApp(null); }, 150); };
  const handlePreviewSelect = (windowId: string) => { const win = windows.find(w => w.id === windowId); if (win) { if (win.desktopId !== currentDesktopId) setCurrentDesktopId(win.desktopId); if (win.isMinimized) { setWindows(prev => prev.map(w => w.id === windowId ? { ...w, isMinimized: false, zIndex: (w.isAlwaysOnTop ? 5000 : 10) + nextZIndex } : w)); setNextZIndex(n => n + 1); SystemSounds.playWindowOpen(); } else { bringToFront(windowId); } } setIsStartOpen(false); setHoveredDockApp(null); if (dockHoverTimeoutRef.current) clearTimeout(dockHoverTimeoutRef.current); };
  const closeWindow = (id: string) => { setWindows(windows.filter(w => w.id !== id)); SystemSounds.playWindowClose(); };
  const toggleMinimize = (id: string) => { setWindows(windows.map(w => w.id === id ? { ...w, isMinimized: !w.isMinimized } : w)); SystemSounds.playWindowClose(); };
  const toggleMaximize = (id: string) => { setWindows(windows.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w)); bringToFront(id); };
  const bringToFront = (id: string) => { setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: (w.isAlwaysOnTop ? 5000 : 10) + nextZIndex } : w)); setNextZIndex(prev => prev + 1); };
  const toggleAlwaysOnTop = (id: string) => { setWindows(prev => prev.map(w => { if (w.id === id) { const isAlwaysOnTop = !w.isAlwaysOnTop; return { ...w, isAlwaysOnTop, zIndex: (isAlwaysOnTop ? 5000 : 10) + nextZIndex }; } return w; })); setNextZIndex(prev => prev + 1); };
  const updatePosition = (id: string, x: number, y: number) => { setWindows(windows.map(w => w.id === id ? { ...w, position: { x, y } } : w)); };
  const updateSize = (id: string, width: number, height: number) => { setWindows(windows.map(w => w.id === id ? { ...w, size: { width, height } } : w)); };
  const minimizeAll = () => { const hasOpen = windows.some(w => w.desktopId === currentDesktopId && !w.isMinimized); setWindows(prev => prev.map(w => w.desktopId === currentDesktopId ? { ...w, isMinimized: hasOpen } : w)); };
  const addDesktop = () => { const newId = Math.max(...desktops.map(d => d.id)) + 1; setDesktops([...desktops, { id: newId, name: `Desktop ${newId + 1}` }]); setCurrentDesktopId(newId); };
  const removeDesktop = (id: number, e: React.MouseEvent) => { e.stopPropagation(); if (desktops.length <= 1) return; const newDesktops = desktops.filter(d => d.id !== id); setDesktops(newDesktops); setWindows(prev => prev.map(w => w.desktopId === id ? { ...w, desktopId: newDesktops[0].id } : w)); if (currentDesktopId === id) setCurrentDesktopId(newDesktops[0].id); };

  const addWidget = (type: WidgetData['type']) => { setWidgets([...widgets, { id: `widget-${Date.now()}`, type, position: { x: 100 + (widgets.length * 20), y: 100 + (widgets.length * 20) } }]); setIsWidgetGalleryOpen(false); };
  const removeWidget = (id: string) => { setWidgets(widgets.filter(w => w.id !== id)); };
  const updateWidgetPosition = (id: string, x: number, y: number) => { setWidgets(widgets.map(w => w.id === id ? { ...w, position: { x, y } } : w)); };
  const updateIconPosition = (appId: string, x: number, y: number) => { setIconPositions(prev => ({ ...prev, [appId]: { x, y } })); };

  const handleDesktopMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).id === "desktop-area" || (e.target as HTMLElement).id === "desktop-container") {
        setIsStartOpen(false); setIsNotificationCenterOpen(false); setIsCalendarOpen(false); setIsWidgetGalleryOpen(false); setIsControlCenterOpen(false); setIsTaskViewOpen(false); setIsClipboardHistoryOpen(false);
        setSelectionBox({ startX: e.clientX, startY: e.clientY, currentX: e.clientX, currentY: e.clientY, visible: true });
    }
  };
  const handleDesktopMouseMove = (e: React.MouseEvent) => { if (selectionBox?.visible) setSelectionBox(prev => prev ? { ...prev, currentX: e.clientX, currentY: e.clientY } : null); };
  const handleDesktopMouseUp = () => setSelectionBox(null);
  const handleDesktopContextMenu = (e: React.MouseEvent) => { e.preventDefault(); setDesktopContextMenu({ x: e.clientX, y: e.clientY }); };
  const handleTaskbarContextMenu = (e: React.MouseEvent) => { e.preventDefault(); setTaskbarContextMenu({ x: e.clientX, y: e.clientY }); };
  const cycleWallpaper = () => { setWallpaperIndex((prev) => (prev + 1) % WALLPAPER_URLS.length); setDesktopContextMenu(null); };
  const handleRunCommand = (cmd: string) => {
      const lower = cmd.toLowerCase();
      const app = APPS.find(a => a.id === lower || a.name.toLowerCase() === lower);
      if (app) openApp(app.id);
      else if (lower === 'winver') openApp('sysinfo');
      else if (lower === 'crash') setIsBSOD(true);
      else alert(`Command '${cmd}' not found.`);
  };

  const activeWindow = windows.filter(w => w.desktopId === currentDesktopId).sort((a,b) => b.zIndex - a.zIndex)[0];
  const activeAppConfig = activeWindow ? APPS.find(a => a.id === activeWindow.appId) : null;
  const displayedApps = APPS.filter(app => installedAppIds.includes(app.id));
  const activeAccentBg = `bg-${accentColor}-500`;
  const activeAccentBorder = `border-${accentColor}-500`;

  if (isBSOD) return <BSOD />;
  if (!isInstalled) return <Installer onComplete={() => { setIsInstalled(true); setIsLocked(true); }} />;
  if (isLocked) return <LockScreen onUnlock={() => { setIsLocked(false); SystemSounds.playStartup(); }} wallpaperIndex={lockWallpaperIndex} />;

  return (
    <div 
      id="desktop-container"
      className="relative w-screen h-screen overflow-hidden bg-cover bg-center select-none transition-all duration-700 text-gray-900 dark:text-white"
      style={{ backgroundImage: `url(${WALLPAPER_URLS[wallpaperIndex]})` }}
      onContextMenu={handleDesktopContextMenu}
      onMouseDown={handleDesktopMouseDown}
      onMouseMove={handleDesktopMouseMove}
      onMouseUp={handleDesktopMouseUp}
    >
      {isScreensaverActive && <Screensaver />}
      {isNightLight && <div className="absolute inset-0 bg-orange-500/20 pointer-events-none z-[9999] mix-blend-multiply transition-opacity duration-1000"></div>}
      <TrialOverlay />
      <QuickLook node={quickLookNode} onClose={() => setQuickLookNode(null)} />
      <RunDialog isOpen={isRunDialogOpen} onClose={() => setIsRunDialogOpen(false)} onRun={handleRunCommand} />
      <ClipboardHistory isOpen={isClipboardHistoryOpen} onClose={() => setIsClipboardHistoryOpen(false)} history={clipboardHistory} onSelect={copyToClipboard} onClear={() => setClipboardHistory([])} accentColor={accentColor} />

      <div className="h-8 bg-white/60 dark:bg-[#1a1a1a]/80 backdrop-blur-xl flex items-center justify-between px-4 z-[5000] border-b border-white/10 transition-colors shadow-sm">
        <div className="flex items-center gap-4 font-medium text-sm">
          <div className={`flex items-center gap-2 font-bold hover:bg-white/20 px-2 py-0.5 rounded transition-colors cursor-default text-${accentColor}-600 dark:text-${accentColor}-400`}>
            <ICONS.LayoutGrid size={16} /> <span className="hidden sm:inline">Windora</span>
          </div>
          {activeAppConfig && (
              <>
                <span className="font-bold px-2 py-0.5 cursor-default">{activeAppConfig.name}</span>
                <span className="hover:bg-white/20 px-2 py-0.5 rounded transition-colors cursor-pointer hidden sm:inline font-normal opacity-80">File</span>
                <span className="hover:bg-white/20 px-2 py-0.5 rounded transition-colors cursor-pointer hidden sm:inline font-normal opacity-80">Edit</span>
                <span className="hover:bg-white/20 px-2 py-0.5 rounded transition-colors cursor-pointer hidden sm:inline font-normal opacity-80">View</span>
              </>
          )}
        </div>
        <div className="flex items-center gap-2">
             <button onClick={() => setIsNotificationCenterOpen(true)} className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-all relative">
                {isFocusMode ? <ICONS.BellOff size={16} /> : <ICONS.Bell size={16} />}
                {notifications.some(n => !n.read) && <div className={`absolute top-1.5 right-1.5 w-2 h-2 ${activeAccentBg} rounded-full border border-white dark:border-black`}></div>}
            </button>
        </div>
      </div>

      <div id="desktop-area" className="absolute top-8 bottom-14 left-0 right-0 z-0">
          {displayedApps.map((app, i) => {
              const pos = iconPositions[app.id] || { x: 20, y: 20 + i * 100 };
              return <DesktopShortcut key={app.id} app={app} position={pos} onOpen={openApp} onUpdatePosition={updateIconPosition} />;
          })}
          {selectionBox?.visible && (
              <div className={`absolute border ${activeAccentBorder.replace('bg', 'border')} ${activeAccentBg.replace('bg', 'bg')}/20 z-50 pointer-events-none`}
                style={{ left: Math.min(selectionBox.startX, selectionBox.currentX), top: Math.min(selectionBox.startY, selectionBox.currentY), width: Math.abs(selectionBox.currentX - selectionBox.startX), height: Math.abs(selectionBox.currentY - selectionBox.startY), backgroundColor: `var(--accent-color, rgba(59, 130, 246, 0.2))`, borderColor: `var(--accent-color, #3b82f6)` }}></div>
          )}
          {widgets.map(widget => (
              <DesktopWidget key={widget.id} widget={widget} onRemove={removeWidget} onUpdatePosition={updateWidgetPosition}>
                  {widget.type === 'weather' && <WeatherWidget />}
                  {widget.type === 'clock' && <ClockWidget />}
                  {widget.type === 'news' && <NewsWidget />}
                  {widget.type === 'system' && <SystemInfoWidget />}
                  {widget.type === 'calendar' && <CalendarWidget isOpen={true} onClose={() => {}} className="w-80 bg-[#f9f9f9]/95 dark:bg-[#1c1c1e]/95 backdrop-blur-2xl rounded-2xl border border-white/10 overflow-hidden flex flex-col p-4 select-none" />}
              </DesktopWidget>
          ))}
      </div>

      {windows.map(win => (
        <div key={win.id} style={{ display: win.desktopId === currentDesktopId ? 'block' : 'none' }}>
            <Window key={win.id} window={win} onClose={closeWindow} onMinimize={toggleMinimize} onMaximize={toggleMaximize} onFocus={bringToFront} onUpdatePosition={updatePosition} onUpdateSize={updateSize} onToggleAlwaysOnTop={toggleAlwaysOnTop} />
        </div>
      ))}

      <div className="absolute bottom-3 left-2 right-2 h-12 bg-[#f3f3f3]/80 dark:bg-[#111]/80 backdrop-blur-2xl rounded-lg border border-white/40 dark:border-white/10 flex items-center justify-between px-2 shadow-2xl z-[6000]" onContextMenu={handleTaskbarContextMenu}>
          <div className="w-32 flex items-center pl-1">
               <button onClick={() => setIsWidgetGalleryOpen(true)} className="flex items-center gap-2 px-2 py-1.5 hover:bg-white/50 dark:hover:bg-white/10 rounded-md transition-colors group text-gray-700 dark:text-white">
                   <ICONS.LayoutDashboard size={18} /> <span className="text-xs font-medium hidden sm:block">Widgets</span>
               </button>
          </div>
          <div className="flex-1 flex justify-center items-center h-full gap-1">
              <div className="start-menu-trigger relative">
                  <button onClick={() => setIsStartOpen(!isStartOpen)} className="p-2 rounded-md hover:bg-white/50 dark:hover:bg-white/10 transition-all active:scale-95">
                      <ICONS.LayoutGrid size={20} className={`text-${accentColor}-600 dark:text-${accentColor}-400`} />
                  </button>
                  {isStartOpen && <div className="start-menu-container absolute bottom-full mb-4 left-1/2 -translate-x-1/2"><StartMenu apps={displayedApps} onOpenApp={openApp} isOpen={isStartOpen} onClose={() => setIsStartOpen(false)} accentColor={accentColor} /></div>}
              </div>
              <button onClick={() => setIsSpotlightOpen(true)} className="p-2 rounded-md hover:bg-white/50 dark:hover:bg-white/10 transition-all active:scale-95"><ICONS.Search size={20} className="text-gray-600 dark:text-white/80" /></button>
              <div className="task-view-trigger relative">
                  <button onClick={() => setIsTaskViewOpen(!isTaskViewOpen)} className={`p-2 rounded-md hover:bg-white/50 dark:hover:bg-white/10 transition-all active:scale-95 ${isTaskViewOpen ? 'bg-white/50 dark:bg-white/10' : ''}`}><ICONS.GalleryHorizontal size={20} className="text-gray-600 dark:text-white/80" /></button>
              </div>
              <div className="w-[1px] h-6 bg-gray-400/20 dark:bg-white/10 mx-1"></div>
              {displayedApps.slice(0, 8).map(app => { 
                  const isRunning = windows.some(w => w.appId === app.id);
                  const appWindows = windows.filter(w => w.appId === app.id && w.desktopId === currentDesktopId);
                  return (
                      <div key={app.id} className="relative group" onMouseEnter={() => handleDockEnter(app.id)} onMouseLeave={handleDockLeave}>
                          {hoveredDockApp === app.id && isRunning && <TaskbarPreview windows={appWindows} onSelect={handlePreviewSelect} onClose={closeWindow} icon={app.icon} />}
                          <button onClick={() => handleDockClick(app.id)} className="p-2 rounded-md hover:bg-white/50 dark:hover:bg-white/10 transition-all active:scale-95 relative w-10 h-10 flex items-center justify-center">
                              <app.icon size={20} className={app.id === 'browser' ? `text-${accentColor}-500` : 'text-gray-700 dark:text-gray-200'} />
                              {isRunning && <div className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${activeAccentBg}`}></div>}
                          </button>
                      </div>
                  );
              })}
          </div>
          <div className="w-fit flex items-center justify-end h-full system-tray-control system-tray-calendar gap-1">
               <SystemTray onToggleControlCenter={() => setIsControlCenterOpen(!isControlCenterOpen)} onToggleCalendar={() => setIsCalendarOpen(!isCalendarOpen)} isControlCenterOpen={isControlCenterOpen} isCalendarOpen={isCalendarOpen} />
               <button onClick={minimizeAll} className="w-1.5 h-full hover:bg-white/20 border-l border-gray-300 dark:border-white/10 ml-1" title="Show Desktop"></button>
          </div>
      </div>
      
      {isTaskViewOpen && (
          <div className="task-view-container absolute bottom-20 left-0 right-0 h-40 bg-[#f9f9f9]/80 dark:bg-[#1c1c1e]/80 backdrop-blur-xl border-t border-white/10 flex items-center justify-center gap-4 z-[6500] animate-in slide-in-from-bottom-10 fade-in duration-200">
              {desktops.map(desktop => (
                  <div key={desktop.id} onClick={() => { setCurrentDesktopId(desktop.id); setIsTaskViewOpen(false); }} className={`relative w-48 h-28 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-center group ${currentDesktopId === desktop.id ? `border-${accentColor}-500 bg-${accentColor}-500/10` : 'border-gray-300 dark:border-white/10 hover:bg-white/10'}`}>
                      <span className="text-sm font-medium">{desktop.name}</span>
                      {desktops.length > 1 && <button onClick={(e) => removeDesktop(desktop.id, e)} className="absolute top-1 right-1 p-1 hover:bg-red-500 hover:text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><ICONS.XIcon size={12} /></button>}
                  </div>
              ))}
              <button onClick={addDesktop} className="w-12 h-28 rounded-xl border-2 border-dashed border-gray-300 dark:border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"><ICONS.Plus size={24} /></button>
          </div>
      )}

      <div className="absolute bottom-16 right-4 z-[7000]">
          <CalendarWidget isOpen={isCalendarOpen} onClose={() => setIsCalendarOpen(false)} className="w-80 bg-[#f9f9f9]/95 dark:bg-[#1c1c1e]/95 backdrop-blur-2xl rounded-2xl border border-white/20 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 fade-in duration-200 p-4 select-none" />
      </div>
      <ControlCenter isOpen={isControlCenterOpen} onClose={() => setIsControlCenterOpen(false)} toggleTheme={() => setIsDarkMode(!isDarkMode)} isDarkMode={isDarkMode} isNightLight={isNightLight} toggleNightLight={() => setIsNightLight(!isNightLight)} accentColor={accentColor} />
      <NotificationCenter isOpen={isNotificationCenterOpen} onClose={() => setIsNotificationCenterOpen(false)} toggleTheme={() => setIsDarkMode(!isDarkMode)} isDarkMode={isDarkMode} isNightLight={isNightLight} toggleNightLight={() => setIsNightLight(!isNightLight)} notifications={notifications} clearNotifications={clearNotifications} apps={APPS} isFocusMode={isFocusMode} toggleFocusMode={() => setIsFocusMode(!isFocusMode)} />
      <SpotlightSearch isOpen={isSpotlightOpen} onClose={() => setIsSpotlightOpen(false)} apps={displayedApps} onOpenApp={openApp} fileSystem={fileSystem} toggleTheme={() => setIsDarkMode(!isDarkMode)} isDarkMode={isDarkMode} />
      
      {desktopContextMenu && (
        <div ref={contextMenuRef} className="fixed bg-[#f9f9f9]/95 dark:bg-[#1c1c1e]/95 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-lg shadow-2xl py-1 z-[8000] min-w-[180px] animate-in fade-in zoom-in-95 duration-100" style={{ top: desktopContextMenu.y, left: desktopContextMenu.x }}>
           <button onClick={() => openApp('files')} className={`w-full text-left px-4 py-1.5 text-sm hover:${activeAccentBg} hover:text-white dark:text-gray-200 transition-colors flex items-center gap-2`}><ICONS.FolderOpen size={16} /> Open Explorer</button>
           <button onClick={() => openApp('terminal')} className={`w-full text-left px-4 py-1.5 text-sm hover:${activeAccentBg} hover:text-white dark:text-gray-200 transition-colors flex items-center gap-2`}><ICONS.Terminal size={16} /> Open Terminal</button>
           <div className="h-[1px] bg-gray-200 dark:bg-white/10 my-1"></div>
           <button onClick={() => setIsWidgetGalleryOpen(true)} className={`w-full text-left px-4 py-1.5 text-sm hover:${activeAccentBg} hover:text-white dark:text-gray-200 transition-colors flex items-center gap-2`}><ICONS.Layout size={16} /> Add Widgets</button>
           <div className="h-[1px] bg-gray-200 dark:bg-white/10 my-1"></div>
           <button onClick={cycleWallpaper} className={`w-full text-left px-4 py-1.5 text-sm hover:${activeAccentBg} hover:text-white dark:text-gray-200 transition-colors flex items-center gap-2`}><ICONS.ImageIcon size={16} /> Next Wallpaper</button>
           <button onClick={() => openApp('settings')} className={`w-full text-left px-4 py-1.5 text-sm hover:${activeAccentBg} hover:text-white dark:text-gray-200 transition-colors flex items-center gap-2`}><ICONS.Settings size={16} /> Personalize</button>
        </div>
      )}

      {taskbarContextMenu && (
        <div ref={taskbarContextMenuRef} className="fixed bg-[#f9f9f9]/95 dark:bg-[#1c1c1e]/95 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-lg shadow-2xl py-1 z-[8000] min-w-[180px] animate-in fade-in zoom-in-95 duration-100 origin-bottom" style={{ top: taskbarContextMenu.y - 110, left: taskbarContextMenu.x }}>
           <button onClick={() => openApp('settings')} className={`w-full text-left px-4 py-1.5 text-sm hover:${activeAccentBg} hover:text-white dark:text-gray-200 transition-colors flex items-center gap-2`}><ICONS.Settings size={16} /> Taskbar settings</button>
           <button onClick={() => openApp('monitor')} className={`w-full text-left px-4 py-1.5 text-sm hover:${activeAccentBg} hover:text-white dark:text-gray-200 transition-colors flex items-center gap-2`}><ICONS.MonitorUp size={16} /> Task Manager</button>
           <div className="h-[1px] bg-gray-200 dark:bg-white/10 my-1"></div>
           <button onClick={minimizeAll} className={`w-full text-left px-4 py-1.5 text-sm hover:${activeAccentBg} hover:text-white dark:text-gray-200 transition-colors flex items-center gap-2`}><ICONS.Minimize size={16} /> Show Desktop</button>
        </div>
      )}

      {isWidgetGalleryOpen && (
          <div className="fixed inset-0 z-[9000] bg-black/30 backdrop-blur-sm flex items-center justify-center widget-gallery">
              <div className="bg-[#f9f9f9]/95 dark:bg-[#1c1c1e]/95 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl p-8 w-[800px] max-h-[600px] flex flex-col animate-in zoom-in-95">
                  <div className="flex justify-between items-center mb-8">
                      <h2 className="text-2xl font-bold dark:text-white">Add Widgets</h2>
                      <button onClick={() => setIsWidgetGalleryOpen(false)} className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full"><ICONS.XIcon /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-6 overflow-y-auto p-2">
                      <div className="p-4 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer transition-all group" onClick={() => addWidget('weather')}>
                          <div className="font-bold mb-2 dark:text-white">Weather</div>
                          <div className="pointer-events-none transform scale-75 origin-top-left"><WeatherWidget /></div>
                      </div>
                      <div className="p-4 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer transition-all group" onClick={() => addWidget('clock')}>
                          <div className="font-bold mb-2 dark:text-white">Clock</div>
                          <div className="pointer-events-none transform scale-75 origin-top-left"><ClockWidget /></div>
                      </div>
                      <div className="p-4 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer transition-all group" onClick={() => addWidget('news')}>
                          <div className="font-bold mb-2 dark:text-white">News Feed</div>
                          <div className="pointer-events-none transform scale-75 origin-top-left"><NewsWidget /></div>
                      </div>
                      <div className="p-4 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer transition-all group" onClick={() => addWidget('system')}>
                          <div className="font-bold mb-2 dark:text-white">System Info</div>
                          <div className="pointer-events-none transform scale-75 origin-top-left"><SystemInfoWidget /></div>
                      </div>
                      <div className="p-4 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer transition-all group" onClick={() => addWidget('calendar')}>
                          <div className="font-bold mb-2 dark:text-white">Calendar</div>
                          <div className="pointer-events-none transform scale-75 origin-top-left"><CalendarWidget isOpen={true} onClose={()=>{}} className="w-80 bg-[#f9f9f9]/95 dark:bg-[#1c1c1e]/95 backdrop-blur-2xl rounded-2xl border border-white/10 overflow-hidden flex flex-col p-4 select-none" /></div>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}
