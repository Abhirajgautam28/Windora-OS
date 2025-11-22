
import React from 'react';
import { ICONS } from '../../constants';
import { AppProps } from '../../types';

const SystemInfoApp: React.FC<AppProps> = () => {
  return (
    <div className="h-full bg-[#f0f0f0] dark:bg-[#202020] text-gray-900 dark:text-white p-6 flex flex-col font-sans select-none">
        <div className="flex gap-6 items-start mb-8 border-b border-gray-300 dark:border-gray-600 pb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <ICONS.LayoutGrid size={48} className="text-white" />
            </div>
            <div>
                <h1 className="text-4xl font-light mb-2">Windora OS</h1>
                <p className="text-lg text-blue-600 dark:text-blue-400 font-medium">Professional Workstation</p>
                <p className="text-sm text-gray-500 mt-2">© 2025 Windora Corporation. All rights reserved.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">System</h3>
                <div className="bg-white dark:bg-[#2d2d2d] rounded-lg border border-gray-300 dark:border-gray-600 p-4 space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-500">Processor</span>
                        <span className="font-medium">Intel Core i9-14900K</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Memory</span>
                        <span className="font-medium">64.0 GB RAM</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">System Type</span>
                        <span className="font-medium">64-bit Operating System</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Computer Name</span>
                        <span className="font-medium">WINDORA-DESKTOP</span>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">Windora Specifications</h3>
                <div className="bg-white dark:bg-[#2d2d2d] rounded-lg border border-gray-300 dark:border-gray-600 p-4 space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-500">Edition</span>
                        <span className="font-medium">Windora 11 Pro</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Version</span>
                        <span className="font-medium">25H2</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">OS Build</span>
                        <span className="font-medium">22631.3007</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Experience</span>
                        <span className="font-medium">Windora Feature Experience Pack</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div className="mt-auto pt-6 text-xs text-gray-400 text-center">
            This product is licensed under the Windora Software License Terms.
        </div>
    </div>
  );
};

export default SystemInfoApp;
