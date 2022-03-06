import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { CategoryGraphicsStore, CategoryState } from './category-graphics.store';

@Injectable({ providedIn: 'root' })
export class CategoryGraphicsQuery extends QueryEntity<CategoryState> {

  constructor(protected store: CategoryGraphicsStore) {
    super(store);
  }

}
