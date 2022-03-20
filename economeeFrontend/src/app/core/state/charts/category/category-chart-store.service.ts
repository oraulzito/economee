import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { CategoryChart } from './category-chart.model';

export interface CategoryState extends EntityState<CategoryChart> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'category' })
export class CategoryChartStore extends EntityStore<CategoryState> {

  constructor() {
    super();
  }

}
