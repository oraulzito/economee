import {Injectable} from '@angular/core';
import {ActiveState, EntityState, EntityStore, StoreConfig} from '@datorama/akita';
import {Card} from './card.model';

export interface CardState extends EntityState<Card>, ActiveState {
}

@Injectable({providedIn: 'root'})
@StoreConfig({name: 'card'})
export class CardStore extends EntityStore<CardState> {

  constructor() {
    super();
  }

}
