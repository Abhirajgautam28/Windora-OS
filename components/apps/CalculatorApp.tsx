
import React, { useState } from 'react';
import { AppProps } from '../../types';

const CalculatorApp: React.FC<AppProps> = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);

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

  return (
    <div className="h-full flex flex-col bg-[#f3f3f3] text-gray-900">
      <div className="flex-1 flex flex-col items-end justify-end p-4 pb-2">
        <div className="text-sm text-gray-500 h-6">{equation}</div>
        <div className="text-4xl font-semibold">{display}</div>
      </div>
      <div className="grid grid-cols-4 gap-1 p-1 bg-[#f3f3f3]">
        {['CE', 'C', '%', '÷'].map(btn => (
          <button key={btn} onClick={() => btn === 'C' || btn === 'CE' ? handleClear() : handleOperator(btn)} className="h-12 bg-white hover:bg-gray-100 rounded text-sm font-medium transition-colors">
            {btn}
          </button>
        ))}
        {['7', '8', '9', '×'].map(btn => (
          <button key={btn} onClick={() => isNaN(Number(btn)) ? handleOperator(btn) : handleNumber(btn)} className={`h-12 rounded text-sm font-medium transition-colors ${isNaN(Number(btn)) ? 'bg-white hover:bg-gray-100' : 'bg-white hover:bg-gray-50 font-bold'}`}>
            {btn}
          </button>
        ))}
        {['4', '5', '6', '-'].map(btn => (
          <button key={btn} onClick={() => isNaN(Number(btn)) ? handleOperator(btn) : handleNumber(btn)} className={`h-12 rounded text-sm font-medium transition-colors ${isNaN(Number(btn)) ? 'bg-white hover:bg-gray-100' : 'bg-white hover:bg-gray-50 font-bold'}`}>
            {btn}
          </button>
        ))}
        {['1', '2', '3', '+'].map(btn => (
          <button key={btn} onClick={() => isNaN(Number(btn)) ? handleOperator(btn) : handleNumber(btn)} className={`h-12 rounded text-sm font-medium transition-colors ${isNaN(Number(btn)) ? 'bg-white hover:bg-gray-100' : 'bg-white hover:bg-gray-50 font-bold'}`}>
            {btn}
          </button>
        ))}
        <button onClick={() => handleNumber('0')} className="h-12 col-span-2 bg-white hover:bg-gray-50 rounded text-sm font-bold transition-colors">0</button>
        <button onClick={() => handleNumber('.')} className="h-12 bg-white hover:bg-gray-50 rounded text-sm font-bold transition-colors">.</button>
        <button onClick={handleEqual} className="h-12 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-bold transition-colors">=</button>
      </div>
    </div>
  );
};

export default CalculatorApp;
