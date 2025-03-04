export type TerrainType = 'WALL' | 'FLOOR' | 'DESTINATION';
export type ObjectType = 'NONE' | 'PLAYER' | 'BOX';

export interface MovedObject {
  type: ObjectType;
  fromRow: number;
  fromCol: number;
  toRow: number;
  toCol: number;
}

export interface MoveRecord {
  direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
  movedObjects: MovedObject[];
}
