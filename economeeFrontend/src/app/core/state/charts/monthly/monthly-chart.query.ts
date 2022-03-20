import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { MonthlyChartStore, MonthlyChartState } from './monthly-chart.store';

@Injectable({ providedIn: 'root' })
export class MonthlyChartQuery extends QueryEntity<MonthlyChartState> {

  constructor(protected store: MonthlyChartStore) {
    super(store);
  }

}
