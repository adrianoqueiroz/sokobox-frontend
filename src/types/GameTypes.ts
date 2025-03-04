// Representa os tipos de terreno no jogo
export enum TerrainType {
  FLOOR = 'FLOOR',
  WALL = 'WALL',
  DESTINATION = 'DESTINATION',
}

// Representa os tipos de objetos no jogo
export enum ObjectType {
  NONE = 'NONE',
  PLAYER = 'PLAYER',
  BOX = 'BOX',
  BOX_ON_DEST = 'BOX_ON_DEST',
}

// Representa as direções de movimento
export type MoveDirection = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
