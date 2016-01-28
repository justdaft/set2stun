export class MatchingPairs {
    game: Phaser.Game;
    map: Phaser.Tilemap;
    layer: any;
    timeCheck = 0;
    flipFlag: boolean = false;
    startList: Array<any> = [];
    squareList: Array<any> = [];
    shuffledList: Array<any> = [];
    masterCounter: number = 0;
    squareCounter: number = 0;
    square1Num: any;
    square2Num: any;
    savedSquareX1: any;
    savedSquareY1: any;
    savedSquareX2: any;
    savedSquareY2: any;
    tileset: any;
    marker: any;
    currentTile: any;
    currentTilePosition: any;
    tileBack: number = 25;
    timesUp: any = '+';
    youWin: any = '+';
    myCountdownSeconds: any;

    constructor() {
        this.game = new Phaser.Game(800, 600, Phaser.CANVAS, 'content', {
            create: this.create,
            preload: this.preload,
            update: this.update,
            render: this.render
        });
    }

    preload() {
        this.game.load.tilemap('matching', 'app/matching_pairs/assets/phaser_tiles.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles', 'app/matching_pairs/assets/phaser_tiles.png');
    }

    create() {
        this.map = this.game.add.tilemap('matching');
        this.map.addTilesetImage('Desert', 'tiles');
        this.layer = this.map.createLayer('Ground');

        this.marker = this.game.add.graphics(0, 0);
        this.marker.lineStyle(2, 0x00FF00, 1);
        this.marker.drawRect(0, 0, 100, 100);

        this.startList = RandomizeTiles();
        console.log('this.startList', this.startList);
        this.shuffledList = Phaser.ArrayUtils.shuffle(this.startList);
        console.log('this.shuffledList', this.shuffledList);
        for (let col = 0; col < 6; col++) {
            for (let row = 0; row < 6; row++) {
                this.map.putTile(36, col, row);
            }
        }
    }

    update() {
        if (this.layer.getTileX(this.game.input.activePointer.worldX) <= 5) {
            this.marker.x = this.layer.getTileX(this.game.input.activePointer.worldX) * 100;
            this.marker.y = this.layer.getTileY(this.game.input.activePointer.worldY) * 100;
            let flip = () => {
                flipBack();
            console.log('flipped');
        };
        }
        let flip = () => {
            flipBack();
            console.log('flipped');
        };
        // if (this.flipFlag === true) {
        //     // if (this.game.time.totalElapsedSeconds() - this.timeCheck > 0.5) {
        //     //     let flip = () => {
        //     //         flipBack();
        //     //     };
        //     // }
        // } else {
        //     // this.processClick();
        // }
        // console.log('flipped');
    }

    render() {
        //  this.game.debug.spriteInfo(this.sprite, 32, 32);
    }

}

function RandomizeTiles() {
    let startList: Array<any> = [];
    for (let num = 1; num <= 18; num++) {
        startList.push(num);
    }
    for (let num = 1; num <= 18; num++) {
        startList.push(num);
    }
    return startList;
};

function flipOver() {
    this.map.putTile(this.currentNum, this.layer.getTileX(this.marker.x), this.layer.getTileY(this.marker.y));
}

function flipBack() {
    this.flipFlag = false;
    this.map.putTile(this.tileBack, this.savedSquareX1, this.savedSquareY1);
    this.map.putTile(this.tileBack, this.savedSquareX2, this.savedSquareY2);

}

function processClick() {
    this.currentTile = this.map.getTile(this.layer.getTileX(this.marker.x), this.layer.getTileY(this.marker.y));
    this.currentTilePosition = ((this.layer.getTileY(
        this.game.input.activePointer.worldY) + 1 ) * 6 ) - ( 6 - (
            this.layer.getTileX(this.game.input.activePointer.worldX) + 1 ));
    if (this.game.input.mousePointer.isDown) {
        // check to make sure the tile is not already flipped
        if (this.currentTile.index === this.tileBack) {
            // get the corresponding item out of squareList
                this.currentNum = this.squareList[this.currentTilePosition - 1 ];
            flipOver();
                this.squareCounter++;
            // is the second tile of pair flipped?
            if  (this.squareCounter === 2) {
                // reset squareCounter
                this.squareCounter = 0;
                this.square2Num = this.currentNum;
                // check for match
                if ( this.square1Num ===  this.square2Num) {
                     this.masterCounter++;
                    if ( this.masterCounter === 18) {
                        // go "win"
                         this.youWin = 'Got them all!';
                    }
                } else {
                     this.savedSquareX2 =  this.layer.getTileX( this.marker.x);
                     this.savedSquareY2 =  this.layer.getTileY( this.marker.y);
                     this.flipFlag = true;
                     this.timeCheck =  this.game.time.totalElapsedSeconds();
                }
            } else {
                 this.savedSquareX1 =  this.layer.getTileX( this.marker.x);
                 this.savedSquareY1 =  this.layer.getTileY( this.marker.y);
                 this.square1Num =  this.currentNum;
            }
        }
    }
}
