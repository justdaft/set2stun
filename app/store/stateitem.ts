
import { Map } from 'immutable';

interface ITile {
    _id?: number;
    tileImageId?: number;
    uuid?: any;
    isMatched?: boolean;
    x?: number;
    y?: number;
    canFlip?: boolean;
  }

export class StateItem {
  _data: Map<string, any>;

  get uuid() {
    return <string> this._data.get('uuid');
  }

  get item() {
    return <string> this._data.get('item');
  }

  setItem(value: ITile) {
    return new StateItem(this._data.set('item', value));
  }

  // get completed() {
  //   return <boolean> this._data.get('completed');
  // }
  //
  // setCompleted(value: boolean) {
  //   return new TodoItem(this._data.set('completed', value));
  // }

  constructor(data: any = undefined) {
    data = data || { text: '', completed: false, uuid: uuid.v4() };
    this._data = Map<string, any>(data);
  }
}
