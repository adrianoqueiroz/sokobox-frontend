import React from 'react';
import { ObjectType, TerrainType, MovedObject } from '../../types/GameTypes';
import './Board.css';

interface BoardProps {
  terrain: TerrainType[][];
  objects: ObjectType[][];
  animatingObjects?: MovedObject[];
}

const Board: React.FC<BoardProps> = ({ terrain, objects, animatingObjects = [] }) => {
  return (
    <div className="board">
      {terrain.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((terrainType, colIndex) => {
            const objectType = objects[rowIndex]?.[colIndex] || 'NONE';

            // 🔹 Encontrar se este objeto está na animação
            const movingObject = animatingObjects.find(
              (m) => m.toRow === rowIndex && m.toCol === colIndex
            );

            return (
              <div key={colIndex} className="cell">
                {/* 🔹 Camada do terreno */}
                <div className={`cell-terrain terrain-${terrainType.toLowerCase()}`}>
                  {terrainType === 'DESTINATION' ? '❌' : ''}
                </div>

                {/* 🔹 Camada dos objetos (animados apenas se necessário) */}
                {objectType !== 'NONE' && (
                  <div
                    className={`cell-object object-${objectType.toLowerCase()}`}
                    style={{
                      transform: movingObject
                        ? `translate(${(movingObject.fromCol - movingObject.toCol) * 50}px, ${(movingObject.fromRow - movingObject.toRow) * 50}px)`
                        : 'translate(0, 0)',
                      transition: movingObject ? 'transform 0.2s ease-out' : 'none',
                      zIndex: objectType === 'BOX' ? 2 : 3, // Jogador sobre a caixa
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
  if (objectType === 'PLAYER') return '🧍';
  if (objectType === 'BOX') return '📦';
  return '';
};

export default Board;
