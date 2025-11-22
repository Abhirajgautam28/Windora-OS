
import React, { useState } from 'react';
import { ICONS } from '../../constants';
import { AppProps } from '../../types';

const TicTacToeApp: React.FC<AppProps> = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [scores, setScores] = useState({ x: 0, o: 0, draw: 0 });

  const calculateWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (i: number) => {
    if (calculateWinner(board) || board[i]) return;
    const newBoard = [...board];
    newBoard[i] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
    
    const winner = calculateWinner(newBoard);
    if (winner) {
        setScores(s => ({ ...s, [winner.toLowerCase()]: s[winner.toLowerCase() as keyof typeof s] + 1 }));
    } else if (!newBoard.includes(null)) {
        setScores(s => ({ ...s, draw: s.draw + 1 }));
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  };

  const winner = calculateWinner(board);
  const isDraw = !winner && !board.includes(null);
  const status = winner 
    ? `Winner: ${winner}` 
    : isDraw 
      ? "Draw!" 
      : `Next player: ${xIsNext ? 'X' : 'O'}`;

  return (
    <div className="flex flex-col h-full bg-[#f0f0f0] dark:bg-[#1e1e1e] text-gray-900 dark:text-white font-sans items-center justify-center p-4">
        <div className="mb-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
                <ICONS.Gamepad2 size={32} className="text-blue-500" />
                <h1 className="text-2xl font-bold">Tic Tac Toe</h1>
            </div>
            <div className="flex gap-4 text-sm font-medium bg-white dark:bg-[#2d2d2d] px-4 py-2 rounded-full shadow-sm">
                <span className="text-blue-500">X: {scores.x}</span>
                <span className="text-gray-400">|</span>
                <span className="text-red-500">O: {scores.o}</span>
                <span className="text-gray-400">|</span>
                <span className="text-gray-500">Draws: {scores.draw}</span>
            </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-8">
            {board.map((square, i) => (
                <button
                    key={i}
                    className={`w-20 h-20 bg-white dark:bg-[#2d2d2d] rounded-xl text-4xl font-bold shadow-sm hover:shadow-md transition-all transform active:scale-95 flex items-center justify-center
                        ${square === 'X' ? 'text-blue-500' : square === 'O' ? 'text-red-500' : 'hover:bg-gray-50 dark:hover:bg-[#3d3d3d]'}
                    `}
                    onClick={() => handleClick(i)}
                    disabled={!!square || !!winner}
                >
                    {square === 'X' && <ICONS.XIcon size={40} />}
                    {square === 'O' && <ICONS.Circle size={36} />}
                </button>
            ))}
        </div>

        <div className="text-xl font-medium mb-6 h-8">
            {status}
        </div>

        <button 
            onClick={resetGame}
            className="px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors shadow-lg"
        >
            New Game
        </button>
    </div>
  );
};

export default TicTacToeApp;
