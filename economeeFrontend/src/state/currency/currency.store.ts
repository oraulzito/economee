import { Injectable } from '@angular/core';
import {ActiveState, EntityState, EntityStore, StoreConfig} from '@datorama/akita';
import { Currency } from './currency.model';

export interface CurrencyState extends EntityState<Currency>, ActiveState  {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'currency' })
export class CurrencyStore extends EntityStore<CurrencyState> {

  constructor() {
    super();
  }

}
