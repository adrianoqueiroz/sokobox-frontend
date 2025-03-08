import React, { useEffect, useState } from 'react';

interface PlayerProps {
  row: number;
  col: number;
  direction: 'up' | 'down' | 'left' | 'right';
  cellSize: number;
}

const Player: React.FC<PlayerProps> = ({ row, col, direction, cellSize }) => {
  // Estado para o índice do frame (0, 1 ou 2) – 1 é o idle (parado)
  const [currentFrame, setCurrentFrame] = useState(1);

  // Determina a linha do sprite com base na direção:
  // 0: de frente (down), 1: left, 2: right, 3: de costas (up)
  let spriteRow = 0;
  if (direction === 'up') spriteRow = 3;
  else if (direction === 'left') spriteRow = 1;
  else if (direction === 'right') spriteRow = 2;
  // 'down' permanece 0

  // Calcula o background-position com base no frame atual.
  // O frame idle é o de índice 1.
  const bgPosition = `-${currentFrame * cellSize}px -${spriteRow * cellSize}px`;

  // Alterna os frames durante a transição
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame(prev => (prev + 1) % 3);
    }, 50);
    const timer = setTimeout(() => {
      clearInterval(interval);
    //   setCurrentFrame(1); // força o idle no final
    }, 250);
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [row, col, direction]);

  return (
    <div
      style={{
        position: 'absolute',
        width: cellSize,
        height: cellSize,
        top: `${row * cellSize}px`,
        left: `${col * cellSize}px`,
        transition: 'top 0.2s ease-in-out, left 0.2s ease-in-out',
        background: "url('/assets/player-sprite.png') no-repeat",
        backgroundSize: '600px 400px',
        backgroundPosition: bgPosition,
        zIndex: 3,
      }}
    />
  );
};

export default Player;
