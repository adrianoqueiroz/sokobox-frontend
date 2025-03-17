import React, { useEffect, useState } from 'react'
import { Position, Direction } from '../../types/GameTypes'

interface PlayerProps {
  position: Position
  direction: Direction
  cellSize: number
  skinIndex: number
}

const Player: React.FC<PlayerProps> = ({ position, direction, cellSize, skinIndex }) => {
  const [currentFrame, setCurrentFrame] = useState(1)

  const baseRow = {
    [Direction.DOWN]: 0,
    [Direction.LEFT]: 1,
    [Direction.RIGHT]: 2,
    [Direction.UP]: 3,
  }[direction]

  const spriteRow = baseRow + Math.floor(skinIndex / 4) * 4
  const spriteColOffset = (skinIndex % 4) * 3
  const bgPosition = `-${(spriteColOffset + currentFrame) * cellSize}px -${spriteRow * cellSize}px`

  useEffect(() => {
    let animationFrames = [2, 0, 1]
    let frameIndex = 0

    const interval = setInterval(() => {
      setCurrentFrame(animationFrames[frameIndex])
      frameIndex = (frameIndex + 1) % animationFrames.length
    }, 40)

    setTimeout(() => {
      clearInterval(interval)
      setCurrentFrame(1)
    }, 240)

    return () => clearInterval(interval)
  }, [position.row, position.col, direction])

  return (
    <div
      style={{
        position: 'absolute',
        width: cellSize,
        height: cellSize,
        top: `${position.row * cellSize}px`,
        left: `${position.col * cellSize}px`,
        transition: 'top 0.2s ease-in-out, left 0.2s ease-in-out',
        background: "url('/assets/player-sprite.png') no-repeat",
        backgroundSize: '600px 400px',
        backgroundPosition: bgPosition,
        zIndex: 3,
      }}
    />
  )
}

export default Player