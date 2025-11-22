
import React, { useState } from 'react';
import { ICONS } from '../../constants';
import { AppProps } from '../../types';

const WeatherApp: React.FC<AppProps> = () => {
  const [location, setLocation] = useState('San Francisco');
  const [temp, setTemp] = useState(72);
  const [condition, setCondition] = useState('Partly Cloudy');

  const forecasts = [
      { day: 'Now', temp: 72, icon: ICONS.CloudSun },
      { day: '1 PM', temp: 74, icon: ICONS.Sun },
      { day: '2 PM', temp: 75, icon: ICONS.Sun },
      { day: '3 PM', temp: 73, icon: ICONS.CloudSun },
      { day: '4 PM', temp: 70, icon: ICONS.CloudRain },
      { day: '5 PM', temp: 68, icon: ICONS.CloudLightning },
  ];

  const weekForecast = [
      { day: 'Today', low: 65, high: 75, icon: ICONS.CloudSun },
      { day: 'Wed', low: 62, high: 70, icon: ICONS.CloudRain },
      { day: 'Thu', low: 60, high: 68, icon: ICONS.CloudLightning },
      { day: 'Fri', low: 64, high: 72, icon: ICONS.Sun },
      { day: 'Sat', low: 66, high: 78, icon: ICONS.Sun },
      { day: 'Sun', low: 65, high: 74, icon: ICONS.CloudSun },
  ];

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-blue-400 to-blue-600 text-white p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2 text-sm font-medium opacity-90 hover:opacity-100 cursor-pointer bg-white/10 px-3 py-1.5 rounded-full transition-colors">
                <ICONS.MapPin size={16} />
                <span>{location}</span>
                <ICONS.ChevronDown size={14} />
            </div>
            <div className="flex gap-2">
                <button className="p-2 hover:bg-white/10 rounded-full transition-colors"><ICONS.Plus size={20} /></button>
                <button className="p-2 hover:bg-white/10 rounded-full transition-colors"><ICONS.MoreVertical size={20} /></button>
            </div>
        </div>

        {/* Current Weather */}
        <div className="flex flex-col items-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-6xl font-bold mb-2">{temp}°</div>
            <div className="text-lg font-medium mb-4">{condition}</div>
            <div className="flex gap-6 text-sm opacity-80">
                <span className="flex items-center gap-1">H:75° L:65°</span>
                <span className="flex items-center gap-1"><ICONS.Wind size={14} /> 8 mph</span>
                <span className="flex items-center gap-1"><ICONS.Droplets size={14} /> 12%</span>
            </div>
        </div>

        {/* Hourly Forecast */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-6 border border-white/10">
            <div className="text-xs font-semibold uppercase opacity-70 mb-4 flex items-center gap-2">
                <ICONS.Clock size={14} /> Hourly Forecast
            </div>
            <div className="flex justify-between overflow-x-auto pb-2 scrollbar-hide">
                {forecasts.map((f, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 min-w-[60px]">
                        <span className="text-xs font-medium">{f.day}</span>
                        <f.icon size={24} className="my-1" />
                        <span className="text-lg font-bold">{f.temp}°</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Weekly Forecast */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex-1">
            <div className="text-xs font-semibold uppercase opacity-70 mb-4 flex items-center gap-2">
                <ICONS.Calendar size={14} /> 7-Day Forecast
            </div>
            <div className="flex flex-col gap-4">
                {weekForecast.map((f, i) => (
                    <div key={i} className="flex items-center justify-between">
                        <span className="text-sm font-medium w-12">{f.day}</span>
                        <div className="flex-1 flex justify-center"><f.icon size={20} /></div>
                        <div className="flex items-center gap-4 w-32 justify-end">
                            <span className="text-sm opacity-60">{f.low}°</span>
                            <div className="w-16 h-1 bg-black/20 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-blue-300 to-yellow-300 w-full opacity-80"></div>
                            </div>
                            <span className="text-sm font-bold">{f.high}°</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default WeatherApp;
