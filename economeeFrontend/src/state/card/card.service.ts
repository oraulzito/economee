import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { tap } from 'rxjs/operators';
import { Card } from './card.model';
import { CardStore } from './card.store';

@Injectable({ providedIn: 'root' })
export class CardService {

  constructor(private cardStore: CardStore, private http: HttpClient) {
  }


  get() {
    return this.http.get<Card[]>('https://api.com').pipe(tap(entities => {
      this.cardStore.set(entities);
    }));
  }

  add(card: Card) {
    this.cardStore.add(card);
  }

  update(id, card: Partial<Card>) {
    this.cardStore.update(id, card);
  }

  remove(id: ID) {
    this.cardStore.remove(id);
  }

}
