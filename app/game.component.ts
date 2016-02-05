
import {Component} from 'angular2/core';
// import {Fazer} from './fazer';
import {Matching} from './matching/matching.game';

@Component({
    selector: 'my-game',
    templateUrl: 'app/game.component.html',
    styleUrls: ['app/game.component.css']
})

export class GameComponent {
    game: Phaser.Game;

    currentGame: any;
    constructor() {
        this.currentGame = new Matching();

        console.log('constructor');
    }

}
