import React, { useLayoutEffect, useState } from 'react';

interface Coordinates {
  row: number;
  col: number;
}

interface MoverProps {
  imageUrl: string;
  from: Coordinates;
  to: Coordinates;
  cellSize: number;
  useTransition?: boolean; // se true, aplica transição; se false, muda imediatamente
  transitionDuration?: number; // duração da transição em ms (default: 300)
}

const Mover: React.FC<MoverProps> = ({
  imageUrl,
  from,
  to,
  cellSize,
  useTransition = true,
  transitionDuration = 300,
}) => {
  const round = (value: number) => Math.round(value);

  // Estado para a posição atual
  const [position, setPosition] = useState({
    top: round(from.row * cellSize),
    left: round(from.col * cellSize),
  });

  useLayoutEffect(() => {
    if (useTransition) {
      // Usamos requestAnimationFrame para garantir que a posição inicial seja pintada antes de atualizar
      requestAnimationFrame(() => {
        setPosition({
          top: round(to.row * cellSize),
          left: round(to.col * cellSize),
        });
      });
    } else {
      setPosition({
        top: round(to.row * cellSize),
        left: round(to.col * cellSize),
      });
    }
  }, [to, cellSize, useTransition]);

  const transitionStyle = useTransition
    ? { transition: `top ${transitionDuration}ms ease-in-out, left ${transitionDuration}ms ease-in-out` }
    : {};

  return (
    <div
      style={{
        position: 'absolute',
        width: cellSize,
        height: cellSize,
        top: `${position.top}px`,
        left: `${position.left}px`,
        background: `url(${imageUrl}) no-repeat`,
        backgroundSize: '100% 100%',
        zIndex: 10,
        ...transitionStyle,
      }}
    />
  );
};

export default Mover;
