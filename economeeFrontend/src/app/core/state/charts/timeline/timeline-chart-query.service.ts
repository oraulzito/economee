import {Injectable} from '@angular/core';
import {QueryEntity} from '@datorama/akita';
import {TimelineChartState, TimelineChartStore} from './timeline-chart.store';

@Injectable({providedIn: 'root'})
export class TimelineChartQuery extends QueryEntity<TimelineChartState> {
  dateReference$ = this.select(({date_reference}) => date_reference);
  totalExpenses$ = this.select(({total_expenses}) => total_expenses);
  totalIncomes$ = this.select(({total_incomes}) => total_incomes);

  constructor(protected store: TimelineChartStore) {
    super(store);
  }

}
