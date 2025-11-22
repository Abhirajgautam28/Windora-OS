
import React, { ReactNode } from 'react';

export interface WindowState {
  id: string;
  title: string;
  appId: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  isAlwaysOnTop?: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  desktopId: number; // Virtual Desktop ID
  content?: ReactNode;
}

export interface AppConfig {
  id: string;
  name: string;
  icon: React.FC<any>;
  defaultWidth: number;
  defaultHeight: number;
  component: React.FC<AppProps>;
  color: string;
}

export interface OSNotification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  appId: string;
  read: boolean;
}

export interface AppProps {
  windowId: string;
  initialContent?: any;
  fileSystem?: FileSystemNode[];
  setFileSystem?: React.Dispatch<React.SetStateAction<FileSystemNode[]>>;
  onOpenApp?: (appId: string, data?: any) => void;
  apps?: AppConfig[];
  installedAppIds?: string[];
  onInstallApp?: (appId: string) => void;
  onUninstallApp?: (appId: string) => void;
  addNotification?: (title: string, message: string, appId?: string) => void;
  accentColor?: string;
  setAccentColor?: (color: string) => void;
  isDarkMode?: boolean;
  toggleTheme?: () => void;
}

export interface FileSystemNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileSystemNode[];
  parentId?: string;
  dateModified?: Date;
  dateCreated?: Date;
  size?: string;
  permissions?: {
    read: boolean;
    write: boolean;
    execute: boolean;
  };
}

export enum TerminalMode {
  BASH = 'bash',
  PYTHON = 'python'
}

export interface ContextMenuItem {
  label: string;
  icon?: React.FC<any>;
  action: () => void;
  separator?: boolean;
  shortcut?: string;
  disabled?: boolean;
  danger?: boolean;
}

export type ViewMode = 'grid' | 'list';

export interface WidgetData {
    id: string;
    type: 'weather' | 'clock' | 'news' | 'calendar';
    position: { x: number; y: number };
}
