import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Currency } from './currency.model';

export interface CurrencyState extends EntityState<Currency> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'currency' })
export class CurrencyStore extends EntityStore<CurrencyState> {

  constructor() {
    super();
  }

}
