import React, { useEffect } from 'react'
import { ObjectType, TerrainType, MovedObject } from '../../types/GameTypes'
import AnimatedObject from '../AnimatedObject/AnimatedObject'
import './Board.css'

const CELL_SIZE = 50

interface BoardProps {
  terrain: TerrainType[][]
  objects: ObjectType[][]
  animatingObjects: MovedObject[]
  playerDirection: 'up' | 'down' | 'left' | 'right'
  isMoving: boolean  // nova prop
}

const Board: React.FC<BoardProps> = ({ terrain, objects, animatingObjects, playerDirection, isMoving }) => {
  useEffect(() => {
    if (animatingObjects.length > 0) {
      console.log("animatingObjects atualizados:", animatingObjects)
    }
  }, [animatingObjects])

  return (
    <div
      className="board"
      style={{
        position: 'relative',
        width: terrain[0].length * CELL_SIZE,
        height: terrain.length * CELL_SIZE,
      }}
    >
      {terrain.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((terrainType, colIndex) => {
            const objectType = objects[rowIndex]?.[colIndex] || 'NONE'
            const isAnimatingDestination = animatingObjects.some(
              (obj) => obj.toRow === rowIndex && obj.toCol === colIndex
            )
            const isBoxOnDestination =
              objectType === 'BOX' && terrainType === 'DESTINATION'

            return (
              <div
                key={colIndex}
                className="cell"
                style={{ width: CELL_SIZE, height: CELL_SIZE, position: 'relative' }}
              >
                <div
                  className={`cell-terrain terrain-${terrainType.toLowerCase()} ${
                    isBoxOnDestination ? 'destination-active' : ''
                  }`}
                >
                  {terrainType === 'DESTINATION' ? '❌' : ''}
                </div>

                {/* Renderiza o objeto estático somente se não estiver sendo animado */}
                {objectType !== 'NONE' && !isAnimatingDestination && (
                  objectType === 'PLAYER' ? (
                    <div className="cell-object object-player" style={{ width: CELL_SIZE, height: CELL_SIZE }}>
                      {getPlayerSprite(playerDirection)}
                    </div>
                  ) : (
                    <div
                      className={`cell-object object-${objectType.toLowerCase()} ${
                        objectType === 'BOX' && isBoxOnDestination ? 'destination-active' : ''
                      }`}
                      style={{ width: CELL_SIZE, height: CELL_SIZE }}
                    >
                      {getObjectSymbol(objectType)}
                    </div>
                  )
                )}

              </div>
            )
          })}
        </div>
      ))}

      {/* Camada de objetos animados sobre o tabuleiro */}
      {animatingObjects.map((obj, index) => (
        <AnimatedObject key={index} movedObject={obj} cellSize={CELL_SIZE} />
      ))}
    </div>
  )
}

// Para objetos que não são o player, mantenha o que já tinha (por exemplo, emoji ou outro)
const getObjectSymbol = (objectType: ObjectType) => {
  if (objectType === 'PLAYER') return null;
  return ''
}

// Função que retorna o componente do player com o sprite correto baseado na direção
const getPlayerSprite = (direction: 'up' | 'down' | 'left' | 'right') => {
  let spriteRow = 0;
  if (direction === 'up') spriteRow = 3; // ajuste conforme a linha correta do sprite para "costa"
  else if (direction === 'left') spriteRow = 1;
  else if (direction === 'right') spriteRow = 2;
  // Para "down", spriteRow continua 0 (de frente)

  // O frame idle é o segundo da sequência: índice 1
  const bgPosition = `-${1 * 50}px -${spriteRow * 50}px`;

  return (
    <div style={{
      width: '50px',
      height: '50px',
      background: "url('/assets/player-sprite.png') no-repeat",
      backgroundSize: "600px 400px",
      backgroundPosition: bgPosition,
    }} />
  );
}


export default Board
