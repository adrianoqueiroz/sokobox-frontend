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

  // Só aplicamos a lógica de direção se for o player
  let bgImage = "";
  let bgSize = "";
  let bgPosition = "";

  if (movedObject.type === 'PLAYER') {
    // Determina a direção com base nas posições (apenas para o player)
    let direction: 'up' | 'down' | 'left' | 'right' = 'down';
    if (movedObject.toRow < movedObject.fromRow) {
      direction = 'up';
    } else if (movedObject.toRow > movedObject.fromRow) {
      direction = 'down';
    } else if (movedObject.toCol < movedObject.fromCol) {
      direction = 'left';
    } else if (movedObject.toCol > movedObject.fromCol) {
      direction = 'right';
    }
    
    // Mapeia a direção para a posição do frame no sprite do player
    switch (direction) {
      case 'up':
        bgPosition = "0 -150px";
        break;
      case 'left':
        bgPosition = "0 -50px";
        break;
      case 'right':
        bgPosition = "0 -100px";
        break;
      case 'down':
      default:
        bgPosition = "0 0";
    }
    
    bgImage = "url('/assets/player-sprite.png')";
    bgSize = "600px 400px"; // escala do sprite (384x256 -> 600x400 para frames 50x50)
  } else if (movedObject.type === 'BOX') {
    // Para a caixa, usa uma imagem estática da caixa
    bgImage = "url('/assets/box.png')";
    bgSize = "contain";
    bgPosition = "center";
  }

  useEffect(() => {
    const delayToStart = 50; // delay para garantir o estado inicial
    const transitionDuration = 300; // duração da transição (ms)

    // Define a posição inicial
    setPositionStyle({
      top: movedObject.fromRow * cellSize,
      left: movedObject.fromCol * cellSize,
    });

    // Depois de um pequeno delay, inicia a transição para a posição final
    const timer = setTimeout(() => {
      setPositionStyle({
        top: movedObject.toRow * cellSize,
        left: movedObject.toCol * cellSize,
      });
    }, delayToStart);

    return () => clearTimeout(timer);
  }, [movedObject, cellSize]);

  return (
    <div
      className={`animated-object ${movedObject.type.toLowerCase()}`}
      style={{
        position: "absolute",
        width: cellSize,
        height: cellSize,
        top: positionStyle.top,
        left: positionStyle.left,
        transition: "top 0.3s, left 0.3s",
        background: `${bgImage} no-repeat`,
        backgroundSize: bgSize,
        backgroundPosition: bgPosition,
      }}
    />
  );
};

export default AnimatedObject;
