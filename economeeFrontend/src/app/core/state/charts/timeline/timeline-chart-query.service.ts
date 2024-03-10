import {Injectable} from '@angular/core';
import {QueryEntity} from '@datorama/akita';
import {TimelineChartState, TimelineChartStore} from './timeline-chart.store';

@Injectable({providedIn: 'root'})
export class TimelineChartQuery extends QueryEntity<TimelineChartState> {
  dateReference$ = this.select(({reference_date}) => reference_date);
  totalExpenses$ = this.select(({total_expenses}) => total_expenses);
  totalIncomes$ = this.select(({total_incomes}) => total_incomes);

  constructor(protected store: TimelineChartStore) {
    super(store);
  }

}
