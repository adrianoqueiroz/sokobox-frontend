import React from 'react'
import { ObjectType, TerrainType } from '../../types/GameTypes'
import './Tile.css'

interface TileProps {
  terrain: TerrainType
  object: ObjectType
}

const Tile: React.FC<TileProps> = ({ terrain, object }) => {
  // Definir os estilos com base no tipo de terreno
  const terrainStyles: Record<TerrainType, string> = {
    FLOOR: 'tile floor',
    WALL: 'tile wall',
    DESTINATION: 'tile destination',
  }

  // Definir os ícones dos objetos
  const objectIcons: Record<ObjectType, string> = {
    NONE: '',
    PLAYER: '🧍',
    BOX: '📦',
  }

  return <div className={terrainStyles[terrain]}>{objectIcons[object]}</div>
}

export default Tile
