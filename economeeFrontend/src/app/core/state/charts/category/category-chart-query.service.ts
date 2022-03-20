import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { CategoryChartStore, CategoryState } from './category-chart-store.service';

@Injectable({ providedIn: 'root' })
export class CategoryChartQuery extends QueryEntity<CategoryState> {

  constructor(protected store: CategoryChartStore) {
    super(store);
  }

}
