import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Currency} from './currency.model';
import {CurrencyStore} from './currency.store';

@Injectable({providedIn: 'root'})
export class CurrencyService {

  constructor(
    private currencyStore: CurrencyStore,
    private http: HttpClient
  ) {
  }

  // tslint:disable-next-line:typedef
  get() {
    this.currencyStore.setLoading(true);

    return this.http.get<Currency[]>('/api/currency/').subscribe(
      entities => this.currencyStore.set(entities),
      error => this.currencyStore.setError(error),
      () => this.currencyStore.setLoading(false)
    );
  }
}
