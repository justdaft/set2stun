import {Component, OnInit} from 'angular2/core';
import StateStore from './store/statestore';
import {ITile} from './matching.game.models';
import StateList from './devtools/statelist';
import {addItem, removeItem} from './store/actions';

@Component({
    selector: 'matching-game',
    templateUrl: 'app/matching/matching.game.component.html',
    styleUrls: ['app/matching/matching.game.component.css'],
    directives: [StateList]
})

export class MatchingGame implements OnInit {
    game: Phaser.Game;
    store: StateStore;
    currentGame: any;
    newItem = 'test';
    counter: number = 0;


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

    currentTilePosition: any;
    tileBack: number = 25;
    timesUp: any = '+';
    youWin: any = '+';
    myCountdownSeconds: number;
    turnCounter: number;
    currentTiles: Array<any>;
    tileGrid: Array<any>;
    levelArray: Array<any>;
    shuffledLevelArray: Array<any>;
    currentTile: any;
    firstFlippedTile: ITile;
    secondFlippedTile: ITile;
    flippedTileCounter: number;
    timer: Phaser.Timer;
    levelData: any;
    stateHistory: any = [];
    gameState: any;
    newGameState: any;
    background: any;
    filter: any;

    constructor(store: StateStore) {
        this.store = store;
        this.game = new Phaser.Game(900, 600, Phaser.AUTO, 'content', {
            preload: this.preload,
            create: this.create,
            update: this.update,
            render: this.render
        });
    };

    ngOnInit() { 
        //
    };

    preload() {
        this.game.load.tilemap('matching', 'app/matching/assets/adventure_time.json', null, Phaser.Tilemap.TILED_JSON);
        // this.game.load.image('tiles', 'app/matching/assets/phaser_tiles.png');
        // this.game.load.tilemap('matching', 'app/matching/assets/phaser_tiles.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles', 'app/matching/assets/adventure_time.png');
        // this.game.load.text('level_1_data', 'app/data/level_1.json');
        this.game.load.text('level_data', 'app/matching/data/level_data.json');
        this.game.load.script('filter', 'https://cdn.rawgit.com/photonstorm/phaser/master/filters/Fire.js');

    };

    create() {
        this.background = this.game.add.sprite(600, 0);
        this.background.width = 300;
        this.background.height = 600;
        let {fromJS, List, Map} = Immutable;

        // let level_1_data = JSON.parse(this.game.cache.getText('level_1_data'));
        this.stateHistory = [];

        let level_data = JSON.parse(this.game.cache.getText('level_data'));

        this.flippedTileCounter = 0;
        this.levelArray = [];
        this.shuffledLevelArray = [];

        // for (let num = 1; num <= 18; num++) {
        //     this.levelArray.push(num);
        // }
        // for (let num = 1; num <= 18; num++) {
        //     this.levelArray.push(num);
        // }

        this.shuffledLevelArray = Phaser.ArrayUtils.shuffle(level_data);
        // console.log('this.shuffledLevelArray: ', this.shuffledLevelArray);
        this.gameState = Immutable.Map({
            tiles: Immutable.List()
        });

        console.log('this.gameState: ', this.gameState);
        this.stateHistory.push(this.gameState);
        // console.log('this.stateHistory: ', this.stateHistory);

        this.gameState = this.gameState.mergeDeep({
            tiles: this.shuffledLevelArray,
            playerName: 'Player 1',
            tilePairsMatched: 0,
            turnsTaken: 0
        });

        // console.log('this.gameState: ', this.gameState);
        this.stateHistory.push(this.gameState);
        // console.log('this.stateHistory: ', this.stateHistory);


        this.game.input.mouse.capture = true;
        this.game.input.onTap.add(MatchingGame.prototype.onTap, this);

        this.map = this.game.add.tilemap('matching');
        this.map.addTilesetImage('adventure_time', 'tiles');
        this.layer = this.map.createLayer('TileLayer1');

        this.marker = this.game.add.graphics(0, 0);
        this.marker.lineStyle(2, 0x00FF00, 1);
        this.marker.drawRect(0, 0, 100, 100);


        // console.log('shuffledLevelArray: ', this.shuffledLevelArray);

        // put tile cover in place
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
    };

    render() {
        // this.game.debug.text(timesUp, 620, 208, 'rgb(0,255,0)');
        // game.debug.text(youWin, 620, 240, 'rgb(0,255,0)');

        this.game.debug.text('Player Name: ' + this.gameState.get('playerName'), 620, 30, 'rgb(0,255,0)');
        this.game.debug.text('Turns Taken: ' + this.gameState.get('turnsTaken'), 620, 60, 'rgb(0,255,0)');
        this.game.debug.text('Matched Pairs: ' + this.gameState.get('tilePairsMatched'), 620, 90, 'rgb(0,255,0)');
        // this.game.debug.text('Pairs Remaining: ' + ((this.gameState.get('tiles').length - this.gameState.get('tilePairsMatched')) / 2), 620, 120, 'rgb(0,255,0)');
        //game.debug.text('startList: ' + myString1, 620, 208, 'rgb(255,0,0)');
        //game.debug.text('squareList: ' + myString2, 620, 240, 'rgb(255,0,0)');


        // game.debug.text('Tile: ' + map.getTile(layer.getTileX(marker.x), layer.getTileY(marker.y)).index, 620, 48, 'rgb(255,0,0)');

        // game.debug.text('LayerX: ' + layer.getTileX(marker.x), 620, 80, 'rgb(255,0,0)');
        // game.debug.text('LayerY: ' + layer.getTileY(marker.y), 620, 112, 'rgb(255,0,0)');

        // game.debug.text('Tile Position: ' + currentTilePosition, 620, 144, 'rgb(255,0,0)');
        // game.debug.text('Hidden Tile: ' + getHiddenTile(), 620, 176, 'rgb(255,0,0)');
    };

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

        };
    };


    addItem() {
        this.counter++;
        let tmpItem = {
            _id: this.counter,
            tileImageId: this.counter,
            x: 0,
            y: 0,
            uuid: uuid.v4(),
            isMatched: false,
            canFlip: true
        };
        console.log('tmpItem: ', tmpItem);
        this.store.dispatch(addItem(tmpItem));
        this.newItem = '';
    };



    revealTile(game: any, tile: any) {
        // console.log(game.getIn(['tiles', tile]));
    };
}