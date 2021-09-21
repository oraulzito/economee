import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ID} from '@datorama/akita';
import {Card} from './card.model';
import {CardStore} from './card.store';
import {UiService} from '../ui/ui.service';
import {tap} from "rxjs/operators";

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
    this.cardStore.setLoading(true);

    return this.http.get<Card[]>('/api/card/', this.uiService.httpHeaderOptions()).subscribe(
      entities => this.cardStore.set(entities),
      error => this.cardStore.setError(error),
      () => this.cardStore.setLoading(false)
    );
  }

  // tslint:disable-next-line:typedef
  add(form) {
    this.cardStore.setLoading(true);

    const body = {
      name: form.name,
      credit: form.credit,
      pay_date: form.pay_date,
      account_id: form.account_id,
    };

    return this.http.post<Card>('/api/card/', body, this.uiService.httpHeaderOptions()).pipe(tap(
        entity => this.cardStore.add(entity),
        error => this.cardStore.setError(error),
        () => this.cardStore.setLoading(false),
      )
    );
  }

  // tslint:disable-next-line:typedef
  update(id, form) {
    this.cardStore.setLoading(true);

    const body = {
      name: form.name,
      credit: form.credit,
      pay_date: form.pay_date,
    };

    return this.http.patch<Card>('/api/card/' + id + '/', body, this.uiService.httpHeaderOptions()).subscribe(
      entity => this.cardStore.update(id, entity),
      error => this.cardStore.setError(error),
      () => this.cardStore.setLoading(false),
    );
  }

  // tslint:disable-next-line:typedef
  remove(id: ID) {
    this.cardStore.setLoading(true);

    return this.http.delete<number>('/api/card/' + id + '/', this.uiService.httpHeaderOptions()).subscribe(
      entities => entities === 1 ? this.cardStore.remove(id) : this.cardStore.setError("Not removed"),
      error => this.cardStore.setError(error),
      () => this.cardStore.setLoading(false),
    );
  }
}
