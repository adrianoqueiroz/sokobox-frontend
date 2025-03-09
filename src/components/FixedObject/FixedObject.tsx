import React from 'react'
import './FixedObject.css'

interface Coordinates {
  row: number
  col: number
}

interface FixedObjectProps {
  imageUrl: string
  from: Coordinates
  cellSize: number
}

const FixedObject: React.FC<FixedObjectProps> = ({
  imageUrl,
  from,
  cellSize,
}) => {
  const round = (value: number) => Math.round(value)
  const top = round(from.row * cellSize)
  const left = round(from.col * cellSize)

  return (
    <div
      className="fixed-object"
      style={{
        position: 'absolute',
        width: cellSize,
        height: cellSize,
        top: `${top}px`,
        left: `${left}px`,
        background: `url(${imageUrl}) no-repeat center`,
        backgroundSize: '100% 100%',
        zIndex: 4,
      }}
    />
  )
}

export default FixedObject
