
import React, { useState, useEffect } from 'react';
import { ICONS } from '../../constants';
import { AppProps } from '../../types';

const MinesweeperApp: React.FC<AppProps> = () => {
  const ROWS = 9;
  const COLS = 9;
  const MINES = 10;

  type CellState = {
    isMine: boolean;
    isRevealed: boolean;
    isFlagged: boolean;
    neighborCount: number;
  };

  const [grid, setGrid] = useState<CellState[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [mineCount, setMineCount] = useState(MINES);
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    initializeGrid();
  }, []);

  useEffect(() => {
    let interval: any;
    if (timerActive && !gameOver && !win) {
      interval = setInterval(() => setTime(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, gameOver, win]);

  const initializeGrid = () => {
    let newGrid: CellState[][] = Array(ROWS).fill(null).map(() => 
      Array(COLS).fill(null).map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborCount: 0
      }))
    );

    // Place mines
    let minesPlaced = 0;
    while (minesPlaced < MINES) {
      const r = Math.floor(Math.random() * ROWS);
      const c = Math.floor(Math.random() * COLS);
      if (!newGrid[r][c].isMine) {
        newGrid[r][c].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate neighbors
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!newGrid[r][c].isMine) {
          let count = 0;
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              if (r + i >= 0 && r + i < ROWS && c + j >= 0 && c + j < COLS) {
                if (newGrid[r + i][c + j].isMine) count++;
              }
            }
          }
          newGrid[r][c].neighborCount = count;
        }
      }
    }

    setGrid(newGrid);
    setGameOver(false);
    setWin(false);
    setMineCount(MINES);
    setTime(0);
    setTimerActive(false);
  };

  const revealCell = (r: number, c: number) => {
    if (gameOver || win || grid[r][c].isFlagged || grid[r][c].isRevealed) return;

    if (!timerActive) setTimerActive(true);

    const newGrid = [...grid.map(row => [...row])];

    if (newGrid[r][c].isMine) {
      // Game Over
      newGrid[r][c].isRevealed = true;
      setGameOver(true);
      setTimerActive(false);
      // Reveal all mines
      newGrid.forEach((row, rowIndex) => row.forEach((cell, colIndex) => {
         if (cell.isMine) cell.isRevealed = true;
      }));
    } else {
      // Reveal flood fill
      const floodFill = (row: number, col: number) => {
        if (row < 0 || row >= ROWS || col < 0 || col >= COLS || newGrid[row][col].isRevealed || newGrid[row][col].isFlagged) return;
        
        newGrid[row][col].isRevealed = true;
        
        if (newGrid[row][col].neighborCount === 0) {
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              floodFill(row + i, col + j);
            }
          }
        }
      };
      floodFill(r, c);
      
      // Check win
      let unrevealedSafeCells = 0;
      newGrid.forEach(row => row.forEach(cell => {
         if (!cell.isMine && !cell.isRevealed) unrevealedSafeCells++;
      }));
      if (unrevealedSafeCells === 0) {
        setWin(true);
        setTimerActive(false);
      }
    }
    setGrid(newGrid);
  };

  const toggleFlag = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameOver || win || grid[r][c].isRevealed) return;

    const newGrid = [...grid.map(row => [...row])];
    newGrid[r][c].isFlagged = !newGrid[r][c].isFlagged;
    setGrid(newGrid);
    setMineCount(prev => newGrid[r][c].isFlagged ? prev - 1 : prev + 1);
  };

  const getCellColor = (count: number) => {
      switch(count) {
          case 1: return 'text-blue-600';
          case 2: return 'text-green-600';
          case 3: return 'text-red-600';
          case 4: return 'text-purple-600';
          case 5: return 'text-orange-600';
          default: return 'text-gray-800';
      }
  };

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] border-2 border-white border-r-gray-500 border-b-gray-500 p-1 select-none font-mono">
        {/* Header */}
        <div className="flex justify-between items-center p-2 mb-2 border-2 border-gray-500 border-r-white border-b-white bg-[#c0c0c0]">
            <div className="bg-black text-red-600 text-xl font-bold px-1 w-16 text-right font-mono border-2 border-gray-500 border-r-white border-b-white">
                {mineCount.toString().padStart(3, '0')}
            </div>
            
            <button 
                onClick={initializeGrid}
                className="w-10 h-10 border-2 border-white border-r-gray-500 border-b-gray-500 active:border-gray-500 active:border-r-white active:border-b-white flex items-center justify-center text-yellow-400 bg-[#c0c0c0]"
            >
                {gameOver ? <span className="text-2xl">😵</span> : win ? <span className="text-2xl">😎</span> : <ICONS.Smile size={24} className="text-yellow-500 fill-yellow-500" />}
            </button>

            <div className="bg-black text-red-600 text-xl font-bold px-1 w-16 text-right font-mono border-2 border-gray-500 border-r-white border-b-white">
                {time.toString().padStart(3, '0')}
            </div>
        </div>

        {/* Grid */}
        <div className="flex-1 flex items-center justify-center bg-[#808080] border-2 border-gray-500 border-r-white border-b-white p-1">
            <div className="grid grid-cols-9 gap-0">
                {grid.map((row, r) => row.map((cell, c) => (
                    <div 
                        key={`${r}-${c}`}
                        className={`w-8 h-8 border-2 flex items-center justify-center text-sm font-bold cursor-default
                            ${cell.isRevealed 
                                ? 'border-gray-400 border-t-gray-400 border-l-gray-400 bg-[#c0c0c0]' // Revealed look
                                : 'border-white border-r-gray-500 border-b-gray-500 bg-[#c0c0c0] hover:bg-gray-200' // Unrevealed 3D look
                            }
                        `}
                        onClick={() => revealCell(r, c)}
                        onContextMenu={(e) => toggleFlag(e, r, c)}
                    >
                        {cell.isRevealed ? (
                            cell.isMine ? <ICONS.Bomb size={20} className="text-black fill-black" /> : (cell.neighborCount > 0 ? <span className={getCellColor(cell.neighborCount)}>{cell.neighborCount}</span> : '')
                        ) : (
                            cell.isFlagged ? <ICONS.Flag size={18} className="text-red-600 fill-red-600" /> : ''
                        )}
                    </div>
                )))}
            </div>
        </div>
    </div>
  );
};

export default MinesweeperApp;
