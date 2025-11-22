
import React, { useState, useEffect, useRef } from 'react';
import { ICONS } from '../../constants';
import { AppProps } from '../../types';

const SnakeApp: React.FC<AppProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Game Constants
  const GRID_SIZE = 20;
  const TILE_COUNT = 20;
  const SPEED = 100;

  // Game State Refs (to avoid closure stale state in interval)
  const snakeRef = useRef<{x: number, y: number}[]>([{x: 10, y: 10}]);
  const foodRef = useRef<{x: number, y: number}>({x: 15, y: 15});
  const dirRef = useRef<{x: number, y: number}>({x: 0, y: 0});
  const nextDirRef = useRef<{x: number, y: number}>({x: 0, y: 0});
  const intervalRef = useRef<any>(null);

  const resetGame = () => {
    snakeRef.current = [{x: 10, y: 10}];
    foodRef.current = {x: 15, y: 15};
    dirRef.current = {x: 1, y: 0}; // Start moving right
    nextDirRef.current = {x: 1, y: 0};
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setGameStarted(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(gameLoop, SPEED);
  };

  const spawnFood = () => {
    const x = Math.floor(Math.random() * TILE_COUNT);
    const y = Math.floor(Math.random() * TILE_COUNT);
    // Ensure food doesn't spawn on snake
    for (let part of snakeRef.current) {
        if (part.x === x && part.y === y) {
            return spawnFood();
        }
    }
    foodRef.current = {x, y};
  };

  const gameLoop = () => {
    const snake = snakeRef.current;
    const head = { ...snake[0] };
    
    // Update direction
    dirRef.current = nextDirRef.current;
    
    head.x += dirRef.current.x;
    head.y += dirRef.current.y;

    // Wrap around logic (optional, doing wall collision for now)
    if (head.x < 0 || head.x >= TILE_COUNT || head.y < 0 || head.y >= TILE_COUNT) {
       setGameOver(true);
       clearInterval(intervalRef.current);
       return;
    }

    // Self collision
    for (let part of snake) {
        if (head.x === part.x && head.y === part.y) {
            setGameOver(true);
            clearInterval(intervalRef.current);
            return;
        }
    }

    snake.unshift(head);

    // Check food
    if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        setScore(s => {
            const newScore = s + 10;
            setHighScore(h => Math.max(h, newScore));
            return newScore;
        });
        spawnFood();
    } else {
        snake.pop();
    }

    draw();
  };

  const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear
      ctx.fillStyle = '#202020';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Food
      ctx.fillStyle = '#ff4444';
      ctx.fillRect(foodRef.current.x * GRID_SIZE, foodRef.current.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);

      // Draw Snake
      ctx.fillStyle = '#4ade80';
      snakeRef.current.forEach((part, i) => {
          if (i === 0) ctx.fillStyle = '#22c55e'; // Head color
          else ctx.fillStyle = '#4ade80';
          ctx.fillRect(part.x * GRID_SIZE, part.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
      });
  };

  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          if (!gameStarted || gameOver) return;
          
          switch(e.key) {
              case 'ArrowUp': 
                  if (dirRef.current.y !== 1) nextDirRef.current = {x: 0, y: -1};
                  break;
              case 'ArrowDown': 
                  if (dirRef.current.y !== -1) nextDirRef.current = {x: 0, y: 1};
                  break;
              case 'ArrowLeft': 
                  if (dirRef.current.x !== 1) nextDirRef.current = {x: -1, y: 0};
                  break;
              case 'ArrowRight': 
                  if (dirRef.current.x !== -1) nextDirRef.current = {x: 1, y: 0};
                  break;
              case ' ':
                  setIsPaused(p => !p);
                  break;
          }
      };
      
      window.addEventListener('keydown', handleKeyDown);
      return () => {
          window.removeEventListener('keydown', handleKeyDown);
          if (intervalRef.current) clearInterval(intervalRef.current);
      };
  }, [gameStarted, gameOver]);

  useEffect(() => {
      if (isPaused) {
          clearInterval(intervalRef.current);
      } else if (gameStarted && !gameOver) {
          intervalRef.current = setInterval(gameLoop, SPEED);
      }
  }, [isPaused]);

  return (
    <div className="flex flex-col h-full bg-[#2d2d2d] text-white items-center justify-center font-mono">
        <div className="mb-4 text-center">
            <h2 className="text-2xl font-bold text-green-400 flex items-center gap-2 justify-center">
                <ICONS.Gamepad2 /> Retro Snake
            </h2>
            <div className="flex gap-6 mt-2 text-sm">
                <span>Score: {score}</span>
                <span>High Score: {highScore}</span>
            </div>
        </div>

        <div className="relative border-4 border-gray-600 rounded-lg shadow-2xl bg-[#202020]">
            <canvas 
                ref={canvasRef}
                width={400}
                height={400}
                className="block"
            />
            
            {(!gameStarted || gameOver || isPaused) && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center p-4 backdrop-blur-sm">
                    {gameOver ? (
                        <>
                            <div className="text-red-500 text-3xl font-bold mb-2">GAME OVER</div>
                            <div className="text-xl mb-4">Score: {score}</div>
                        </>
                    ) : isPaused && gameStarted ? (
                        <div className="text-yellow-400 text-3xl font-bold mb-4">PAUSED</div>
                    ) : (
                        <div className="text-green-400 text-xl font-bold mb-4">Ready?</div>
                    )}
                    
                    <button 
                        onClick={isPaused && gameStarted ? () => setIsPaused(false) : resetGame}
                        className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded-full transition-transform hover:scale-105 active:scale-95"
                    >
                        {gameOver ? 'Try Again' : isPaused && gameStarted ? 'Resume' : 'Start Game'}
                    </button>
                    
                    <div className="mt-6 text-xs text-gray-400">
                        Use Arrow Keys to move<br/>Space to pause
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default SnakeApp;
