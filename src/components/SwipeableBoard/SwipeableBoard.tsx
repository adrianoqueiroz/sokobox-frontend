import React from 'react'
import { useSwipeable } from 'react-swipeable'
import Board from '../Board/Board'
import { MoveDirection } from '../../types/GameTypes'

interface SwipeableBoardProps {
  onSwipe: (direction: MoveDirection) => void
  // Todas as props que o Board espera:
  terrain: any[][] // ou TerrainType[][]
  objects: any[][] // ou ObjectType[][]
  animatingObjects: any[] // ou MovedObject[]
  playerDirection: 'up' | 'down' | 'left' | 'right'
  playerRow: number
  playerCol: number
}

const SwipeableBoard: React.FC<SwipeableBoardProps> = ({
  onSwipe,
  ...boardProps
}) => {
  const handlers = useSwipeable({
    onSwipedLeft: () => onSwipe(MoveDirection.LEFT),
    onSwipedRight: () => onSwipe(MoveDirection.RIGHT),
    onSwipedUp: () => onSwipe(MoveDirection.UP),
    onSwipedDown: () => onSwipe(MoveDirection.DOWN),
    preventScrollOnSwipe: true,
    trackMouse: true,
  })

  return (
    <div {...handlers}>
      <Board {...boardProps} />
    </div>
  )
}

export default SwipeableBoard
