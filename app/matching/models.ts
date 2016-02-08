export interface ITile {
    _id?: number;
    id?: number;
    tileImageId?: number;
    uuid?: any;
    isMatched?: boolean;
    x?: number;
    y?: number;
    canFlip?: boolean;
    isFlipped?: boolean;
}

 export interface IGame {
    tiles: Array<ITile>;
    playerName: string;
    tilePairsMatched: number;
    turnsTaken: number;
    uuid: any;
}
