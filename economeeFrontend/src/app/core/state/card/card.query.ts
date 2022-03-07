import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { CardStore, CardState } from './card.store';

@Injectable({ providedIn: 'root' })
export class CardQuery extends QueryEntity<CardState> {
  allCards$ = this.selectAll();
  activeCard$ = this.selectActive();
  activeCardName$ = this.selectActive(({name})=> name);

  constructor(protected store: CardStore) {
    super(store);
  }

}
