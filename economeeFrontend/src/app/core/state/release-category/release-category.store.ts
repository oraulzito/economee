import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { ReleaseCategory } from './release-category.model';

export interface ReleaseCategoryState extends EntityState<ReleaseCategory> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'categories' })
export class ReleaseCategoryStore extends EntityStore<ReleaseCategoryState> {

  constructor() {
    super();
  }

}
