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
    flippedTileCounter: number;
    unmatchedTile1: any;
    unmatchedTile2: any;
    flippedTilesCounter: number = 0;
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
        this.flippedTileCounter = 1;
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
        this.flippedTilesCounter++;

        this.unmatchedTile1 = {};
        this.unmatchedTile2 = {};
        this.timer = this.game.time.create(false);
        if (this.flipedTileCounter === 2) {
                    this.timer.start();
                    console.log('this.timer: started');
        };

        console.log('flippedTileCounter: ', this.flippedTileCounter);
        //  Set a TimerEvent to occur after 2 seconds

        let tappedTile1X = this.layer.getTileX(this.marker.x);
        let tappedTile1Y = this.layer.getTileY(this.marker.y);
        this.unmatchedTile1 = {
            x: tappedTile1X,
            y: tappedTile1Y
        };
        let tappedPosition = ((this.layer.getTileY(this.game.input.activePointer.worldY) + 1) * 6) - (6 - (this.layer.getTileX(this.game.input.activePointer.worldX) + 1));
        console.log('tapPosition: ', tappedPosition);

        let hiddenTileId = this.shuffledLevelArray[tappedPosition - 1];
        console.log('hiddenTileId: ', hiddenTileId);

        this.currentTile = this.map.getTile(tappedTile1X, tappedTile1Y);
        console.log('Hidden Tile: ', this.currentTile);

        this.map.putTile(hiddenTileId, tappedTile1X, tappedTile1Y);

        this.timer.loop(3000, flipBack, this);
    };

} // end of class

function flipBack() {
    console.log('flipOver');
    this.flipFlag = false;
    this.map.putTile(25, this.unmatchedTile1.x, this.unmatchedTile1.y);
    // this.map.putTile(this.tileBack, tile1.x, tile1.y);
    // this.map.putTile(this.tileBack, tile2.x, tile2.y);
    this.flippedTilesCounter = 0;
    this.timer.stop();
}
