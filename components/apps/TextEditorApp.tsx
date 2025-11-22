
import React, { useState } from 'react';
import { ICONS } from '../../constants';
import { AppProps, FileSystemNode } from '../../types';
import { Eye } from 'lucide-react';

interface TextEditorProps extends AppProps {
  initialContent?: string;
  fileSystem?: FileSystemNode[];
  setFileSystem?: React.Dispatch<React.SetStateAction<FileSystemNode[]>>;
}

const TextEditorApp: React.FC<TextEditorProps> = ({ initialContent = '', fileSystem, setFileSystem }) => {
  const [content, setContent] = useState(initialContent);
  const [isPreview, setIsPreview] = useState(false);

  const renderMarkdown = (text: string) => {
      return text.split('\n').map((line, i) => {
          if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold mb-2">{line.slice(2)}</h1>;
          if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold mb-2">{line.slice(3)}</h2>;
          if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-bold mb-1">{line.slice(4)}</h3>;
          if (line.startsWith('- ')) return <li key={i} className="ml-4">{line.slice(2)}</li>;
          if (line.match(/^\d+\. /)) return <li key={i} className="ml-4 list-decimal">{line.replace(/^\d+\. /, '')}</li>;
          if (!line.trim()) return <br key={i} />;
          return <p key={i} className="mb-1">{line}</p>;
      });
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-200 font-sans">
      {/* Toolbar */}
      <div className="h-10 border-b border-gray-200 dark:border-gray-700 flex items-center px-2 gap-1 bg-gray-50 dark:bg-[#2d2d2d]">
         <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded transition-colors" title="Save">
             <ICONS.Save size={16} className="text-gray-600 dark:text-gray-300" />
         </button>
         <div className="w-[1px] h-5 bg-gray-300 dark:bg-gray-600 mx-2"></div>
         <button className="px-3 py-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded text-xs transition-colors">File</button>
         <button className="px-3 py-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded text-xs transition-colors">Edit</button>
         <button className="px-3 py-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded text-xs transition-colors">Format</button>
         <button className="px-3 py-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded text-xs transition-colors">View</button>
         
         <div className="flex-1"></div>
         
         <button 
            onClick={() => setIsPreview(!isPreview)}
            className={`flex items-center gap-2 px-3 py-1 rounded text-xs transition-colors ${isPreview ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300' : 'hover:bg-gray-200 dark:hover:bg-white/10'}`}
         >
             <Eye size={14} /> Preview
         </button>
      </div>
      
      {/* Editor Area */}
      {isPreview ? (
          <div className="flex-1 p-8 overflow-y-auto prose dark:prose-invert max-w-none">
              {renderMarkdown(content)}
          </div>
      ) : (
          <textarea 
             className="flex-1 p-4 resize-none outline-none bg-transparent font-mono text-sm leading-relaxed custom-scrollbar"
             value={content}
             onChange={(e) => setContent(e.target.value)}
             spellCheck={false}
             placeholder="Start typing..."
          />
      )}
      
      {/* Status Bar */}
      <div className="h-7 border-t border-gray-200 dark:border-gray-700 flex items-center px-3 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-[#2d2d2d] select-none">
         <span>Ln {content.split('\n').length}, Col {content.length}</span>
         <span className="ml-auto">UTF-8</span>
         <span className="ml-4">{isPreview ? 'Markdown Mode' : 'Plain Text'}</span>
      </div>
    </div>
  );
};

export default TextEditorApp;
