import React, { useMemo } from 'react';
import {
  TerrainTile,
  ObjectTile,
  MoveRecord,
  MovedObject,
  Direction,
  Position,
  TerrainType,
  ObjectType
} from '../../types/GameTypes';
import Player from '../Player/Player';
import GameObject from '../GameObject/GameObject';
import './Board.css';

const CELL_SIZE = 50;

interface BoardProps {
  terrain: TerrainTile[];
  objects: ObjectTile[];
  moveRecords: MoveRecord[];
  skinIndex: number;
}

const getInitialPositionForTile = (
  tile: ObjectTile,
  moveRecords: MoveRecord[] = []
): Position | undefined => {
  for (let i = moveRecords.length - 1; i >= 0; i--) {
    const record = moveRecords[i];
    if (record.movedObjects && record.movedObjects.length > 0) {
      const move = record.movedObjects.find(mov => mov.id === tile.id);
      if (move) return move.initialPosition;
    }
  }
  return undefined;
};

const Board: React.FC<BoardProps> = ({
  terrain,
  objects,
  moveRecords,
  skinIndex
}) => {
 
  if (!terrain || terrain.length === 0) {
    return <div className="board">Tabuleiro vazio ou inválido</div>;
  }

  const minRow = Math.min(...terrain.map(tile => tile.position.row));
  const maxRow = Math.max(...terrain.map(tile => tile.position.row));
  const minCol = Math.min(...terrain.map(tile => tile.position.col));
  const maxCol = Math.max(...terrain.map(tile => tile.position.col));
  
  const boardWidth = (maxCol - minCol + 1) * CELL_SIZE;
  const boardHeight = (maxRow - minRow + 1) * CELL_SIZE;
  
  const terrainRows: TerrainTile[][] = [];
  for (let row = 0; row <= maxRow; row++) {
    terrainRows[row] = terrain
      .filter(tile => tile.position.row === row)
      .sort((a, b) => a.position.col - b.position.col);
  }
  
  React.useEffect(() => {
    console.log("moveRecords atualizados:", moveRecords);
  }, [moveRecords]);
  

  return (
    <div
      className="board"
      style={{
        position: 'relative',
        width: boardWidth,
        height: boardHeight,
      }}
    >
      {/* Camada 1: Terreno */}
      {terrainRows.map((rowTiles, rowIndex) => (
        <div key={`terrain-row-${rowIndex}`} className="board-row">
          {rowTiles.map((tile) => (
            <div
              key={`terrain-cell-${tile.position.row}-${tile.position.col}`}
              className="cell"
              style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                position: 'relative',
              }}
            >
              <div className={`cell-terrain terrain-${tile.type.toLowerCase()}`} />
              {tile.type === TerrainType.DESTINATION && (
                <div
                  className={`destination-slot ${
                    objects.find(obj =>
                      obj.position.row === tile.position.row &&
                      obj.position.col === tile.position.col &&
                      obj.type === ObjectType.BOX
                    ) ? 'box-on-top' : ''
                  }`}
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

      {/* Camada 2: Objetos (exceto PLAYER) */}
      {objects
        .filter(obj => obj.type !== ObjectType.PLAYER)
        .map((obj) => {
          
          const initialPos = getInitialPositionForTile(obj, moveRecords);
  
          return (
            <GameObject
              key={`gameobj-${obj.position.row}-${obj.position.col}`}
              position={obj.position}
              initialPosition={initialPos}
              cellSize={CELL_SIZE}
              objectType={obj}
              transitionDuration={240}
            />
          );
        })
      }

      {/* Camada 3: Players */}
      {objects
        .filter(obj => obj.type === ObjectType.PLAYER)
        .map((player) => {
          let direction = Direction.DOWN; // Valor padrão
          for (let i = moveRecords.length - 1; i >= 0; i--) {
            const record = moveRecords[i];
            const playerMovedObject = record.movedObjects.find(movedObj => movedObj.id === player.id);
            if (playerMovedObject) {
              direction = record.direction;
              break; // Encontrou o moveRecord mais recente, pode parar
            }
          }
          
          return (
            <Player 
              key={`player-${player.id}`}
              position={player.position} 
              direction={direction}
              cellSize={CELL_SIZE} 
              skinIndex={skinIndex}
            />
          );
        })
      }
    </div>
  );
};

export default Board;