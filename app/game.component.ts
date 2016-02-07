import {Component} from 'angular2/core';
// import {Fazer} from './fazer';
import {MatchingGame} from './matching/matching.game';
import StateStore from './store/statestore';
import StateList from './devtools/statelist';
import {addItem, removeItem} from './store/actions';

interface ITile {
    _id?: number;
    tileImageId?: number;
    uuid?: any;
    isMatched?: boolean;
    x?: number;
    y?: number;
    canFlip?: boolean;
}

@Component({
    selector: 'my-game',
    templateUrl: 'app/game.component.html',
    styleUrls: ['app/game.component.css'],
    directives: [StateList]
})

export class GameComponent {
    game: Phaser.Game;
    store: StateStore;
    currentGame: any;
    newItem = 'test';
    counter: number = 0;

    constructor(store: StateStore) {
        this.store = store;
        // this.currentGame = new MatchingGame();

    }

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
    }

    // addItem() {
    //   this.counter++;
    //   let tmpItem = {
    //     _id: this.counter,
    //     tileImageId: this.counter,
    //     x: 0,
    //     y: 0,
    //     uuid: uuid.v4(),
    //     isMatched: false,
    //     canFlip: true,
    //   };
    //   console.log('tmpItem: ', tmpItem);
    //   this.store.dispatch(addItem(tmpItem));
    //   this.newItem = '';
    // }
    //
    // removeItem(itemId: string) {
    //   this.store.dispatch(removeItem(itemId));
    // }

}
