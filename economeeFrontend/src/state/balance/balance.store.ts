import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Balance } from './balance.model';

export interface BalanceState extends EntityState<Balance> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'balance' })
export class BalanceStore extends EntityStore<BalanceState> {

  constructor() {
    super();
  }

}
