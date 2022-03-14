import {Injectable} from '@angular/core';
import {QueryEntity} from '@datorama/akita';
import {TimelineState, TimelineStore} from './timeline.store';

@Injectable({providedIn: 'root'})
export class TimelineQuery extends QueryEntity<TimelineState> {
  dateReference$ = this.select(({date_reference}) => date_reference);
  totalExpenses$ = this.select(({total_expenses}) => total_expenses);
  totalIncomes$ = this.select(({total_incomes}) => total_incomes);

  constructor(protected store: TimelineStore) {
    super(store);
  }

}
