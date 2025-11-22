
import React, { useState, useRef, useEffect } from 'react';
import { ICONS } from '../../constants';
import { getAssistantResponse } from '../../services/geminiService';
import { Send } from 'lucide-react';
import { AppProps } from '../../types';

const AssistantApp: React.FC<AppProps> = () => {
  const [messages, setMessages] = useState<{role: 'user'|'model', text: string}[]>([
      { role: 'model', text: 'Hello! I am WindoraAI. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
      if (!input.trim()) return;
      
      const userMsg = input;
      setInput('');
      setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
      setIsLoading(true);
      
      const response = await getAssistantResponse(userMsg);
      
      setMessages(prev => [...prev, { role: 'model', text: response }]);
      setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-white font-sans">
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm leading-relaxed shadow-sm ${
                        msg.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-br-none' 
                        : 'bg-gray-100 dark:bg-[#333] text-gray-800 dark:text-gray-200 rounded-bl-none border border-gray-200 dark:border-gray-700'
                    }`}>
                        {msg.text}
                    </div>
                </div>
            ))}
            {isLoading && (
                 <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-[#333] px-4 py-3 rounded-2xl rounded-bl-none border border-gray-200 dark:border-gray-700">
                        <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                        </div>
                    </div>
                </div>
            )}
            <div ref={endRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#252526]">
            <div className="flex gap-2">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask me anything..."
                    className="flex-1 bg-white dark:bg-[#333] border border-gray-300 dark:border-gray-600 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    disabled={isLoading}
                />
                <button 
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors shadow-sm"
                >
                    <Send size={18} />
                </button>
            </div>
        </div>
    </div>
  );
};

export default AssistantApp;
