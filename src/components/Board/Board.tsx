import React from 'react';
import {
  TerrainTile,
  ObjectTile,
  MovedObject,
  MoveRecord,
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
  moveRecords: MoveRecord[]; // Certifique-se de que o componente pai passe pelo menos [] se não houver dados
  playerDirection: Direction;
  playerPosition: Position;
  skinIndex: number;
}

// Função para achatar o array de MoveRecord em um array plano de MovedObject
const flattenMovedObjects = (moveRecords: MoveRecord[] = []): MovedObject[] => {
  return moveRecords.reduce<MovedObject[]>((acc, record) => {
    if (record.movedObjects && record.movedObjects.length > 0) {
      return acc.concat(record.movedObjects);
    }
    return acc;
  }, []);
};

// Função para obter a posição inicial para um tile, se houver um registro em moveRecords
const getInitialPositionForTile = (
  tile: ObjectTile,
  moveRecords: MoveRecord[] = []
): Position | undefined => {
  const movedObjects = flattenMovedObjects(moveRecords);
  const move = movedObjects.find(mov =>
    mov.type === tile.type &&
    mov.finalPosition.row === tile.position.row &&
    mov.finalPosition.col === tile.position.col
  );
  return move ? { row: move.initialPosition.row, col: move.initialPosition.col } : undefined;
};

const Board: React.FC<BoardProps> = ({
  terrain,
  objects,
  moveRecords,
  playerDirection,
  playerPosition,
  skinIndex,
}) => {
  if (!terrain.length) {
    return <div className="board">Tabuleiro vazio ou inválido</div>;
  }

  // Calcula as dimensões do tabuleiro a partir dos tiles de terreno
  const maxRow = Math.max(...terrain.map(tile => tile.position.row));
  const maxCol = Math.max(...terrain.map(tile => tile.position.col));

  // Agrupa os tiles de terreno por linha, ordenando por coluna
  const terrainRows: TerrainTile[][] = [];
  for (let row = 0; row <= maxRow; row++) {
    terrainRows[row] = terrain
      .filter(tile => tile.position.row === row)
      .sort((a, b) => a.position.col - b.position.col);
  }

  return (
    <div
      className="board"
      style={{
        position: 'relative',
        width: (maxCol + 1) * CELL_SIZE,
        height: (maxRow + 1) * CELL_SIZE,
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

      {/* Camada 2: Objetos (exceto NONE e PLAYER) */}
      {objects
        .filter(obj => obj.type !== ObjectType.NONE && obj.type !== ObjectType.PLAYER)
        .map((obj) => {
          const initialPos = getInitialPositionForTile(obj, moveRecords);
          console.log(
            `Renderizando objeto ${obj.type} - Posição final: ${JSON.stringify(obj.position)}, ` +
            `posição inicial: ${initialPos ? JSON.stringify(initialPos) : 'não animado'}`
          );
          const imageUrl = obj.type === ObjectType.BOX ? '/assets/box.png' : '';
          return (
            <GameObject
              key={`gameobj-${obj.position.row}-${obj.position.col}`}
              position={obj.position}   // posição final
              initialPosition={initialPos} // se definido, dispara a animação
              cellSize={CELL_SIZE}
              objectType={obj}
              transitionDuration={240}
            />
          );
        })
      }

      {/* Camada 3: Player */}
      <Player 
        position={playerPosition} 
        direction={playerDirection} 
        cellSize={CELL_SIZE} 
        skinIndex={skinIndex}
      />
    </div>
  );
};

export default Board;
