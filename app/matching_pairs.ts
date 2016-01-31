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

    levelArray: Array<any>;
    shuffledLevelArray: Array<any>;

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
        this.levelArray = [];
        this.shuffledLevelArray = [];
        this.game.input.mouse.capture = true;
        this.game.input.onTap.add(MatchingPairs.prototype.onTap, this);

        this.map = this.game.add.tilemap('matching');
        this.map.addTilesetImage('Desert', 'tiles');
        this.layer = this.map.createLayer('Ground');

        this.marker = this.game.add.graphics(0, 0);
        this.marker.lineStyle(2, 0x00FF00, 1);
        this.marker.drawRect(0, 0, 100, 100);

        for (let num = 1; num <= 18; num++) {
            this.levelArray.push(num);
        }
        for (let num = 1; num <= 18; num++) {
            this.levelArray.push(num);
        }


        this.shuffledLevelArray = Phaser.ArrayUtils.shuffle(this.levelArray);
        console.log('shuffledLevelArray: ', this.shuffledLevelArray);
        // for (let i = 1; i <= 36; i++) {
        //     let randomPosition = this.game.rnd.integerInRange(0, this.startList.length - 1);

        //     let thisNumber = this.startList[randomPosition];
        //     currentLevelArray.push(thisNumber);
        //     let a = this.startList.indexOf(thisNumber);
        //     this.startList.splice(a, 1);
        // }
        // let startList: Array<any> = [];
        // for (let num = 1; num <= 18; num++) {
        //     startList.push(num);
        // }
        // for (let num = 1; num <= 18; num++) {
        //     startList.push(num);
        // }

        // this.shuffledList = Phaser.ArrayUtils.shuffle(this.startList);

        // put tile cover in place
        for (let col = 0; col < 6; col++) {
            for (let row = 0; row < 6; row++) {
                this.map.putTile(36, col, row);
            }
        }

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
        let tappedTtileX = this.layer.getTileX(this.marker.x);
        let tappedTtileY = this.layer.getTileY(this.marker.y);

        let tappedPosition = ((this.layer.getTileY(this.game.input.activePointer.worldY) + 1) * 6) - (6 - (this.layer.getTileX(this.game.input.activePointer.worldX) + 1));
        console.log('tapPosition: ', tappedPosition);

        let hiddenTileId = this.shuffledLevelArray[tappedPosition - 1];
        console.log('hiddenTileId: ', hiddenTileId);

        this.currentTile = this.map.getTile(tappedTtileX, tappedTtileY);
        console.log('Hidden Tile: ', this.currentTile);

        this.map.putTile(hiddenTileId, tappedTtileX, tappedTtileY);
        // tileXY.alpha = 0.5;
        // this.layer.dirty = true;
    };

} // end of class

function flipOver(hiddenTileId: number, tappedTtileX: number, tappedTtileY: number) {
    console.log('flipOver');
    this.map.putTile(hiddenTileId, tappedTtileX, tappedTtileY);
}

function flipBack() {
    console.log('flipOver');
    this.flipFlag = false;
    this.map.putTile(this.tileBack, this.savedSquareX1, this.savedSquareY1);
    this.map.putTile(this.tileBack, this.savedSquareX2, this.savedSquareY2);
}

// function changeLayer(key: any) {
//     switch (key.keyCode)
//     {
//         case Phaser.Keyboard.ONE:
//             currentLayer = layer1;
//             layer1.alpha = 1;
//             layer2.alpha = 0.2;
//             layer3.alpha = 0.2;
//             break;

//         case Phaser.Keyboard.TWO:
//             currentLayer = layer2;
//             layer1.alpha = 0.2;
//             layer2.alpha = 1;
//             layer3.alpha = 0.2;
//             break;
// default:
//             currentLayer = layer2;
//             layer1.alpha = 0.2;
//             layer2.alpha = 1;
//             break;
//     }

// }
