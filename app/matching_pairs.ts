
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

// import {revealTile, isGameOver} from './game';

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
    stateHistory: any = [];
    gameState: any;
    newGameState: any;

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
        this.game.load.text('level_1_data', 'app/data/level_1.json');
        this.game.load.text('level_data', 'app/data/level_data.json');
    };

    // start of create
    create() {
        let {fromJS, List, Map} = Immutable;

        let level_1_data = JSON.parse(this.game.cache.getText('level_1_data'));
        
        // --------- start of new
        
            this.stateHistory = [];

            let level_data = JSON.parse(this.game.cache.getText('level_data'));
            this.gameState = Immutable.Map({
                tiles: Immutable.List(),
                total: 0
            });
            console.log('this.gameState: ', this.gameState);
            this.stateHistory.push(this.gameState);
            console.log('this.stateHistory: ', this.stateHistory);

            this.gameState = this.gameState.mergeDeep({
                tiles: level_data,
                total: level_data.length
            });
            console.log('this.gameState: ', this.gameState);

            this.stateHistory.push(this.gameState);
            console.log('this.stateHistory: ', this.stateHistory);
        
        // --------- end of new

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
        // console.log('shuffledLevelArray: ', this.shuffledLevelArray);

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
        // console.log('flippedTileCounter: ', this.flippedTileCounter);
        this.currentTile = {};
        let tappedPosition = ((this.layer.getTileY(this.game.input.activePointer.worldY) + 1) * 6) - (6 - (this.layer.getTileX(this.game.input.activePointer.worldX) + 1));
        console.log('tapPosition: ', tappedPosition);

        let hiddenTileId = this.shuffledLevelArray[tappedPosition - 1];
        
        // example var indexOfMobile = obj.get(indexOfJohn).get('phones').findIndex(phone => phone.has('mobile'))
        // let tmpObj: any;
        //  let result = this.gameState.get('tiles').map((tile) => {
        //      console.log(tile.get('guid'))
        //      tmpObj = tile;
        //      console.log('tmpObj: ', tmpObj);
        //     });
            
        if (this.gameState.get('tiles').get(hiddenTileId)) {
            this.stateHistory.push(this.gameState);
           // let tmpTile =  this.gameState.get('tiles').get(hiddenTileId).set('isflipped', true);
          // this.gameState = this.gameState.get('tiles').get(hiddenTileId ).set('isflipped', true);
          this.gameState = this.gameState.setIn(['tiles', hiddenTileId, 'isflipped'], true);
          // var gameState = gameState.setIn(['tiles', 3, 'isflipped'], true)
           //let xTile = tmpTile.set('isflipped', true);
           //console.log('xTile: ', xTile);
        }
         // example for console this.gameState.get('tiles').map(function(tile){console.log(tile.get('isflipped'))})   
          //  this.stateHistory.push(this.gameState);
            console.log('this.stateHistory: ', this.stateHistory);
            
            
        //let result = this.gameState.get('tiles').map((tile) => console.log('answer: ', tile.get('index') === '2'));
        // let answer = obj.findIndex(person => person.get('name') === 'john')
        
        
        // example console.log('state1.get by index: ', state1.get('tiles').get(4).get('guid'));
        console.log('get hidden tile by id: ', this.gameState.get('tiles').get(hiddenTileId).get('guid'));
        
        
        if (this.flippedTileCounter === 2) {
            console.log('flippedTileCounter: ', this.flippedTileCounter);
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
            this.currentTile = this.map.getTile(this.secondFlippedTile.x, this.secondFlippedTile.y);
            console.log('Hidden Tile: ', this.currentTile);
        } else {
            console.log('flippedTileCounter: ', this.flippedTileCounter);
            this.firstFlippedTile = {
                x: this.layer.getTileX(this.marker.x),
                y: this.layer.getTileY(this.marker.y),
                isFlipped: true
            };
            this.map.putTile(hiddenTileId, this.firstFlippedTile.x, this.firstFlippedTile.y);
            this.currentTile = this.map.getTile(this.firstFlippedTile.x, this.firstFlippedTile.y);
            console.log('Hidden Tile: ', this.currentTile);
        };
        // console.log('flippedTileCounter: ', this.flippedTileCounter);
        this.timer.loop(1500, flipBack, this);
    };

} // end of class

function revealTile(game: any, tile: any) {
    // console.log(game.getIn(['tiles', tile]));
}

function flipBack() {
    console.log('flipOver');
    this.flipFlag = false;
    this.map.putTile(25, this.firstFlippedTile.x, this.firstFlippedTile.y);
    this.map.putTile(25, this.secondFlippedTile.x, this.secondFlippedTile.y);
    // console.log('flippedTileCounter: ', this.flippedTileCounter);
    this.flippedTileCounter = 0;
    // console.log('flippedTileCounter: ', this.flippedTileCounter);
    this.firstFlippedTile = {};
    this.secondFlippedTile = {};
    this.timer.stop();
}


