import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { CurrencyStore, CurrencyState } from './currency.store';

@Injectable({ providedIn: 'root' })
export class CurrencyQuery extends QueryEntity<CurrencyState> {
  allCurrencies$ = this.selectAll();
  constructor(protected store: CurrencyStore) {
    super(store);
  }

}
