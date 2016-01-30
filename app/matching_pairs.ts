interface ITile {
    id?: any;
    x?: number;
    y?: number;
    isFliped?: boolean;
    tilePosition?: number;
}

interface ITileObj {
    id?: any;
    x?: number;
    y?: number;
    isFliped?: boolean;
    tilePosition?: number;
    tileRef?: number;
    isMatched?: boolean;
    tile?: any;
    coverTileIndex?: number;
}

interface ICell {
    x: number;
    y: number;
    tileID: number;
    isFliped: boolean;
}

interface ITurn {
    firstTile?: ITile;
    secondTile?: ITile;
    tileCounter?: number;
}

interface IGameState {
    startList?: any;
    currentLevelTiles?: Array<ITile>;
    currentLevelTime?: any;
    playerName?: any;
    cellUnderMarker?: any;
    firstTile?: ITile;
    secondTile?: ITile;
    matchedPairs?: number;
    turnCounter?: number;
}

export class MatchingPairs {
    gameState: IGameState;
    game: Phaser.Game;
    map: Phaser.Tilemap;
    layer: Phaser.TilemapLayer;
    timeCheck = 0;
    flipFlag: boolean = false;
    startList: Array<any> = [];
    squareList: Array<any> = [];
    shuffledList: Array<any> = [];
    masterCounter: number = 0;
    flipedTileCounter: number = 0;
    square1Num: any;
    square2Num: any;
    savedSquareX1: any;
    savedSquareY1: any;
    savedSquareX2: any;
    savedSquareY2: any;
    tileset: any;
    marker: any;
    currentMarker: ITile;
    currentTile: ITile;
    currentTilePosition: any;
    tileBack: number = 25;
    timesUp: any = '+';
    youWin: any = '+';
    myCountdownSeconds: number;
    currentTurn: ITurn = {};
    turnCounter: number;
    currentTiles: Array<any>;
    tileGrid: Array<any>;
    tilesList: Array<ITileObj>;

    constructor() {
        this.game = new Phaser.Game(900, 600, Phaser.AUTO, 'content', {
            create: this.create,
            preload: this.preload,
            update: this.update,
            render: this.render
        });
    };

    preload() {
        this.game.load.tilemap('matching', 'app/assets/phaser_tiles.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles', 'app/assets/phaser_tiles.png');
    };

    // start of create
    create() {
        this.tilesList = [];
        this.game.input.mouse.capture = true;
        this.game.input.onTap.add(MatchingPairs.prototype.onTap, this);
        this.map = this.game.add.tilemap('matching');
        this.map.addTilesetImage('Desert', 'tiles');
        this.layer = this.map.createLayer('Ground');

        this.marker = this.game.add.graphics(0, 0);
        this.marker.lineStyle(2, 0x00FF00, 1);
        this.marker.drawRect(0, 0, 100, 100);

        // this.tileGrid = [
        //     [tilesList[1], tilesList[2], tilesList[3], tilesList[4], tilesList[5], tilesList[6]],
        //     [tilesList[7], tilesList[8], tilesList[9], tilesList[10], tilesList[11], tilesList[12]],
        //     [tilesList[13], tilesList[14], tilesList[15], tilesList[16], tilesList[17], tilesList[18]],
        //     [tilesList[19], tilesList[20], tilesList[21], tilesList[22], tilesList[23], tilesList[24]],
        //     [tilesList[25], tilesList[26], tilesList[27], tilesList[28], tilesList[29], tilesList[30]],
        //     [tilesList[31], tilesList[32], tilesList[33], tilesList[34], tilesList[35], tilesList[36]]
        // ];

        for (let col = 0; col < 6; col++) {
            for (let row = 0; row < 6; row++) {
                let tile = this.map.putTile(36, col, row);
                let tmpTileObj: ITileObj = {
                    tileRef: 0,
                    id: 0,
                    x: tile.x,
                    y: tile.y,
                    isFliped: false,
                    tilePosition: 0,
                    isMatched: false,
                    tile: tile,
                    coverTileIndex: tile.index
                };
                this.tilesList.push(tmpTileObj);
            }
        }

        console.log('tileList: ', this.tilesList);

    };
    // end of create


    update() {
        if (this.layer.getTileX(this.game.input.activePointer.worldX) <= 5) {
            this.marker.x = this.layer.getTileX(this.game.input.activePointer.worldX) * 100;
            this.marker.y = this.layer.getTileY(this.game.input.activePointer.worldY) * 100;
        }
    }

    render() {
        //
    }

    onTap(pointer: any, tap: any) {
        let x = this.layer.getTileX(this.game.input.activePointer.worldX) * 100;
        console.log('x: ', x);
        let y = this.layer.getTileY(this.game.input.activePointer.worldY) * 100;
        console.log('y: ', y);
        let currentTilePosition = ((this.layer.getTileY(this.game.input.activePointer.worldY) + 1) * 6) - (6 - (this.layer.getTileX(this.game.input.activePointer.worldX) + 1));
        console.log('currentTilePosition: ', currentTilePosition);
        console.log('Hidden Tile: ', this.tilesList[currentTilePosition]);
        // this.currentTile = {
        //     x: x,
        //     y: y,
        //     isFliped: true,
        //     tilePosition: currentTilePosition
        // };

        // console.log('this.currentTile', this.currentTile);

        // this.currentTurn.tileCounter++;

        // if (this.currentTurn.tileCounter === 1) {
        //     this.currentTurn.firstTile = this.currentTile;
        // }

        // if (this.currentTurn.tileCounter === 2) {
        //     this.turnCounter++;
        //     this.currentTurn.secondTile = this.currentTile;
        // }

        // this.currentTile = {
        //     x: 0,
        //     y: 0,
        //     isFliped: false,
        //     tilePosition: 0
        // };
    };

} // end of class



// function setCurrentMarker(marker: ITile) {
//     this.currentTile = {
//         x: marker.x,
//         y: marker.y,
//         isFliped: marker.isFliped
//     };
//     console.debug('setCurrentMarker: ', this.currentMarker);
// }

function RandomizeTiles() {
    let startList: Array<any> = [];
    for (let num = 1; num <= 18; num++) {
        startList.push(num);
    }
    for (let num = 1; num <= 18; num++) {
        startList.push(num);
    }
    return startList;
}
function flipOver() {
    console.log('flipOver');
    this.map.putTile(this.currentNum, this.layer.getTileX(this.marker.x), this.layer.getTileY(this.marker.y));
}
function flipBack() {
    console.log('flipOver');
    this.flipFlag = false;
    this.map.putTile(this.tileBack, this.savedSquareX1, this.savedSquareY1);
    this.map.putTile(this.tileBack, this.savedSquareX2, this.savedSquareY2);
}
