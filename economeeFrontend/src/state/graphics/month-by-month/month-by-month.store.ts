import { Injectable } from '@angular/core';
import {EntityState, EntityStore, Store, StoreConfig} from '@datorama/akita';
import { MonthByMonth } from './month-by-month.model';

export interface MonthByMonthState extends EntityState<MonthByMonth> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'monthByMonth' })
export class MonthByMonthStore extends Store<MonthByMonthState> {

  constructor() {
    super({});
  }

}
