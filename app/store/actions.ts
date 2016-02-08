import { IGameStateAction } from './reducer';
import { ITile } from '../ITile';

export function addItem(item: ITile): IGameStateAction {
  return {
    type: 'ADD',
    item
  };
}

export function removeItem(itemId: string): IGameStateAction {
  return {
    type: 'REMOVE',
    itemId
  };
}

// export function updateItemText(itemId: string, text: string): ITodoAction {
//   return {
//     type: 'UPDATE_ITEM_TEXT',
//     itemId,
//     item
//   };
// }
//
// export function updateItemCompletion(itemId: string, completed: boolean): ITodoAction {
//   return {
//     type: 'UPDATE_ITEM_COMPLETION',
//     itemId,
//     completed
//   };
// }
