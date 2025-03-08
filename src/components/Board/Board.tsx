import React from 'react';
import { TerrainType, ObjectType, MovedObject, MoveDirection } from '../../types/GameTypes';
import Player from '../Player/Player';
import MovingObject from '../MovingObject/MovingObject';
import FixedObject from '../FixedObject/FixedObject';
import './Board.css';

const CELL_SIZE = 50;

interface BoardProps {
  terrain: TerrainType[][];
  objects: ObjectType[][];
  animatingObjects: MovedObject[];
  playerDirection: 'up' | 'down' | 'left' | 'right';
  playerRow: number;
  playerCol: number;
}

const Board: React.FC<BoardProps> = ({
  terrain,
  objects,
  animatingObjects,
  playerDirection,
  playerRow,
  playerCol,
}) => {
  if (!terrain.length || !terrain[0].length) {
    return <div className="board">Tabuleiro vazio ou inválido</div>;
  }

  return (
    <div
      className="board"
      style={{
        position: 'relative',
        width: terrain[0].length * CELL_SIZE,
        height: terrain.length * CELL_SIZE,
      }}
    >
      {/* Camada 1: Terreno */}
      {terrain.map((row, rowIndex) => (
        <div key={`terrain-${rowIndex}`} className="board-row">
          {row.map((terrainType, colIndex) => (
            <div
              key={`terrain-cell-${rowIndex}-${colIndex}`}
              className="cell"
              style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                position: 'relative',
              }}
            >
              <div className={`cell-terrain terrain-${terrainType.toLowerCase()}`} />
              {/* Camada de destino: se for DESTINATION */}
              {terrainType === 'DESTINATION' && (
                <div
                  className={`destination-slot ${objects[rowIndex][colIndex] === 'BOX' ? 'box-on-top' : ''}`}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                  }}
                />
              )}
            </div>
          ))}
        </div>
      ))}

      {/* Camada 2: Objetos estáticos (FixedObject) – renderizados quando não estão animados */}
      {objects.map((row, rowIndex) =>
        row.map((objectType, colIndex) => {
          if (objectType === 'NONE' || objectType === 'PLAYER') return null;
          // Verifica se há um objeto animado nessa célula
          const isAnimating = animatingObjects.some(
            (anim) => anim.toRow === rowIndex && anim.toCol === colIndex
          );
          if (!isAnimating) {
            const imageUrl = objectType === 'BOX' ? '/assets/box.png' : '';
            return (
              <FixedObject
                key={`fixed-${rowIndex}-${colIndex}`}
                imageUrl={imageUrl}
                cellSize={CELL_SIZE}
                from={{ row: rowIndex, col: colIndex }}
              />
            );
          }
          return null;
        })
      )}

      {/* Camada 3: Objetos animados */}
      {animatingObjects.map((obj, index) =>
        obj.type !== 'PLAYER' ? (
          <MovingObject
            key={`anim-${index}`}
            from={{ row: obj.fromRow, col: obj.fromCol }}
            to={{ row: obj.toRow, col: obj.toCol }}
            cellSize={CELL_SIZE}
            imageUrl={obj.type === 'BOX' ? '/assets/box.png' : ''}
            useTransition={true}
            transitionDuration={200}
          />
        ) : null
      )}

      {/* Camada 4: Player */}
      <Player
        row={playerRow}
        col={playerCol}
        direction={playerDirection}
        cellSize={CELL_SIZE}
      />
    </div>
  );
};

export default Board;
