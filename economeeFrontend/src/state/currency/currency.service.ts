import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {shareReplay, tap} from 'rxjs/operators';
import {Currency} from './currency.model';
import {CurrencyStore} from './currency.store';

@Injectable({providedIn: 'root'})
export class CurrencyService {

  constructor(private currencyStore: CurrencyStore, private http: HttpClient) {
  }

  // tslint:disable-next-line:typedef
  get() {
    return this.http.get<Currency[]>('/api/currency/').pipe(tap(entities => {
      this.currencyStore.set(entities);
    }),
      shareReplay(1));
  }
}
