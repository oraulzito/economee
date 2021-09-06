import {Injectable} from '@angular/core';
import {Query} from '@datorama/akita';
import {MonthByMonthState, MonthByMonthStore} from './month-by-month.store';

@Injectable({providedIn: 'root'})
export class MonthByMonthQuery extends Query<MonthByMonthState> {

  constructor(protected store: MonthByMonthStore) {
    super(store);
  }

}
