import {Injectable} from '@angular/core';
import {QueryEntity} from '@datorama/akita';
import {BalanceState, BalanceStore} from './balance.store';
import {format} from "date-fns";

@Injectable({providedIn: 'root'})
export class BalanceQuery extends QueryEntity<BalanceState> {
  activeEntity$ = this.selectActive();
  dateReference$ = this.selectActive(({date_reference}) => {
    let d = new Date(date_reference);
    d.setDate(d.getDate() + 1);
    return format(d, 'yyyy-MM');
  });
  totalExpenses$ = this.selectActive(({total_expenses}) => total_expenses);
  totalIncomes$ = this.selectActive(({total_incomes}) => total_incomes);
  willRemainWithPaid$ = this.selectActive(({will_remain_with_paid}) => will_remain_with_paid);
  willRemainWithoutPaid$ = this.selectActive(({will_remain_without_paid}) => will_remain_without_paid);

  constructor(protected store: BalanceStore) {
    super(store);
  }

}
