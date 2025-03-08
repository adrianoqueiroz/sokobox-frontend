import React from 'react'
import { useSwipeable } from 'react-swipeable'

interface SwipeableContainerProps {
  onSwipe: (direction: 'up' | 'down' | 'left' | 'right') => void
  children: React.ReactNode
}

const SwipeableContainer: React.FC<SwipeableContainerProps> = ({
  onSwipe,
  children,
}) => {
  const handlers = useSwipeable({
    onSwipedLeft: () => onSwipe('left'),
    onSwipedRight: () => onSwipe('right'),
    onSwipedUp: () => onSwipe('up'),
    onSwipedDown: () => onSwipe('down'),
    preventScrollOnSwipe: true, // Use essa propriedade em vez de preventDefaultTouchmoveEvent
    trackMouse: true,
  })

  return <div {...handlers}>{children}</div>
}

export default SwipeableContainer
