import React, { useLayoutEffect, useState } from 'react'

interface Coordinates {
  row: number
  col: number
}

interface MovingObjectProps {
  imageUrl: string
  from: Coordinates
  to: Coordinates
  cellSize: number
  useTransition?: boolean
  transitionDuration?: number
}

const MovingObject: React.FC<MovingObjectProps> = ({
  imageUrl,
  from,
  to,
  cellSize,
  useTransition,
  transitionDuration,
}) => {
  const round = (value: number) => Math.round(value)

  const [position, setPosition] = useState({
    top: round(from.row * cellSize),
    left: round(from.col * cellSize),
  })

  useLayoutEffect(() => {
    if (useTransition) {
      requestAnimationFrame(() => {
        setPosition({
          top: round(to.row * cellSize),
          left: round(to.col * cellSize),
        })
      })
    } else {
      setPosition({
        top: round(to.row * cellSize),
        left: round(to.col * cellSize),
      })
    }
  }, [to, cellSize, useTransition])

  const transitionStyle = useTransition
    ? {
        transition: `top ${transitionDuration}ms ease-in-out, left ${transitionDuration}ms ease-in-out`,
      }
    : {}

  return (
    <div
      style={{
        position: 'absolute',
        width: cellSize,
        height: cellSize,
        top: `${position.top}px`,
        left: `${position.left}px`,
        background: `url(${imageUrl}) no-repeat`,
        backgroundSize: '100% 100%',
        zIndex: 10,
        ...transitionStyle,
      }}
    />
  )
}

export default MovingObject
