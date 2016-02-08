import { ITile, IGame } from './models';
import { addItem, removeItem } from '../store/actions';
import StateStore from '../store/statestore';

// interface ITile {
//     id?: any;
//     _id?: number;
//     tileImageId?: number;
//     guid?: any;
//     isMatched?: boolean;
//     coverTileId?: number;
//     x?: number;
//     y?: number;
//     isFlipped?: boolean;
//     tilePosition?: number;
//     hiddenTileId?: number;
//     canFlip?: boolean;
//     canTap?: boolean;
// }

export class MatchingGame {
    store: StateStore;
    game: Phaser.Game;
    map: Phaser.Tilemap;
    layer: Phaser.TilemapLayer;
    marker: any;
    currentTile: ITile;
    levelArray: Array<any>;
    shuffledLevelArray: Array<any>;
    firstFlippedTile: ITile;
    secondFlippedTile: ITile;
    flippedTileCounter: number;
    timer: Phaser.Timer;
    stateHistory: any = [];
    gameState: any;
    background: any;
    filter: any;
    counter: number = 0;
    level_data: any;

    constructor(store: StateStore) {
        this.store = store;
        this.game = new Phaser.Game(900, 600, Phaser.AUTO, 'content', {
            create: this.create,
            preload: this.preload,
            update: this.update,
            render: this.render
        });


        this.gameState = this.gameState.mergeDeep({
            tiles: this.shuffledLevelArray,
            playerName: 'Player 1',
            tilePairsMatched: 0,
            turnsTaken: 0
        });
    };

    // addItem() {
    //     this.counter++;
    //     let tmpItem = {
    //         _id: this.counter,
    //         tileImageId: this.counter,
    //         x: 0,
    //         y: 0,
    //         uuid: uuid.v4(),
    //         isMatched: false,
    //         canFlip: true
    //     };
    //     console.log('tmpItem: ', tmpItem);
    //     this.store.dispatch(addItem(tmpItem));
    //     this.newItem = '';
    // }

initialState() {
    this.levelArray = [];
    this.shuffledLevelArray = [];
    this.shuffledLevelArray = Phaser.ArrayUtils.shuffle(this.level_data);
    
};

preload() {
    this.game.load.tilemap('matching', 'app/matching/assets/adventure_time.json', null, Phaser.Tilemap.TILED_JSON);
    // this.game.load.image('tiles', 'app/matching/assets/phaser_tiles.png');
    // this.game.load.tilemap('matching', 'app/matching/assets/phaser_tiles.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('tiles', 'app/matching/assets/adventure_time.png');
    // this.game.load.text('level_1_data', 'app/data/level_1.json');
    this.game.load.text('level_data', 'app/matching/data/level_data.json');
    this.game.load.script('filter', 'https://cdn.rawgit.com/photonstorm/phaser/master/filters/Fire.js');
    this.level_data = JSON.parse(this.game.cache.getText('level_data'));
};

create() {
    this.gameState = this.initialState();
    this.background = this.game.add.sprite(600, 0);
    this.background.width = 300;
    this.background.height = 600;
    let {fromJS, List, Map} = Immutable;
    // let level_1_data = JSON.parse(this.game.cache.getText('level_1_data'));
    this.stateHistory = [];
    
    this.flippedTileCounter = 0;

    // this.gameState = Immutable.Map({
    //     tiles: Immutable.List()
    // });
    // console.log('this.gameState: ', this.gameState);
    // this.stateHistory.push(this.gameState);






    this.game.input.mouse.capture = true;
    this.game.input.onTap.add(MatchingGame.prototype.onTap, this);
    this.map = this.game.add.tilemap('matching');
    this.map.addTilesetImage('adventure_time', 'tiles');
    this.layer = this.map.createLayer('TileLayer1');
    this.marker = this.game.add.graphics(0, 0);
    this.marker.lineStyle(2, 0x00FF00, 1);
    this.marker.drawRect(0, 0, 100, 100);
    for (let col = 0; col < 6; col++) {
        for (let row = 0; row < 6; row++) {
            this.map.putTile(36, col, row);
        }
    }
    this.filter = this.game.add.filter('Fire', 900, 600);
    this.filter.alpha = 0.0;
    this.background.filters = [this.filter];
};

update() {
    if (this.layer.getTileX(this.game.input.activePointer.worldX) <= 5) {
        this.marker.x = this.layer.getTileX(this.game.input.activePointer.worldX) * 100;
        this.marker.y = this.layer.getTileY(this.game.input.activePointer.worldY) * 100;
    }
    this.filter.update();
}

render() {
    this.game.debug.text('Player Name: ' + this.gameState.get('playerName'), 620, 30, 'rgb(0,255,0)');
    this.game.debug.text('Turns Taken: ' + this.gameState.get('turnsTaken'), 620, 60, 'rgb(0,255,0)');
    this.game.debug.text('Matched Pairs: ' + this.gameState.get('tilePairsMatched'), 620, 90, 'rgb(0,255,0)');
}

onTap(pointer: any, tap: any) {
    this.timer = this.game.time.create(true);
    this.flippedTileCounter++;
    this.currentTile = {};
    let tappedPosition = ((this.layer.getTileY(this.game.input.activePointer.worldY) + 1) * 6) - (6 - (this.layer.getTileX(this.game.input.activePointer.worldX) + 1));
    console.log('tapPosition: ', tappedPosition);

    let hiddenTileId = this.gameState.get('tiles').get(tappedPosition - 1).get('tileImageId');
    // let hiddenTileId = this.shuffledLevelArray[tappedPosition - 1];
    console.log('hiddenTileId: ', hiddenTileId);
    // example for console this.gameState.get('tiles').map(function(tile){console.log(tile.get('isflipped'))})   

    console.log('this.stateHistory: ', this.stateHistory);

    // example console.log('state1.get by index: ', state1.get('tiles').get(4).get('guid'));
    console.log('get hidden tile by id: ', this.gameState.get('tiles').get(hiddenTileId).get('guid'));

    if (this.flippedTileCounter === 2) {
        console.log('flippedTileCounter: ', this.flippedTileCounter);
        this.secondFlippedTile = {
            x: this.layer.getTileX(this.marker.x),
            y: this.layer.getTileY(this.marker.y),
            isFlipped: true,
            id: hiddenTileId
        };
        this.map.putTile(hiddenTileId, this.secondFlippedTile.x, this.secondFlippedTile.y);
        this.currentTile = this.map.getTile(this.secondFlippedTile.x, this.secondFlippedTile.y);
        if (this.firstFlippedTile.id === this.secondFlippedTile.id) {
            this.firstFlippedTile.isMatched = true;
            this.secondFlippedTile.isMatched = true;
            if (this.gameState.get('tiles').get(hiddenTileId)) {
                this.stateHistory.push(this.gameState);
                this.gameState = this.gameState.setIn(['tiles', this.firstFlippedTile.id, 'isMatched'], true);
                this.gameState = this.gameState.setIn(['tiles', this.firstFlippedTile.id, 'canFlip'], false);
                this.gameState = this.gameState.setIn(['tiles', this.secondFlippedTile.id, 'isMatched'], true);
                this.gameState = this.gameState.setIn(['tiles', this.firstFlippedTile.id, 'canFlip'], false);
                this.gameState = this.gameState.update('tilePairsMatched', (v: any) => v + 1);
                this.gameState = this.gameState.update('turnsTaken', (v: any) => v + 1);
                this.stateHistory.push(this.gameState);
                console.log('its a match!!!');
            }
        } else {
            this.gameState = this.gameState.update('turnsTaken', (v: any) => v + 1);
            this.stateHistory.push(this.gameState);
        }
        console.log('firstFlippedTile.Id: ', this.firstFlippedTile.id);
        console.log('secondFlippedTile.Id: ', this.secondFlippedTile.id);
        console.log('turnsTaken: ', this.gameState.get('turnsTaken'));
        console.log('Matched Pairs: ', this.gameState.get('tilePairsMatched'));
        console.log('Hidden Tile, this.currentTile: ', this.currentTile);
        this.game.input.mouse.enabled = false;
        this.timer.start();
    } else {
        console.log('flippedTileCounter: ', this.flippedTileCounter);
        this.firstFlippedTile = {
            x: this.layer.getTileX(this.marker.x),
            y: this.layer.getTileY(this.marker.y),
            isFlipped: true,
            id: hiddenTileId
        };
        this.map.putTile(hiddenTileId, this.firstFlippedTile.x, this.firstFlippedTile.y);
        this.currentTile = this.map.getTile(this.firstFlippedTile.x, this.firstFlippedTile.y);
        console.log('Hidden Tile, this.currentTile: ', this.currentTile);
    };
    this.timer.loop(1500, flipBack, this);
};
}
// end of class

function revealTile(game: any, tile: any) {
    // console.log(game.getIn(['tiles', tile]));
}

function flipBack() {
    console.log('flipOver');
    this.flipFlag = false;
    if (!this.firstFlippedTile.isMatched && !this.secondFlippedTile.isMatched) {
        this.map.putTile(36, this.firstFlippedTile.x, this.firstFlippedTile.y);
        this.map.putTile(36, this.secondFlippedTile.x, this.secondFlippedTile.y);
    }
    this.flippedTileCounter = 0;
    this.firstFlippedTile = {};
    this.secondFlippedTile = {};
    this.game.input.mouse.enabled = true;
    this.timer.stop();
}
