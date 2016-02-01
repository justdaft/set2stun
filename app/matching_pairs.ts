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
    unmatchedTile1: any;
    unmatchedTile2: any;
    firstFlippedTile: any;
    secondFlippedTile: any;
    flippedTileCounter: number;
    timer: Phaser.Timer;

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
        this.flippedTileCounter = 0;
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
        this.flippedTileCounter++;
        this.timer = this.game.time.create(true);
        this.currentTile = {};
        let tappedPosition = ((this.layer.getTileY(this.game.input.activePointer.worldY) + 1) * 6) - (6 - (this.layer.getTileX(this.game.input.activePointer.worldX) + 1));
        console.log('tapPosition: ', tappedPosition);
        this.currentTile = {
            hiddenTileId: this.shuffledLevelArray[tappedPosition - 1],
        }
        let hiddenTileId = this.shuffledLevelArray[tappedPosition - 1];

        if (this.flippedTileCounter === 2) {

             this.map.putTile(hiddenTileId, this.firstFlippedTile.x, this.firstFlippedTile.y);
            console.log('this.timer: started');
            this.secondFlippedTile = {
                x: this.layer.getTileX(this.marker.x),
                y: this.layer.getTileY(this.marker.y),
                isFlipped: true
            };
            this.currentTile = this.map.getTile(this.secondFlippedTile.x, this.secondFlippedTile.y);
            console.log('Hidden Tile: ', this.currentTile);

        } else {
            this.firstFlippedTile = {
                x: this.layer.getTileX(this.marker.x),
                y: this.layer.getTileY(this.marker.y),
                isFlipped: true
            };
                                this.map.putTile(hiddenTileId, this.firstFlippedTile.x, this.firstFlippedTile.y);
            this.currentTile = this.map.getTile(this.firstFlippedTile.x, this.firstFlippedTile.y);
            console.log('Hidden Tile: ', this.currentTile);
        };
        this.timer.loop(3000, flipBack, this);
    };

} // end of class

function flipBack() {
    console.log('flipOver');
    this.flipFlag = false;
    this.map.putTile(25, this.firstFlippedTile.x, this.firstFlippedTile.y);
    this.map.putTile(25, this.secondFlippedTile.x, this.secondFlippedTile.y);
    this.flippedTilesCounter = 0;
    this.firstFlippedTile = {};
    this.secondFlippedTile = {};
    this.timer.stop();
}
