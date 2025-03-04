import React from 'react';
import { ObjectType, TerrainType, MovedObject } from '../../types/GameTypes';
import './Board.css';

interface BoardProps {
  terrain: TerrainType[][];
  objects: ObjectType[][];
  animatingObjects: MovedObject[];
}

const Board: React.FC<BoardProps> = ({ terrain, objects, animatingObjects }) => {
  return (
    <div className="board">
      {terrain.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((terrainType, colIndex) => {
            const objectType = objects[rowIndex]?.[colIndex] || 'NONE';

            // 🔍 Encontrar se esse objeto deve ser animado
            const movingObject = animatingObjects.find(
              (obj) => obj.fromRow === rowIndex && obj.fromCol === colIndex
            );

            return (
              <div key={colIndex} className="cell">
                {/* 🔹 Camada do terreno (sempre no fundo) */}
                <div className={`cell-terrain terrain-${terrainType.toLowerCase()}`}>
                  {terrainType === 'DESTINATION' ? '❌' : ''}
                </div>

                {/* 🔹 Renderizar objeto com animação */}
                {objectType !== 'NONE' && (
                  <div
                    className={`cell-object object-${objectType.toLowerCase()}`}
                    style={{
                      transform: movingObject
                        ? `translate(${(movingObject.toCol - movingObject.fromCol) * 50}px, ${(movingObject.toRow - movingObject.fromRow) * 50}px)`
                        : 'translate(0, 0)',
                      transition: movingObject ? 'transform 0.2s ease-out' : 'none',
                      zIndex: objectType === 'PLAYER' ? 3 : 2, // Jogador sobre a caixa
                    }}
                  >
                    {getObjectSymbol(objectType)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// 🔹 Função para definir os símbolos dos objetos
const getObjectSymbol = (objectType: ObjectType) => {
  if (objectType === 'PLAYER') return '🧍'; // Jogador
  if (objectType === 'BOX') return '📦'; // Caixa
  return ''; // Nenhum objeto
};

export default Board;
