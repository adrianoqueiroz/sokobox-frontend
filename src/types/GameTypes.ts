// Definição dos tipos de terreno
export enum TerrainType {
  WALL = 'WALL',
  FLOOR = 'FLOOR',
  DESTINATION = 'DESTINATION',
}

// Definição dos tipos de objetos
export enum ObjectType {
  NONE = 'NONE',
  PLAYER = 'PLAYER',
  BOX = 'BOX',
}

// Direções de movimento
export enum MoveDirection {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

// Estrutura para representar um objeto movido
export interface MovedObject {
  type: ObjectType
  fromRow: number
  fromCol: number
  toRow: number
  toCol: number
}

// Estrutura do movimento realizado
export interface MoveRecord {
  direction: MoveDirection
  movedObjects: MovedObject[]
}
