
import React, { useState } from 'react';
import { ICONS } from '../../constants';
import { Plus, X, Trash2 } from 'lucide-react';
import { AppProps } from '../../types';

interface Note {
    id: number;
    text: string;
    color: string;
}

const COLORS = [
    'bg-yellow-200 text-yellow-900',
    'bg-green-200 text-green-900',
    'bg-blue-200 text-blue-900',
    'bg-pink-200 text-pink-900',
    'bg-purple-200 text-purple-900'
];

const StickyNotesApp: React.FC<AppProps> = () => {
  const [notes, setNotes] = useState<Note[]>([
      { id: 1, text: 'Welcome to Sticky Notes! \nClick + to add a new note.', color: 'bg-yellow-200 text-yellow-900' }
  ]);

  const addNote = () => {
      setNotes([...notes, { 
          id: Date.now(), 
          text: '', 
          color: COLORS[Math.floor(Math.random() * COLORS.length)] 
      }]);
  };

  const updateNote = (id: number, text: string) => {
      setNotes(notes.map(n => n.id === id ? { ...n, text } : n));
  };

  const deleteNote = (id: number) => {
      setNotes(notes.filter(n => n.id !== id));
  };

  return (
    <div className="h-full bg-[#f3f3f3] dark:bg-[#191919] flex flex-col">
        <div className="h-12 bg-white dark:bg-[#2d2d2d] border-b border-gray-200 dark:border-gray-700 flex items-center px-4 justify-between">
            <span className="font-bold text-gray-700 dark:text-white flex items-center gap-2">
                <ICONS.StickyNote className="text-yellow-500" size={20} /> Sticky Notes
            </span>
            <button 
                onClick={addNote}
                className="p-2 bg-gray-100 dark:bg-white/10 rounded-full hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
            >
                <Plus size={18} className="text-gray-600 dark:text-gray-300" />
            </button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto grid grid-cols-2 md:grid-cols-3 gap-4 content-start">
            {notes.map(note => (
                <div key={note.id} className={`${note.color} p-4 rounded-xl shadow-md h-48 flex flex-col relative group transition-transform hover:scale-[1.02]`}>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => deleteNote(note.id)} className="p-1 hover:bg-black/10 rounded-full">
                            <X size={14} />
                        </button>
                    </div>
                    <textarea 
                        className="flex-1 bg-transparent border-none outline-none resize-none font-medium placeholder-current/50 text-sm leading-relaxed"
                        placeholder="Take a note..."
                        value={note.text}
                        onChange={(e) => updateNote(note.id, e.target.value)}
                    />
                    <div className="text-[10px] opacity-50 mt-2 text-right">
                        {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                </div>
            ))}
            
            {notes.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center h-64 text-gray-400">
                    <ICONS.StickyNote size={48} className="mb-4 opacity-20" />
                    <p>No notes yet.</p>
                    <button onClick={addNote} className="mt-4 text-blue-500 hover:underline">Create one</button>
                </div>
            )}
        </div>
    </div>
  );
};

export default StickyNotesApp;
