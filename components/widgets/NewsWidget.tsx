
import React from 'react';
import { Newspaper } from 'lucide-react';

const NewsWidget = () => {
  const news = [
      { title: "Windora OS launches with hybrid kernel", time: "2h ago" },
      { title: "Tech giants embrace WebAssembly", time: "4h ago" },
      { title: "SpaceX successful landing", time: "6h ago" },
  ];

  return (
    <div className="w-72 p-4 text-gray-800 dark:text-white">
        <div className="flex items-center gap-2 mb-3 border-b border-gray-500/20 pb-2">
            <div className="bg-red-500 p-1 rounded text-white"><Newspaper size={14} /></div>
            <span className="text-xs font-bold uppercase">Top Stories</span>
        </div>
        <div className="space-y-3">
            {news.map((item, i) => (
                <div key={i} className="group cursor-pointer">
                    <div className="text-xs font-medium leading-tight group-hover:text-blue-500 transition-colors line-clamp-2">{item.title}</div>
                    <div className="text-[10px] opacity-50 mt-0.5">{item.time}</div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default NewsWidget;
