
import React, { useState } from 'react';
import { ICONS } from '../../constants';
import { AppProps } from '../../types';

interface Email {
  id: number;
  sender: string;
  subject: string;
  preview: string;
  date: string;
  read: boolean;
  body: string;
  folder: 'inbox' | 'sent' | 'archive' | 'trash';
}

const MailApp: React.FC<AppProps> = () => {
  const [activeFolder, setActiveFolder] = useState<'inbox' | 'sent' | 'archive' | 'trash'>('inbox');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock Data
  const [emails, setEmails] = useState<Email[]>([
      { id: 1, sender: 'Team Windora', subject: 'Welcome to Windora OS!', preview: 'Thanks for trying out the beta...', date: '10:30 AM', read: false, body: 'Welcome User,\n\nThank you for installing Windora OS. This is a hybrid operating system designed for efficiency and aesthetics.\n\nEnjoy exploring!\n\n- The Windora Team', folder: 'inbox' },
      { id: 2, sender: 'Security Alert', subject: 'New sign-in detected', preview: 'We noticed a new sign-in to your account...', date: 'Yesterday', read: true, body: 'We detected a new sign-in from Chrome on Windora OS. If this was you, you can ignore this message.', folder: 'inbox' },
      { id: 3, sender: 'Newsletter', subject: 'Weekly Tech Roundup', preview: 'Top stories: AI takes over...', date: 'Oct 20', read: true, body: 'Here are the top tech stories of the week...', folder: 'archive' },
  ]);

  const [composeData, setComposeData] = useState({ to: '', subject: '', body: '' });

  const filteredEmails = emails.filter(e => 
      e.folder === activeFolder && 
      (e.subject.toLowerCase().includes(searchQuery.toLowerCase()) || e.sender.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSend = () => {
      const newEmail: Email = {
          id: Date.now(),
          sender: 'Me',
          subject: composeData.subject,
          preview: composeData.body.substring(0, 30) + '...',
          date: 'Just now',
          read: true,
          body: composeData.body,
          folder: 'sent'
      };
      setEmails([newEmail, ...emails]);
      setIsComposing(false);
      setComposeData({ to: '', subject: '', body: '' });
      setActiveFolder('sent');
      setSelectedEmail(newEmail);
  };

  const handleDelete = (id: number, e: React.MouseEvent) => {
      e.stopPropagation();
      if (activeFolder === 'trash') {
          setEmails(emails.filter(em => em.id !== id));
          if (selectedEmail?.id === id) setSelectedEmail(null);
      } else {
          setEmails(emails.map(em => em.id === id ? { ...em, folder: 'trash' } : em));
          if (selectedEmail?.id === id) setSelectedEmail(null);
      }
  };

  return (
    <div className="flex h-full bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-200 font-sans">
        {/* Sidebar */}
        <div className="w-48 bg-gray-100 dark:bg-[#252526] flex flex-col border-r border-gray-200 dark:border-gray-700">
            <div className="p-4">
                <button 
                    onClick={() => setIsComposing(true)}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                    <ICONS.Edit size={16} /> Compose
                </button>
            </div>
            <div className="flex-1 px-2 space-y-1 overflow-y-auto">
                <button onClick={() => setActiveFolder('inbox')} className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm ${activeFolder === 'inbox' ? 'bg-white dark:bg-white/10 font-medium shadow-sm' : 'hover:bg-gray-200 dark:hover:bg-white/5'}`}>
                    <div className="flex items-center gap-3"><ICONS.Inbox size={16} className="text-blue-500" /> Inbox</div>
                    <span className="text-xs text-gray-500">{emails.filter(e => e.folder === 'inbox' && !e.read).length || ''}</span>
                </button>
                <button onClick={() => setActiveFolder('sent')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm ${activeFolder === 'sent' ? 'bg-white dark:bg-white/10 font-medium shadow-sm' : 'hover:bg-gray-200 dark:hover:bg-white/5'}`}>
                    <ICONS.Send size={16} className="text-green-500" /> Sent
                </button>
                <button onClick={() => setActiveFolder('archive')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm ${activeFolder === 'archive' ? 'bg-white dark:bg-white/10 font-medium shadow-sm' : 'hover:bg-gray-200 dark:hover:bg-white/5'}`}>
                    <ICONS.Archive size={16} className="text-orange-500" /> Archive
                </button>
                <button onClick={() => setActiveFolder('trash')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm ${activeFolder === 'trash' ? 'bg-white dark:bg-white/10 font-medium shadow-sm' : 'hover:bg-gray-200 dark:hover:bg-white/5'}`}>
                    <ICONS.Trash2 size={16} className="text-red-500" /> Trash
                </button>
            </div>
        </div>

        {/* Email List */}
        <div className="w-72 border-r border-gray-200 dark:border-gray-700 flex flex-col bg-white dark:bg-[#1e1e1e]">
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                    <ICONS.Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input 
                        type="text" 
                        placeholder="Search mail"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-100 dark:bg-[#2d2d2d] pl-8 pr-3 py-1.5 rounded-md text-sm outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto">
                {filteredEmails.map(email => (
                    <div 
                        key={email.id}
                        onClick={() => { setSelectedEmail(email); setEmails(emails.map(e => e.id === email.id ? { ...e, read: true } : e)); }}
                        className={`p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer group transition-colors ${selectedEmail?.id === email.id ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-[#252526]'}`}
                    >
                        <div className="flex justify-between mb-1">
                            <span className={`text-sm truncate ${!email.read ? 'font-bold text-black dark:text-white' : 'font-medium text-gray-700 dark:text-gray-300'}`}>{email.sender}</span>
                            <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{email.date}</span>
                        </div>
                        <div className={`text-xs mb-1 truncate ${!email.read ? 'font-semibold text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'}`}>{email.subject}</div>
                        <div className="text-xs text-gray-400 line-clamp-2">{email.preview}</div>
                        <div className="hidden group-hover:flex justify-end mt-2">
                            <button onClick={(e) => handleDelete(email.id, e)} className="text-gray-400 hover:text-red-500 p-1"><ICONS.Trash2 size={14} /></button>
                        </div>
                    </div>
                ))}
                {filteredEmails.length === 0 && (
                    <div className="p-8 text-center text-gray-400 text-sm">No emails found</div>
                )}
            </div>
        </div>

        {/* Reading Pane / Compose */}
        <div className="flex-1 flex flex-col bg-white dark:bg-[#1e1e1e]">
            {isComposing ? (
                <div className="flex-1 flex flex-col p-6 animate-in fade-in duration-200">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold">New Message</h2>
                        <button onClick={() => setIsComposing(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded-full"><ICONS.XIcon size={18} /></button>
                    </div>
                    <input 
                        type="text" 
                        placeholder="To" 
                        className="border-b border-gray-200 dark:border-gray-700 py-2 bg-transparent outline-none text-sm mb-2"
                        value={composeData.to}
                        onChange={(e) => setComposeData({...composeData, to: e.target.value})}
                    />
                    <input 
                        type="text" 
                        placeholder="Subject" 
                        className="border-b border-gray-200 dark:border-gray-700 py-2 bg-transparent outline-none text-sm font-medium mb-4"
                        value={composeData.subject}
                        onChange={(e) => setComposeData({...composeData, subject: e.target.value})}
                    />
                    <textarea 
                        placeholder="Type your message..." 
                        className="flex-1 bg-transparent outline-none resize-none text-sm leading-relaxed"
                        value={composeData.body}
                        onChange={(e) => setComposeData({...composeData, body: e.target.value})}
                    />
                    <div className="flex justify-end pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                        <button onClick={handleSend} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-medium transition-colors flex items-center gap-2">
                            Send <ICONS.Send size={14} />
                        </button>
                    </div>
                </div>
            ) : selectedEmail ? (
                <div className="flex-1 flex flex-col animate-in fade-in duration-200">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-start mb-4">
                             <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedEmail.subject}</h2>
                             <div className="flex gap-2">
                                 <button className="p-2 hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded-full text-gray-500"><ICONS.Archive size={18} /></button>
                                 <button onClick={(e) => handleDelete(selectedEmail.id, e)} className="p-2 hover:bg-gray-100 dark:hover:bg-[#2d2d2d] rounded-full text-gray-500 hover:text-red-500"><ICONS.Trash2 size={18} /></button>
                             </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                {selectedEmail.sender[0]}
                            </div>
                            <div>
                                <div className="font-medium text-sm text-gray-900 dark:text-white">{selectedEmail.sender}</div>
                                <div className="text-xs text-gray-500">to me</div>
                            </div>
                            <div className="ml-auto text-xs text-gray-400">{selectedEmail.date}</div>
                        </div>
                    </div>
                    <div className="flex-1 p-8 overflow-y-auto text-sm leading-relaxed text-gray-800 dark:text-gray-300 whitespace-pre-wrap">
                        {selectedEmail.body}
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                    <ICONS.Mail size={64} className="mb-4 opacity-20" />
                    <p>Select an item to read</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default MailApp;
