import React, { useEffect, useState } from 'react'
import { Position, ObjectTile } from '../../types/GameTypes'
import './GameObject.css'

interface GameObjectProps {
  position: Position
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
  const startPos = initialPosition ? initialPosition : position;
  const [style, setStyle] = useState({
    top: startPos.row * cellSize,
    left: startPos.col * cellSize,
    transition: `top ${transitionDuration}ms ease, left ${transitionDuration}ms ease`
  });

  useEffect(() => {

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
