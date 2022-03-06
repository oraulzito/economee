import {Injectable} from '@angular/core';
import {QueryEntity} from '@datorama/akita';
import {BalanceState, BalanceStore} from './balance.store';

@Injectable({providedIn: 'root'})
export class BalanceQuery extends QueryEntity<BalanceState> {
  activeEntity$ = this.selectActive();
  dateReference$ = this.selectActive(({date_reference}) => {
    return new Date(date_reference);
  });
  totalExpenses$ = this.selectActive(({total_expenses}) => total_expenses);
  totalIncomes$ = this.selectActive(({total_incomes}) => total_incomes);
  willRemainWithPaid$ = this.selectActive(({will_remain_with_paid}) => will_remain_with_paid);
  willRemainWithoutPaid$ = this.selectActive(({will_remain_without_paid}) => will_remain_without_paid);

  constructor(protected store: BalanceStore) {
    super(store);
  }

}
