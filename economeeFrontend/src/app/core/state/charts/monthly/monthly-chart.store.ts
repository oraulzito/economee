import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { MonthlyChart } from './monthly-chart.model';

export interface MonthlyChartState extends EntityState<MonthlyChart> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'MonthlyCharts' })
export class MonthlyChartStore extends EntityStore<MonthlyChartState> {

  constructor() {
    super();
  }

}
