import React, { useEffect, useState } from 'react'
import { Position, ObjectTile } from '../../types/GameTypes'
import './GameObject.css'

interface GameObjectProps {
  position: Position
  cellSize: number
  objectType: ObjectTile
  initialPosition?: Position
  transitionDuration?: number
  onTransitionEnd?: () => void
}

const GameObject: React.FC<GameObjectProps> = ({
  position,
  cellSize,
  objectType,
  initialPosition,
  transitionDuration = 240,
  onTransitionEnd,
}) => {
  // Se initialPosition existir, inicia com ela; caso contrário, inicia na posição final.
  const [currentPosition, setCurrentPosition] = useState<Position>(initialPosition || position);

  useEffect(() => {
    if (initialPosition) {
      // Garante que a atualização ocorra no próximo frame, disparando a transição
      requestAnimationFrame(() => {
        setCurrentPosition(position);
      });
    }
  }, [initialPosition, position]);

  const handleTransitionEnd = () => onTransitionEnd && onTransitionEnd();

  return (
    <div
      className={`game-object ${objectType.type.toLowerCase()}`}
      style={{
        position: 'absolute',
        width: cellSize,
        height: cellSize,
        top: `${currentPosition.row * cellSize}px`,
        left: `${currentPosition.col * cellSize}px`,
        transition: `top ${transitionDuration}ms ease-in-out, left ${transitionDuration}ms ease-in-out`,
      }}
      onTransitionEnd={handleTransitionEnd}
    />
  );
};

export default GameObject;