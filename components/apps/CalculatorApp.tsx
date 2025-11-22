
import React, { useState } from 'react';
import { AppProps } from '../../types';
import { ICONS } from '../../constants';

type CalcMode = 'standard' | 'converter';
type ConversionType = 'length' | 'mass' | 'temperature';

const CalculatorApp: React.FC<AppProps> = ({ accentColor = 'blue' }) => {
  const [mode, setMode] = useState<CalcMode>('standard');
  
  // Standard State
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);

  // Converter State
  const [convType, setConvType] = useState<ConversionType>('length');
  const [inputVal, setInputVal] = useState('1');
  const [unitFrom, setUnitFrom] = useState('m');
  const [unitTo, setUnitTo] = useState('ft');

  // Standard Logic
  const handleNumber = (num: string) => {
    if (display === '0' || shouldResetDisplay) {
      setDisplay(num);
      setShouldResetDisplay(false);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOperator = (op: string) => {
    setShouldResetDisplay(true);
    setEquation(`${display} ${op} `);
  };

  const handleEqual = () => {
    try {
      const fullEq = equation + display;
      // eslint-disable-next-line no-eval
      const result = eval(fullEq.replace('×', '*').replace('÷', '/'));
      setDisplay(String(result));
      setEquation('');
      setShouldResetDisplay(true);
    } catch (e) {
      setDisplay('Error');
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
    setShouldResetDisplay(false);
  };

  // Converter Logic
  const convert = (val: number, type: ConversionType, from: string, to: string) => {
      if (from === to) return val;
      
      if (type === 'length') {
          // Base: meters
          const toMeters = (v: number, u: string) => {
              if (u === 'km') return v * 1000;
              if (u === 'cm') return v / 100;
              if (u === 'mm') return v / 1000;
              if (u === 'ft') return v * 0.3048;
              if (u === 'in') return v * 0.0254;
              return v;
          };
          const fromMeters = (v: number, u: string) => {
              if (u === 'km') return v / 1000;
              if (u === 'cm') return v * 100;
              if (u === 'mm') return v * 1000;
              if (u === 'ft') return v / 0.3048;
              if (u === 'in') return v / 0.0254;
              return v;
          };
          return fromMeters(toMeters(val, from), to);
      }
      
      if (type === 'mass') {
          // Base: kg
          const toKg = (v: number, u: string) => {
              if (u === 'g') return v / 1000;
              if (u === 'lb') return v * 0.453592;
              if (u === 'oz') return v * 0.0283495;
              return v;
          };
          const fromKg = (v: number, u: string) => {
              if (u === 'g') return v * 1000;
              if (u === 'lb') return v / 0.453592;
              if (u === 'oz') return v / 0.0283495;
              return v;
          };
          return fromKg(toKg(val, from), to);
      }

      if (type === 'temperature') {
          if (from === 'c' && to === 'f') return (val * 9/5) + 32;
          if (from === 'c' && to === 'k') return val + 273.15;
          if (from === 'f' && to === 'c') return (val - 32) * 5/9;
          if (from === 'f' && to === 'k') return (val - 32) * 5/9 + 273.15;
          if (from === 'k' && to === 'c') return val - 273.15;
          if (from === 'k' && to === 'f') return (val - 273.15) * 9/5 + 32;
      }

      return val;
  };
  
  const result = convert(Number(inputVal) || 0, convType, unitFrom, unitTo);

  return (
    <div className="h-full flex flex-col bg-[#f3f3f3] dark:bg-[#202020] text-gray-900 dark:text-white font-sans">
      {/* Menu */}
      <div className="h-10 flex items-center px-1 gap-1 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2d2d2d]">
          <button onClick={() => setMode('standard')} className={`flex-1 py-1 text-xs rounded-md font-medium transition-colors ${mode === 'standard' ? `bg-${accentColor}-100 text-${accentColor}-700 dark:bg-${accentColor}-900/30 dark:text-${accentColor}-300` : 'hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400'}`}>Standard</button>
          <button onClick={() => setMode('converter')} className={`flex-1 py-1 text-xs rounded-md font-medium transition-colors ${mode === 'converter' ? `bg-${accentColor}-100 text-${accentColor}-700 dark:bg-${accentColor}-900/30 dark:text-${accentColor}-300` : 'hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400'}`}>Converter</button>
      </div>

      {mode === 'standard' ? (
          <>
            <div className="flex-1 flex flex-col items-end justify-end p-4 pb-2">
                <div className="text-sm text-gray-500 dark:text-gray-400 h-6">{equation}</div>
                <div className="text-4xl font-semibold">{display}</div>
            </div>
            <div className="grid grid-cols-4 gap-1 p-1 bg-[#f3f3f3] dark:bg-[#202020]">
                {['CE', 'C', '%', '÷'].map(btn => (
                <button key={btn} onClick={() => btn === 'C' || btn === 'CE' ? handleClear() : handleOperator(btn)} className="h-12 bg-white dark:bg-[#333] hover:bg-gray-100 dark:hover:bg-[#444] rounded text-sm font-medium transition-colors">
                    {btn}
                </button>
                ))}
                {['7', '8', '9', '×'].map(btn => (
                <button key={btn} onClick={() => isNaN(Number(btn)) ? handleOperator(btn) : handleNumber(btn)} className={`h-12 rounded text-sm font-medium transition-colors ${isNaN(Number(btn)) ? 'bg-white dark:bg-[#333] hover:bg-gray-100 dark:hover:bg-[#444]' : 'bg-white dark:bg-[#333] hover:bg-gray-50 dark:hover:bg-[#444] font-bold'}`}>
                    {btn}
                </button>
                ))}
                {['4', '5', '6', '-'].map(btn => (
                <button key={btn} onClick={() => isNaN(Number(btn)) ? handleOperator(btn) : handleNumber(btn)} className={`h-12 rounded text-sm font-medium transition-colors ${isNaN(Number(btn)) ? 'bg-white dark:bg-[#333] hover:bg-gray-100 dark:hover:bg-[#444]' : 'bg-white dark:bg-[#333] hover:bg-gray-50 dark:hover:bg-[#444] font-bold'}`}>
                    {btn}
                </button>
                ))}
                {['1', '2', '3', '+'].map(btn => (
                <button key={btn} onClick={() => isNaN(Number(btn)) ? handleOperator(btn) : handleNumber(btn)} className={`h-12 rounded text-sm font-medium transition-colors ${isNaN(Number(btn)) ? 'bg-white dark:bg-[#333] hover:bg-gray-100 dark:hover:bg-[#444]' : 'bg-white dark:bg-[#333] hover:bg-gray-50 dark:hover:bg-[#444] font-bold'}`}>
                    {btn}
                </button>
                ))}
                <button onClick={() => handleNumber('0')} className="h-12 col-span-2 bg-white dark:bg-[#333] hover:bg-gray-50 dark:hover:bg-[#444] rounded text-sm font-bold transition-colors">0</button>
                <button onClick={() => handleNumber('.')} className="h-12 bg-white dark:bg-[#333] hover:bg-gray-50 dark:hover:bg-[#444] rounded text-sm font-bold transition-colors">.</button>
                <button onClick={handleEqual} className={`h-12 bg-${accentColor}-600 hover:bg-${accentColor}-700 text-white rounded text-sm font-bold transition-colors`}>=</button>
            </div>
          </>
      ) : (
          <div className="flex-1 p-6 flex flex-col gap-6">
              {/* Converter Controls */}
              <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 block">Type</label>
                  <select 
                    className="w-full p-2 bg-white dark:bg-[#333] border border-gray-300 dark:border-gray-600 rounded-md outline-none"
                    value={convType}
                    onChange={(e) => { setConvType(e.target.value as ConversionType); setUnitFrom(e.target.value === 'temperature' ? 'c' : 'm'); setUnitTo(e.target.value === 'temperature' ? 'f' : 'ft'); }}
                  >
                      <option value="length">Length</option>
                      <option value="mass">Weight and Mass</option>
                      <option value="temperature">Temperature</option>
                  </select>
              </div>

              <div>
                   <div className="flex gap-2 mb-2">
                       <input 
                           type="number" 
                           value={inputVal} 
                           onChange={(e) => setInputVal(e.target.value)} 
                           className="flex-1 p-2 bg-white dark:bg-[#333] border border-gray-300 dark:border-gray-600 rounded-md outline-none text-xl font-bold"
                       />
                       <select 
                           value={unitFrom} 
                           onChange={(e) => setUnitFrom(e.target.value)}
                           className="w-24 p-2 bg-white dark:bg-[#333] border border-gray-300 dark:border-gray-600 rounded-md outline-none text-sm"
                       >
                           {convType === 'length' && <><option value="m">Meters</option><option value="km">Kilometers</option><option value="cm">Centimeters</option><option value="mm">Millimeters</option><option value="ft">Feet</option><option value="in">Inches</option></>}
                           {convType === 'mass' && <><option value="kg">Kilograms</option><option value="g">Grams</option><option value="lb">Pounds</option><option value="oz">Ounces</option></>}
                           {convType === 'temperature' && <><option value="c">Celsius</option><option value="f">Fahrenheit</option><option value="k">Kelvin</option></>}
                       </select>
                   </div>
                   <div className="flex justify-center text-gray-400 my-2"><ICONS.ArrowDown size={20} /></div>
                   <div className="flex gap-2">
                       <div className="flex-1 p-2 bg-gray-100 dark:bg-[#2a2a2a] border border-transparent rounded-md text-xl font-bold text-gray-700 dark:text-gray-200 flex items-center overflow-hidden">
                           {Number(result.toFixed(4))}
                       </div>
                       <select 
                           value={unitTo} 
                           onChange={(e) => setUnitTo(e.target.value)}
                           className="w-24 p-2 bg-white dark:bg-[#333] border border-gray-300 dark:border-gray-600 rounded-md outline-none text-sm"
                       >
                           {convType === 'length' && <><option value="m">Meters</option><option value="km">Kilometers</option><option value="cm">Centimeters</option><option value="mm">Millimeters</option><option value="ft">Feet</option><option value="in">Inches</option></>}
                           {convType === 'mass' && <><option value="kg">Kilograms</option><option value="g">Grams</option><option value="lb">Pounds</option><option value="oz">Ounces</option></>}
                           {convType === 'temperature' && <><option value="c">Celsius</option><option value="f">Fahrenheit</option><option value="k">Kelvin</option></>}
                       </select>
                   </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default CalculatorApp;
