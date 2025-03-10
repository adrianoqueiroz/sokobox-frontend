// src/components/GameObject/GameObject.tsx
import React, { useEffect, useState } from 'react'
import { Position, ObjectTile } from '../../types/GameTypes'
import './GameObject.css'

interface GameObjectProps {
  // 'position' é a posição final (já atualizada) do objeto
  position: Position
  // Se definida, 'initialPosition' é a posição de onde o objeto começou a se mover
  initialPosition?: Position
  cellSize: number
  objectType: ObjectTile
  transitionDuration?: number
  onTransitionEnd?: () => void
}

const GameObject: React.FC<GameObjectProps> = ({
  position,
  initialPosition,
  cellSize,
  objectType,
  transitionDuration = 240,
  onTransitionEnd,
}) => {
  // Se houver initialPosition, inicia a animação a partir dela; senão, usa a posição final
  const startPos = initialPosition ? initialPosition : position;
  const [style, setStyle] = useState({
    top: startPos.row * cellSize,
    left: startPos.col * cellSize,
    transition: `top ${transitionDuration}ms ease, left ${transitionDuration}ms ease`
  });

  useEffect(() => {
    // Se houver um ponto inicial definido, dispara a transição para a posição final
    if (initialPosition) {
      requestAnimationFrame(() => {
        setStyle({
          top: position.row * cellSize,
          left: position.col * cellSize,
          transition: `top ${transitionDuration}ms ease, left ${transitionDuration}ms ease`
        });
      });
    }
  }, [initialPosition, position, cellSize, transitionDuration]);

  const handleTransitionEnd = () => {
    if (onTransitionEnd) {
      onTransitionEnd();
    }
  };

  return (
    <div
      className={`game-object ${objectType.type.toLowerCase()}`}
      style={{
        position: 'absolute',
        width: cellSize,
        height: cellSize,
        ...style,
      }}
      onTransitionEnd={handleTransitionEnd}
    />
  );
};

export default GameObject;
