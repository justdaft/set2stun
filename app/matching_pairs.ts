interface ITile {
    id?: any;
    _id?: number;
    tileImageId?: number;
    guid?: any;
    isMatched?: boolean;
    coverTileId?: number;
    x?: number;
    y?: number;
    isFlipped?: boolean;
    tilePosition?: number;
    hiddenTileId?: number;
    canFlip?: boolean;
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

export class MatchingPairs {
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
    turnCounter: number;
    currentTiles: Array<any>;
    tileGrid: Array<any>;
    tilesList: Array<ITileObj>;

    levelArray: Array<any>;
    shuffledLevelArray: Array<any>;
    unmatchedTile1: any;
    unmatchedTile2: any;
    firstFlippedTile: ITile;
    secondFlippedTile: ITile;
    flippedTileCounter: number;
    timer: Phaser.Timer;
    levelData: any;
    levelDataArray: Array<ITile>;

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
        this.game.load.text('levelData', 'app/data/level.json');
    };

    // start of create
    create() {
        this.levelData = JSON.parse(this.game.cache.getText('levelData'));
        this.levelDataArray = JSON.parse(this.game.cache.getText('levelData'));
        console.log(this.levelData);
        console.log(this.levelDataArray);
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
        // for (let num = 1; num <= 18; num++) {
        //     this.levelDataArray[num].guid = (num: number) => {return num * 33};
        // }
        
        this.levelDataArray.map(function(obj: ITile, index: number){
            let _gid = (obj._id * index) + 100;
            return obj.guid = _gid.toString();
        });
        console.log(this.levelDataArray);
        // for (let num = 1; num <= 18; num++) {
        //     this.levelArray.push(num);
        // }


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
        this.timer = this.game.time.create(true);
        this.flippedTileCounter++;
        console.log('flippedTileCounter: ',  this.flippedTileCounter);
        this.currentTile = {};
        let tappedPosition = ((this.layer.getTileY(this.game.input.activePointer.worldY) + 1) * 6) - (6 - (this.layer.getTileX(this.game.input.activePointer.worldX) + 1));
        console.log('tapPosition: ', tappedPosition);
        // this.currentTile = {
        //     hiddenTileId: this.shuffledLevelArray[tappedPosition - 1],
        // };
        let hiddenTileId = this.shuffledLevelArray[tappedPosition - 1];

        if (this.flippedTileCounter === 2) {
            console.log('flippedTileCounter: ',  this.flippedTileCounter);
            this.secondFlippedTile = {
                x: this.layer.getTileX(this.marker.x),
                y: this.layer.getTileY(this.marker.y),
                isFlipped: true
            };
            this.map.putTile(hiddenTileId, this.secondFlippedTile.x, this.secondFlippedTile.y);
            if (this.firstFlippedTile.hiddenTileId === this.secondFlippedTile.hiddenTileId) {
                console.log('winner');
            }
            this.timer.start();
            // this.currentTile = this.map.getTile(this.secondFlippedTile.x, this.secondFlippedTile.y);
            console.log('Hidden Tile: ', this.currentTile);
        } else {
            console.log('flippedTileCounter: ',  this.flippedTileCounter);
            this.firstFlippedTile = {
                x: this.layer.getTileX(this.marker.x),
                y: this.layer.getTileY(this.marker.y),
                isFlipped: true
            };
            this.map.putTile(hiddenTileId, this.firstFlippedTile.x, this.firstFlippedTile.y);
            // this.currentTile = this.map.getTile(this.firstFlippedTile.x, this.firstFlippedTile.y);
        };
        console.log('flippedTileCounter: ',  this.flippedTileCounter);
        this.timer.loop(1500, flipBack, this);
    };

} // end of class

function flipBack() {
    console.log('flipOver');
    this.flipFlag = false;
    this.map.putTile(25, this.firstFlippedTile.x, this.firstFlippedTile.y);
    this.map.putTile(25, this.secondFlippedTile.x, this.secondFlippedTile.y);
    console.log('flippedTileCounter: ',  this.flippedTileCounter);
    this.flippedTileCounter = 0;
    console.log('flippedTileCounter: ',  this.flippedTileCounter);
    this.firstFlippedTile = {};
    this.secondFlippedTile = {};
    this.timer.stop();
}


