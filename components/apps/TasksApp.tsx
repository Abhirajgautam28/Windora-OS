
import React, { useState } from 'react';
import { ICONS } from '../../constants';
import { AppProps } from '../../types';

interface Task {
  id: number;
  text: string;
  completed: boolean;
  category: string;
}

const TasksApp: React.FC<AppProps> = () => {
  const [tasks, setTasks] = useState<Task[]>([
      { id: 1, text: 'Review system logs', completed: false, category: 'Work' },
      { id: 2, text: 'Update software packages', completed: true, category: 'Work' },
      { id: 3, text: 'Grocery shopping', completed: false, category: 'Personal' },
  ]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [category, setCategory] = useState('Work');

  const addTask = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newTask.trim()) return;
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false, category }]);
      setNewTask('');
  };

  const toggleTask = (id: number) => {
      setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: number) => {
      setTasks(tasks.filter(t => t.id !== id));
  };

  const filteredTasks = tasks.filter(t => {
      if (filter === 'active') return !t.completed;
      if (filter === 'completed') return t.completed;
      return true;
  });

  return (
    <div className="flex h-full bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-200 font-sans">
        <div className="w-64 bg-gray-50 dark:bg-[#252526] p-6 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
                <ICONS.CheckSquare className="text-blue-500" /> Tasks
            </h2>
            
            <div className="space-y-1">
                <button 
                    onClick={() => setFilter('all')}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 'hover:bg-gray-200 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400'}`}
                >
                    All Tasks
                </button>
                <button 
                    onClick={() => setFilter('active')}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'active' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 'hover:bg-gray-200 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400'}`}
                >
                    Active
                </button>
                <button 
                    onClick={() => setFilter('completed')}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'completed' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 'hover:bg-gray-200 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400'}`}
                >
                    Completed
                </button>
            </div>

            <div className="mt-auto">
                 <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Statistics</div>
                 <div className="flex justify-between text-sm mb-1">
                     <span className="text-gray-600 dark:text-gray-400">Completed</span>
                     <span className="font-bold">{tasks.filter(t => t.completed).length}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                     <span className="text-gray-600 dark:text-gray-400">Pending</span>
                     <span className="font-bold">{tasks.filter(t => !t.completed).length}</span>
                 </div>
            </div>
        </div>

        <div className="flex-1 flex flex-col p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-1 capitalize">{filter} Tasks</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">{new Date().toLocaleDateString([], {weekday: 'long', month: 'long', day: 'numeric'})}</p>
            </div>

            <form onSubmit={addTask} className="mb-6">
                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <ICONS.Plus className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Add a new task..." 
                            className="w-full bg-gray-100 dark:bg-[#2d2d2d] pl-10 pr-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                        />
                    </div>
                    <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="bg-gray-100 dark:bg-[#2d2d2d] px-4 py-3 rounded-xl outline-none text-sm font-medium cursor-pointer"
                    >
                        <option>Work</option>
                        <option>Personal</option>
                        <option>Urgent</option>
                    </select>
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-md">Add</button>
                </div>
            </form>

            <div className="flex-1 overflow-y-auto space-y-2">
                {filteredTasks.map(task => (
                    <div key={task.id} className="group flex items-center gap-3 p-3 bg-white dark:bg-[#2d2d2d] border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-md transition-all animate-in fade-in slide-in-from-bottom-2">
                        <button 
                            onClick={() => toggleTask(task.id)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 dark:border-gray-600 hover:border-green-500'}`}
                        >
                            {task.completed && <ICONS.Check size={14} />}
                        </button>
                        <div className="flex-1">
                            <div className={`text-sm font-medium transition-all ${task.completed ? 'text-gray-400 line-through' : 'text-gray-800 dark:text-white'}`}>
                                {task.text}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                                    task.category === 'Work' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 
                                    task.category === 'Personal' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                                    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                                }`}>
                                    {task.category}
                                </span>
                            </div>
                        </div>
                        <button 
                            onClick={() => deleteTask(task.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                        >
                            <ICONS.Trash2 size={16} />
                        </button>
                    </div>
                ))}
                {filteredTasks.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                        <ICONS.CheckSquare size={48} className="mb-2 opacity-20" />
                        <p className="text-sm">No tasks found</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default TasksApp;
