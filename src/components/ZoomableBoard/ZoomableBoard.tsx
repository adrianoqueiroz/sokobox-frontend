import React, { useRef, useState } from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Board from '../Board/Board';
import { Direction, Position } from '../../types/GameTypes';

interface ZoomableBoardProps {
  onSwipe: (direction: Direction) => void;
  terrain: any[][];
  objects: any[][];
  animatingObjects: any[];
  playerDirection: Direction;
  playerPosition: Position;
  skinIndex: number;
}

const ZoomableBoard: React.FC<ZoomableBoardProps> = ({ onSwipe, ...boardProps }) => {
  const transformRef = useRef<any>(null);
  const [currentScale, setCurrentScale] = useState(1);

  return (
    <TransformWrapper
      ref={transformRef}
      initialScale={1}
      minScale={0.5}
      maxScale={2}
      centerOnInit
      centerZoomedOut={false}
      wheel={{ disabled: true }}
      pinch={{ step: 0.05 }}
      doubleClick={{ disabled: true }}
      panning={{ disabled: true }}
      onZoomStop={(ref) => setCurrentScale(ref.state.scale)}
    >
      <TransformComponent>
        <div className="zoom-container">
          <Board {...boardProps} />
        </div>
      </TransformComponent>
    </TransformWrapper>
  );
};

export default ZoomableBoard;
