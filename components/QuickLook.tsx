
import React, { useEffect, useState } from 'react';
import { FileSystemNode } from '../types';
import { ICONS } from '../constants';

interface QuickLookProps {
  node: FileSystemNode | null;
  onClose: () => void;
}

const QuickLook: React.FC<QuickLookProps> = ({ node, onClose }) => {
  const [content, setContent] = useState<string | null>(null);

  useEffect(() => {
      if (node) {
          setContent(node.content || null);
      }
  }, [node]);

  if (!node) return null;

  const ext = node.name.split('.').pop()?.toLowerCase();
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '');
  const isCode = ['js', 'ts', 'py', 'json', 'html', 'css', 'md', 'txt'].includes(ext || '');

  return (
    <div 
        className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/20 backdrop-blur-sm"
        onClick={onClose}
    >
        <div 
            className="bg-white/80 dark:bg-[#1e1e1e]/90 backdrop-blur-2xl rounded-xl shadow-2xl border border-white/20 dark:border-white/10 w-[600px] h-[400px] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
        >
            {/* Header */}
            <div className="h-10 bg-gray-100/50 dark:bg-white/5 flex items-center justify-between px-4 border-b border-gray-200/50 dark:border-white/10">
                <div className="font-semibold text-sm text-gray-800 dark:text-white truncate">{node.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{node.size || 'Unknown Size'}</div>
            </div>

            {/* Content */}
            <div className="flex-1 flex items-center justify-center p-4 bg-white dark:bg-black/40 relative overflow-hidden">
                {isImage ? (
                    <img src={content || ''} alt={node.name} className="max-w-full max-h-full object-contain shadow-lg" />
                ) : isCode ? (
                    <div className="w-full h-full overflow-auto bg-gray-50 dark:bg-[#111] p-4 rounded-lg border border-gray-200 dark:border-gray-800 text-left">
                        <pre className="text-xs font-mono text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-medium">
                            {content || '(Empty)'}
                        </pre>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4 text-gray-400">
                        <ICONS.FileText size={80} />
                        <p>Preview not available</p>
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            <div className="h-12 bg-gray-100/50 dark:bg-white/5 border-t border-gray-200/50 dark:border-white/10 flex items-center justify-center gap-4">
                 <button className="px-4 py-1.5 bg-white dark:bg-white/10 rounded-md shadow-sm text-xs font-medium hover:bg-gray-50 dark:hover:bg-white/20 transition-colors">Open with App</button>
            </div>
        </div>
    </div>
  );
};

export default QuickLook;
