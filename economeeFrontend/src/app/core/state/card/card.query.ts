import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { CardStore, CardState } from './card.store';

@Injectable({ providedIn: 'root' })
export class CardQuery extends QueryEntity<CardState> {
  activeCard$ = this.selectActive();

  constructor(protected store: CardStore) {
    super(store);
  }

}
