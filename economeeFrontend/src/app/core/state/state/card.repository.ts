import { createStore, withProps } from '@ngneat/elf';
import { withEntities, selectAllEntities, setEntities, addEntities, updateEntities, deleteEntities, withUIEntities, withActiveId, selectActiveEntity, setActiveId, withActiveIds, selectActiveEntities, toggleActiveIds } from '@ngneat/elf-entities';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

export interface CardUI {
  id: number;
}

export interface Card {
  id: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CardProps {
}

@Injectable({ providedIn: 'root' })
export class CardRepository {
  activeCard$: Observable<Card[]>;
  activeCard$: Observable<Card | undefined>;
  card$: Observable<Card[]>;

  private store;

  constructor() {
    this.store = this.createStore();
    this.card$ = this.store.pipe(selectAllEntities());
    this.activeCard$ = this.store.pipe(selectActiveEntity());
    this.activeCard$ = this.store.pipe(selectActiveEntities());
  }

  setCard(card: Card[]) {
    this.store.update(setEntities(card));
  }

  addCard(card: Card) {
    this.store.update(addEntities(card));
  }

  updateCard(id: Card['id'], card: Partial<Card>) {
    this.store.update(updateEntities(id, card));
  }

  deleteCard(id: Card['id']) {
    this.store.update(deleteEntities(id));
  }

  setActiveId(id: Card['id']) {
    this.store.update(setActiveId(id));
  }

  toggleActiveIds(ids: Array<Card['id']>) {
    this.store.update(toggleActiveIds(ids));
  }

  private createStore(): typeof store {
    const store = createStore({ name: 'card' }, withProps<CardProps>({}), withEntities<Card, 'id'>({ idKey: 'id' }), withUIEntities<CardUI, 'id'>({ idKey: 'id' }), withActiveId(), withActiveIds());

    return store;
  }
}
