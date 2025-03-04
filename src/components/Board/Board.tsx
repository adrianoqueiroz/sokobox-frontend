import React from 'react';
import { ObjectType, TerrainType } from '../../types/GameTypes';
import './Board.css';

interface BoardProps {
  terrain: TerrainType[][];
  objects: ObjectType[][];
}

const Board: React.FC<BoardProps> = ({ terrain, objects }) => {
  return (
    <div className="board">
      {terrain.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((terrainType, colIndex) => {
            const objectType = objects[rowIndex]?.[colIndex] || 'NONE';

            return (
              <div key={colIndex} className="cell">
                {/* 🔹 Camada do terreno (sempre no fundo) */}
                <div className={`cell-terrain terrain-${terrainType.toLowerCase()}`}>
                  {terrainType === 'DESTINATION' && '❌'}
                </div>

                {/* 🔹 Camada do objeto (sobrepõe o terreno) */}
                {objectType !== 'NONE' && (
                  <div className={`cell-object object-${objectType.toLowerCase()}`}>
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
