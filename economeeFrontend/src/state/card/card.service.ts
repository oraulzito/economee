import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ID} from '@datorama/akita';
import {shareReplay, tap} from 'rxjs/operators';
import {Card} from './card.model';
import {CardStore} from './card.store';
import {UiService} from '../ui/ui.service';

@Injectable({providedIn: 'root'})
export class CardService {

  constructor(
    private uiService: UiService,
    private cardStore: CardStore,
    private http: HttpClient
  ) {
  }

  // tslint:disable-next-line:typedef
  get() {
    return this.http.get<Card[]>('/api/card/', this.uiService.httpHeaderOptions()).pipe(tap(entities => {
        this.cardStore.set(entities);
      }),
      shareReplay(1));
  }

  // tslint:disable-next-line:typedef
  add(card: Card) {
    this.cardStore.add(card);
  }

  // tslint:disable-next-line:typedef
  update(id, card: Partial<Card>) {
    this.cardStore.update(id, card);
  }

  // tslint:disable-next-line:typedef
  remove(id: ID) {
    this.cardStore.remove(id);
  }
}
