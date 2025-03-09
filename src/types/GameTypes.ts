export interface GameSession {
  sessionId: string;
  playerId: string;
  phaseId: string;
  terrain: TerrainType[][];
  objects: ObjectType[][];
  moves: Move[];
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export enum TerrainType {
  NONE = 'NONE',
  WALL = 'WALL',
  FLOOR = 'FLOOR',
  DESTINATION = 'DESTINATION',
}

export enum ObjectType {
  NONE = 'NONE',
  PLAYER = 'PLAYER',
  BOX = 'BOX',
}

export interface Move {
  direction: Direction;
  movedObjects: MovedObject[];
}

export type MovedObject = {
  type: ObjectType
  fromRow: number
  fromCol: number
  toRow: number
  toCol: number
  progress: number
}

export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

export interface MoveRecord {
  direction: Direction
  movedObjects: MovedObject[]
}


export interface Phase {
  id: string;
  name: string;
  description: string;
  terrain: TerrainType[][];
  objects: ObjectType[][];
}


export type Position = {
  row: number
  col: number
}
