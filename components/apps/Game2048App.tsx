
import React, { useState, useEffect } from 'react';
import { ICONS } from '../../constants';
import { AppProps } from '../../types';
import { RotateCcw } from 'lucide-react';

const Game2048App: React.FC<AppProps> = () => {
  const [grid, setGrid] = useState<number[][]>([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Initialize game
  useEffect(() => {
    resetGame();
  }, []);

  // Keyboard Input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (gameOver) return;
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
            move(e.key);
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [grid, gameOver]);

  const resetGame = () => {
      let newGrid = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      newGrid = addRandomTile(addRandomTile(newGrid));
      setGrid(newGrid);
      setScore(0);
      setGameOver(false);
  };

  const addRandomTile = (currentGrid: number[][]) => {
      let emptyTiles = [];
      for(let r=0; r<4; r++) {
          for(let c=0; c<4; c++) {
              if(currentGrid[r][c] === 0) emptyTiles.push({r, c});
          }
      }
      if(emptyTiles.length === 0) return currentGrid;
      
      const {r, c} = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
      const newGrid = currentGrid.map(row => [...row]);
      newGrid[r][c] = Math.random() < 0.9 ? 2 : 4;
      return newGrid;
  };

  const move = (direction: string) => {
      let newGrid = grid.map(row => [...row]);
      let moved = false;
      let scoreGain = 0;

      const slide = (row: number[]) => {
          let arr = row.filter(val => val);
          let missing = 4 - arr.length;
          let zeros = Array(missing).fill(0);
          return arr.concat(zeros);
      };

      const combine = (row: number[]) => {
          for (let i = 0; i < 3; i++) {
              if (row[i] !== 0 && row[i] === row[i + 1]) {
                  row[i] *= 2;
                  row[i + 1] = 0;
                  scoreGain += row[i];
                  moved = true; // Combined means moved/changed
              }
          }
          return row;
      };

      // Helper to operate on rows
      const operate = (row: number[]) => {
          let oldRow = [...row];
          let newRow = slide(row);
          newRow = combine(newRow);
          newRow = slide(newRow);
          if (JSON.stringify(oldRow) !== JSON.stringify(newRow)) moved = true;
          return newRow;
      };

      if (direction === 'ArrowLeft') {
          newGrid = newGrid.map(row => operate(row));
      } else if (direction === 'ArrowRight') {
          newGrid = newGrid.map(row => operate(row.reverse()).reverse());
      } else if (direction === 'ArrowUp') {
          // Transpose, operate, transpose back
          for(let c=0; c<4; c++) {
              let col = [newGrid[0][c], newGrid[1][c], newGrid[2][c], newGrid[3][c]];
              col = operate(col);
              for(let r=0; r<4; r++) newGrid[r][c] = col[r];
          }
      } else if (direction === 'ArrowDown') {
          for(let c=0; c<4; c++) {
              let col = [newGrid[0][c], newGrid[1][c], newGrid[2][c], newGrid[3][c]];
              col = operate(col.reverse()).reverse();
              for(let r=0; r<4; r++) newGrid[r][c] = col[r];
          }
      }

      if (moved) {
          setGrid(addRandomTile(newGrid));
          setScore(prev => prev + scoreGain);
          checkGameOver(newGrid);
      }
  };

  const checkGameOver = (currentGrid: number[][]) => {
      // Check for any empty spots
      for(let r=0; r<4; r++) {
          for(let c=0; c<4; c++) {
              if(currentGrid[r][c] === 0) return;
          }
      }
      // Check for possible merges
      for(let r=0; r<4; r++) {
          for(let c=0; c<4; c++) {
              if(c < 3 && currentGrid[r][c] === currentGrid[r][c+1]) return;
              if(r < 3 && currentGrid[r][c] === currentGrid[r+1][c]) return;
          }
      }
      setGameOver(true);
  };

  const getTileColor = (val: number) => {
      switch(val) {
          case 2: return 'bg-[#eee4da] text-[#776e65]';
          case 4: return 'bg-[#ede0c8] text-[#776e65]';
          case 8: return 'bg-[#f2b179] text-white';
          case 16: return 'bg-[#f59563] text-white';
          case 32: return 'bg-[#f67c5f] text-white';
          case 64: return 'bg-[#f65e3b] text-white';
          case 128: return 'bg-[#edcf72] text-white';
          case 256: return 'bg-[#edcc61] text-white';
          case 512: return 'bg-[#edc850] text-white';
          case 1024: return 'bg-[#edc53f] text-white';
          case 2048: return 'bg-[#edc22e] text-white';
          default: return 'bg-[#3c3a32] text-white';
      }
  };

  return (
    <div className="flex flex-col h-full bg-[#faf8ef] text-[#776e65] p-6 items-center font-sans">
        <div className="w-full max-w-[320px] mb-6 flex justify-between items-center">
            <div className="text-4xl font-bold text-[#776e65]">2048</div>
            <div className="flex flex-col gap-2">
                <div className="bg-[#bbada0] text-white p-2 rounded text-center min-w-[80px]">
                    <div className="text-xs uppercase font-bold">Score</div>
                    <div className="text-lg font-bold">{score}</div>
                </div>
            </div>
        </div>
        
        <div className="relative bg-[#bbada0] p-3 rounded-lg cursor-default select-none">
            <div className="grid grid-cols-4 gap-3">
                {grid.map((row, r) => row.map((val, c) => (
                    <div 
                        key={`${r}-${c}`} 
                        className={`w-16 h-16 rounded flex items-center justify-center text-2xl font-bold transition-all duration-100 ${val === 0 ? 'bg-[#cdc1b4]' : getTileColor(val)}`}
                    >
                        {val !== 0 ? val : ''}
                    </div>
                )))}
            </div>

            {gameOver && (
                <div className="absolute inset-0 bg-[#eee4da]/80 flex flex-col items-center justify-center rounded-lg animate-in fade-in">
                    <div className="text-4xl font-bold text-[#776e65] mb-4">Game Over!</div>
                    <button 
                        onClick={resetGame}
                        className="px-6 py-3 bg-[#8f7a66] text-white font-bold rounded hover:bg-[#7f6a56] transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            )}
        </div>

        <div className="mt-6 text-sm text-[#776e65] font-medium text-center">
            Use <span className="font-bold">Arrow Keys</span> to move tiles.<br/>
            Merge numbers to reach <span className="font-bold">2048</span>!
        </div>
        
        <button onClick={resetGame} className="mt-4 p-2 hover:bg-gray-200 rounded-full transition-colors" title="Restart">
            <RotateCcw size={20} />
        </button>
    </div>
  );
};

export default Game2048App;
