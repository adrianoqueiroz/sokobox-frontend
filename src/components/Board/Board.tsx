import React from 'react'
import { ObjectType, TerrainType, MovedObject } from '../../types/GameTypes'
import './Board.css'

interface BoardProps {
  terrain: TerrainType[][]
  objects: ObjectType[][]
  animatingObjects: MovedObject[]
}

const Board: React.FC<BoardProps> = ({
  terrain,
  objects,
  animatingObjects,
}) => {
  return (
    <div className="board">
      {terrain.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((terrainType, colIndex) => {
            const objectType = objects[rowIndex]?.[colIndex] || 'NONE'

            // 🔍 Verifica se esse objeto está animando
            const movingObject = animatingObjects.find(
              (obj) => obj.fromRow === rowIndex && obj.fromCol === colIndex,
            )

            // ✅ Verifica se há uma caixa sobre um destino
            const isBoxOnDestination =
              objectType === 'BOX' && terrainType === 'DESTINATION'

            return (
              <div key={colIndex} className="cell">
                {/* 🔹 Camada do terreno (agora com borda e fundo verde se tiver uma caixa no destino) */}
                <div
                  className={`cell-terrain terrain-${terrainType.toLowerCase()} ${isBoxOnDestination ? 'destination-active' : ''}`}
                >
                  {terrainType === 'DESTINATION' ? '❌' : ''}
                </div>

                {/* 🔹 Renderiza qualquer objeto que não seja NONE */}
                {objectType !== 'NONE' && (
                  <div
                    className={`cell-object object-${objectType.toLowerCase()} ${
                      objectType === 'BOX' && isBoxOnDestination && !movingObject
                        ? 'destination-active'
                        : ''
                    }`}
                    style={{
                      transform: movingObject
                        ? `translate(${(movingObject.toCol - movingObject.fromCol) * 50}px, ${(movingObject.toRow - movingObject.fromRow) * 50}px)`
                        : 'translate(0, 0)',
                      transition: movingObject ? 'transform 0.2s ease-out' : 'none',
                    }}
                  >
                    {getObjectSymbol(objectType)}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

// 🔹 Função para definir os símbolos dos objetos
const getObjectSymbol = (objectType: ObjectType) => {
  if (objectType === 'PLAYER') return '🧍' // Jogador
  return '' // Nenhum objeto
}

export default Board