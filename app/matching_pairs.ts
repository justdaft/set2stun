interface ITile {
    id?: any;
    x?: number;
    y?: number;
    isFliped?: boolean;
    tilePosition?: number;
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

    create() {
        this.currentTiles = [];
        this.game.input.mouse.capture = true;
        // this.game.input.onDown.add(MatchingPairs.prototype.mouseDown);
        this.game.input.onTap.add(MatchingPairs.prototype.onTap, this);
        this.startList = RandomizeTiles();
        this.gameState = {
            currentLevelTiles: this.startList,
            currentLevelTime: 0,
            playerName: 'Billy',
            firstTile: null,
            secondTile: null,
            cellUnderMarker: null,
            matchedPairs: 0,
            turnCounter: 0
        };

        this.myCountdownSeconds = 0;
        this.map = this.game.add.tilemap('matching');
        this.map.addTilesetImage('Desert', 'tiles');
        this.layer = this.map.createLayer('Ground');

        this.marker = this.game.add.graphics(0, 0);
        this.marker.lineStyle(2, 0x00FF00, 1);
        this.marker.drawRect(0, 0, 100, 100);


        console.log('this.startList', this.startList);
        this.shuffledList = Phaser.ArrayUtils.shuffle(this.startList);

        console.log('this.shuffledList', this.shuffledList);
        for (let col = 0; col < 6; col++) {
            for (let row = 0; row < 6; row++) {
                this.map.putTile(36, col, row);
            }
        }

        // start of create gameObjectArray
        let counter: number = 0;


        let tileDeck = {
            tiles: createTileList(18, this.layer),
        };

        function createTileList(sampleSize: number, layer: any): Array<any> {
            let tileList: Array<any> = [];

            let baseList: Array<any> = [];
            for (let num = 0; num  <= ( sampleSize - 1 ); num++) {
                baseList.push({
                    x: 0,
                    y: 0,
                    tileId: num,
                    isFliped: false,
                });
            }
            for (let num = 0; num <= ( sampleSize - 1 ); num++) {
                baseList.push({
                    x: 0,
                    y: 0,
                    tileId: num,
                    isFliped: false,
                });
            }

            let shuffledBaseList = Phaser.ArrayUtils.shuffle(baseList);

            let currentLevelTiles = shuffledBaseList.map(function (item, index) {
                    item.x = 0;
                    item.y = 1;
                    item.isFliped = false;
                    item.id = index + 1;
                    console.log('item: ', item);
                return item;
            });

            return tileList;
        }


        // end of create gameObjectArray

        // console.log('currentTiles: ', this.currentTiles);
        this.turnCounter = 0;
        this.currentTile = {
            x: 0,
            y: 0,
            isFliped: false,
            tilePosition: 0
        };
        this.currentTurn = {
            firstTile: { x: 0,
                         y: 0,
                         isFliped: false },
            secondTile:  { x: 0,
                         y: 0,
                         isFliped: false },
            tileCounter: 0
        };


        console.log('gameState: ', this.gameState);
    }; // end of create

    onTap(pointer: any, tap: any) {
        let x = this.layer.getTileX(this.game.input.activePointer.worldX) * 100;
        let y = this.layer.getTileY(this.game.input.activePointer.worldY) * 100;
        let currentTilePosition = ((this.layer.getTileY(this.game.input.activePointer.worldY) + 1) * 6) - (6 - (this.layer.getTileX(this.game.input.activePointer.worldX) + 1));

        this.currentTile = {
            x: x,
            y: y,
            isFliped: true,
            tilePosition: currentTilePosition
        };

        console.log('this.currentTile', this.currentTile);

        this.currentTurn.tileCounter++;

        if (this.currentTurn.tileCounter === 1) {
            this.currentTurn.firstTile = this.currentTile;
        }

        if (this.currentTurn.tileCounter === 2) {
            this.turnCounter++;
            this.currentTurn.secondTile = this.currentTile;
        }

        // if (this.currentTurn.tileCounter === 2) {
        //    this.turnCounter++;
        // }

        this.currentTile = {
            x: 0,
            y: 0,
            isFliped: false,
            tilePosition: 0
        };
    };

    update() {
        // countDownTimer(this.game);
        //let timeLimit = 120;
        //let mySeconds = this.game.time.totalElapsedSeconds();
        //this.myCountdownSeconds = timeLimit - mySeconds;
        //
        //if (this.myCountdownSeconds <= 0) {
        //    // time is up
        //    this.timesUp = 'Time is up!';
        //}
        if (this.layer.getTileX(this.game.input.activePointer.worldX) <= 5) {
            this.marker.x = this.layer.getTileX(this.game.input.activePointer.worldX) * 100;
            this.marker.y = this.layer.getTileY(this.game.input.activePointer.worldY) * 100;

        }
        if (this.currentTile.isFliped) {
            let currentTilePosition = ((this.layer.getTileY(this.game.input.activePointer.worldY) + 1) * 6) - (6 - (this.layer.getTileX(this.game.input.activePointer.worldX) + 1));
            console.log('yipee, you flipped: ', this.currentTile, currentTilePosition);
            let currentNum = this.shuffledList[currentTilePosition - 1];
            this.map.putTile(currentNum, this.layer.getTileX(this.marker.x), this.layer.getTileY(this.marker.y));
        }
        if (this.currentTurn.tileCounter >= 2) {
            this.currentTurn = {
            firstTile: { x: 0,
                         y: 0,
                         isFliped: false },
            secondTile:  { x: 0,
                         y: 0,
                         isFliped: false },
            tileCounter: 0
        };
    }
    }

    render() {
        // this.game.debug.text(this.timesUp, 620, 208, 'rgb(0,255,0)');
        // this.game.debug.text(this.youWin, 620, 240, 'rgb(0,255,0)');
        this.game.debug.text('Time: ' + this.gameState.currentLevelTime, 620, 15, 'rgb(0,255,0)');
        this.game.debug.text('TileCounter: ' + this.currentTurn.tileCounter, 620, 272, 'rgb(0,255,0)');
        this.game.debug.text('Matched Pairs: ' + this.masterCounter, 620, 304, 'rgb(0,255,0)');
        this.game.debug.text('firstTile selected: ' + this.currentTurn.firstTile.tilePosition, 620, 208, 'rgb(0,255,0)');
        this.game.debug.text('secondTile selected: ' + this.currentTurn.secondTile.tilePosition, 620, 240, 'rgb(0,255,0)');
        // this.game.debug.text('Tile: ' + this.map.getTile(this.layer.getTileX(this.marker.x),
        // this.layer.getTileY(this.marker.y)).index, 620, 48, 'rgb(255,0,0)');

        this.game.debug.text('LayerX: ' + this.layer.getTileX(this.marker.x), 620, 80, 'rgb(0,255,0)');
        this.game.debug.text('LayerY: ' + this.layer.getTileY(this.marker.y), 620, 112, 'rgb(0,255,0)');

        this.game.debug.text('Tile Position: ' + this.currentTilePosition, 620, 144, 'rgb(0,255,0)');
        this.game.debug.text('Turn Counter: ' + this.turnCounter, 620, 176, 'rgb(0,255,0)');
        // this.game.debug.text('Hidden Tile: ' + this.getHiddenTile(), 620, 176, 'rgb(255,0,0)');
    }

} // end of class


function CountDownTimer(game: Phaser.Game) {
    let timeLimit = 120;
    let mySeconds = game.time.totalElapsedSeconds();
    this.myCountdownSeconds = timeLimit - mySeconds;
    
    if (this.myCountdownSeconds <= 0) {
        // time is up
        this.timesUp = 'Time is up!';    
    }
}

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
