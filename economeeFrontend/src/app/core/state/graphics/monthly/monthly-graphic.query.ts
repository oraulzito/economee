import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { MonthlyGraphicStore, MonthlyGraphicsState } from './monthly-graphic.store';

@Injectable({ providedIn: 'root' })
export class MonthlyGraphicQuery extends QueryEntity<MonthlyGraphicsState> {

  constructor(protected store: MonthlyGraphicStore) {
    super(store);
  }

}
