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

export type MovedObject = {
    type: ObjectType;
    fromRow: number;
    fromCol: number;
    toRow: number;
    toCol: number;
    progress: number; // ✅ Progresso da animação
};


// Estrutura do movimento realizado
export interface MoveRecord {
  direction: MoveDirection
  movedObjects: MovedObject[]
}
