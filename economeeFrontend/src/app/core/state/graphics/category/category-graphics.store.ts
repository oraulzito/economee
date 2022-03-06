import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { CategoryGraphic } from './category-graphics.model';

export interface CategoryState extends EntityState<CategoryGraphic> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'category' })
export class CategoryGraphicsStore extends EntityStore<CategoryState> {

  constructor() {
    super();
  }

}
