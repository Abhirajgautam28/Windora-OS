
import React, { useState } from 'react';
import { ICONS } from '../../constants';
import { AppProps } from '../../types';

interface Contact {
    id: number;
    name: string;
    title: string;
    email: string;
    phone: string;
    color: string;
}

const ContactsApp: React.FC<AppProps> = () => {
  const [contacts, setContacts] = useState<Contact[]>([
      { id: 1, name: 'Alice Chen', title: 'Product Manager', email: 'alice@example.com', phone: '+1 (555) 123-4567', color: 'bg-orange-500' },
      { id: 2, name: 'Bob Smith', title: 'Software Engineer', email: 'bob@example.com', phone: '+1 (555) 987-6543', color: 'bg-blue-500' },
      { id: 3, name: 'Charlie Kim', title: 'Designer', email: 'charlie@example.com', phone: '+1 (555) 456-7890', color: 'bg-purple-500' },
      { id: 4, name: 'David Lee', title: 'Marketing', email: 'david@example.com', phone: '+1 (555) 789-0123', color: 'bg-green-500' },
  ]);
  const [selectedId, setSelectedId] = useState<number | null>(1);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContacts = contacts.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const selectedContact = contacts.find(c => c.id === selectedId);

  return (
    <div className="flex h-full bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-200 font-sans">
        {/* Sidebar */}
        <div className="w-72 border-r border-gray-200 dark:border-gray-700 flex flex-col bg-gray-50 dark:bg-[#252526]">
            <div className="p-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">Contacts</h2>
                <button className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors">
                    <ICONS.Plus size={20} className="text-blue-600 dark:text-blue-400" />
                </button>
            </div>
            
            <div className="px-4 pb-2">
                <div className="relative">
                    <ICONS.Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search contacts" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto mt-2">
                {filteredContacts.map(contact => (
                    <div 
                        key={contact.id}
                        onClick={() => setSelectedId(contact.id)}
                        className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${selectedId === contact.id ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' : 'hover:bg-gray-100 dark:hover:bg-white/5 border-l-4 border-transparent'}`}
                    >
                        <div className={`w-10 h-10 rounded-full ${contact.color} flex items-center justify-center text-white font-bold shadow-sm`}>
                            {contact.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className={`text-sm font-medium truncate ${selectedId === contact.id ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-gray-100'}`}>{contact.name}</div>
                            <div className="text-xs text-gray-500 truncate">{contact.title}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Detail View */}
        <div className="flex-1 flex flex-col">
            {selectedContact ? (
                <div className="flex-1 p-8 overflow-y-auto animate-in fade-in slide-in-from-right-4 duration-200">
                    <div className="flex items-start justify-between mb-8">
                         <div className="flex items-center gap-6">
                             <div className={`w-24 h-24 rounded-full ${selectedContact.color} flex items-center justify-center text-white text-4xl font-bold shadow-lg`}>
                                 {selectedContact.name.charAt(0)}
                             </div>
                             <div>
                                 <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{selectedContact.name}</h1>
                                 <p className="text-lg text-gray-500 dark:text-gray-400">{selectedContact.title}</p>
                                 <div className="flex gap-2 mt-4">
                                     <button className="p-2 bg-gray-100 dark:bg-white/10 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 transition-colors">
                                         <ICONS.Mail size={20} />
                                     </button>
                                     <button className="p-2 bg-gray-100 dark:bg-white/10 rounded-full hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-600 transition-colors">
                                         <ICONS.Phone size={20} />
                                     </button>
                                     <button className="p-2 bg-gray-100 dark:bg-white/10 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-600 transition-colors">
                                         <ICONS.Video size={20} />
                                     </button>
                                 </div>
                             </div>
                         </div>
                         <button className="px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center gap-2">
                             <ICONS.Edit size={14} /> Edit
                         </button>
                    </div>

                    <div className="space-y-6 max-w-2xl">
                        <div className="bg-gray-50 dark:bg-[#252526] rounded-xl p-6 border border-gray-100 dark:border-gray-700/50">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Contact Information</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-white dark:bg-white/5 flex items-center justify-center text-gray-400">
                                        <ICONS.Mail size={20} />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">Email</div>
                                        <a href={`mailto:${selectedContact.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">{selectedContact.email}</a>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-white dark:bg-white/5 flex items-center justify-center text-gray-400">
                                        <ICONS.Phone size={20} />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">Mobile</div>
                                        <div className="text-gray-900 dark:text-white">{selectedContact.phone}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-white dark:bg-white/5 flex items-center justify-center text-gray-400">
                                        <ICONS.MapPin size={20} />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">Location</div>
                                        <div className="text-gray-900 dark:text-white">San Francisco, CA</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-[#252526] rounded-xl p-6 border border-gray-100 dark:border-gray-700/50">
                             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">History</h3>
                             <div className="text-sm text-gray-500 italic">No recent interactions.</div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                    <ICONS.Users size={64} className="mb-4 opacity-20" />
                    <p>Select a contact to view details</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default ContactsApp;
