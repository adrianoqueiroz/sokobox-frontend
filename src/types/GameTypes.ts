export type Position = {
  row: number;
  col: number;
};

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

export interface TerrainTile {
  position: Position;
  type: TerrainType;
}

export interface ObjectTile {
  position: Position;
  type: ObjectType;
}

export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

export type MovedObject = {
  type: ObjectType;
  initialPosition: Position;
  finalPosition: Position;
};

export interface MoveRecord {
  direction: Direction;
  movedObjects: MovedObject[];
}

export interface GameSession {
  sessionId: string;
  playerId: string;
  playerStrength: number;
  phaseId: string;
  terrain: TerrainTile[];
  objects: ObjectTile[];
  moveRecords: MoveRecord[];
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Phase {
  id: string;
  name: string;
  description: string;
  terrain: TerrainTile[];
  objects: ObjectTile[];
}