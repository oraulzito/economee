import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { BalanceStore, BalanceState } from './balance.store';

@Injectable({ providedIn: 'root' })
export class BalanceQuery extends QueryEntity<BalanceState> {

  constructor(protected store: BalanceStore) {
    super(store);
  }

}
