import React, { useEffect, useState } from 'react';
import { MovedObject } from '../../types/GameTypes';
import './AnimatedObject.css';

interface AnimatedObjectProps {
  movedObject: MovedObject;
  cellSize: number;
}

const AnimatedObject: React.FC<AnimatedObjectProps> = ({ movedObject, cellSize }) => {
  const [positionStyle, setPositionStyle] = useState({
    top: movedObject.fromRow * cellSize,
    left: movedObject.fromCol * cellSize,
  });
  // Estado para o índice do frame (0, 1 ou 2)
  const [currentFrame, setCurrentFrame] = useState(1); // 1 é a pose idle

  // Determina a direção com base nas posições
  let direction: 'up' | 'down' | 'left' | 'right' = 'down';
  if (movedObject.toRow < movedObject.fromRow) direction = 'up';
  else if (movedObject.toRow > movedObject.fromRow) direction = 'down';
  else if (movedObject.toCol < movedObject.fromCol) direction = 'left';
  else if (movedObject.toCol > movedObject.fromCol) direction = 'right';

  // Define a linha do sprite com base na direção:
  // Usaremos: row 0 para "down/up", row 1 para "left" e row 2 para "right"
// Determina a linha do sprite com base na direção:
let spriteRow = 0;
if (direction === 'up') spriteRow = 3;  // Usamos a linha 3 para quando o jogador está indo para cima (de costas)
else if (direction === 'left') spriteRow = 1;
else if (direction === 'right') spriteRow = 2;
// Para "down" permanece spriteRow = 0 (de frente)

  // Para "up" você pode optar por usar a mesma da frente (row 0) ou definir outra linha se tiver

  // Inicia a transição da posição (com delay para o estado inicial ser renderizado)
  useEffect(() => {
    const delayToStart = 50; // pequeno delay para garantir o estado inicial
    const timer = setTimeout(() => {
      setPositionStyle({
        top: movedObject.toRow * cellSize,
        left: movedObject.toCol * cellSize,
      });
    }, delayToStart);
    return () => clearTimeout(timer);
  }, [movedObject, cellSize]);

  // Se o objeto for PLAYER, alterna os frames durante a transição
  useEffect(() => {
    if (movedObject.type !== 'PLAYER') return;
    // Inicia um intervalo que alterna os frames a cada 100ms
    const interval = setInterval(() => {
      setCurrentFrame(prev => (prev + 1) % 3); // ciclo: 0 -> 1 -> 2 -> 0 -> ...
    }, 100);
    // Após 300ms (ou o tempo da transição), para a alternância e força o idle (frame 1)
    const finishTimer = setTimeout(() => {
      clearInterval(interval);
      setCurrentFrame(1);
    }, 300);
    return () => {
      clearInterval(interval);
      clearTimeout(finishTimer);
    };
  }, [movedObject]);

  // Define o background com base no tipo do objeto
  let bgImage = "";
  let bgSize = "";
  let bgPosition = "";
  if (movedObject.type === 'PLAYER') {
    bgImage = "url('/assets/player-sprite.png')";
    bgSize = "600px 400px"; // Seu sprite original (384x256) escalado: 32px->50px (50/32 = 1.5625)
    // Cada frame tem 50px de largura; o frame é definido por currentFrame e a linha por spriteRow
    bgPosition = `-${currentFrame * cellSize}px -${spriteRow * cellSize}px`;
  } else if (movedObject.type === 'BOX') {
    bgImage = "url('/assets/box.png')";
    bgSize = "contain";
    bgPosition = "center";
  }

  return (
    <div
      className={`animated-object ${movedObject.type.toLowerCase()}`}
      style={{
        position: "absolute",
        width: cellSize,
        height: cellSize,
        top: positionStyle.top,
        left: positionStyle.left,
        transition: "top 0.28s, left 0.28s",
        background: `${bgImage} no-repeat`,
        backgroundSize: bgSize,
        backgroundPosition: bgPosition,
      }}
    />
  );
};

export default AnimatedObject;
