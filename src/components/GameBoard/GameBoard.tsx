import React from 'react'
import styles from './GameBoard.module.css'

type GameBoardProps = {
  terrain: string[][]
  objects: string[][]
}

const GameBoard: React.FC<GameBoardProps> = ({ terrain, objects }) => {
  return (
    <div className={styles.board}>
      {terrain.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.row}>
          {row.map((cell, colIndex) => {
            const object = objects[rowIndex]?.[colIndex] || 'NONE'

            return (
              <div
                key={colIndex}
                className={`${styles.cell} ${styles[terrain[rowIndex][colIndex].toLowerCase()]}`}
              >
                {object !== 'NONE' && (
                  <span className={styles[object.toLowerCase()]}>{object}</span>
                )}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default GameBoard
