import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { CategoryRelease } from './category-release.model';

export interface CategoryReleasesState extends EntityState<CategoryRelease> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'categoryReleases' })
export class CategoryReleasesStore extends EntityStore<CategoryReleasesState> {

  constructor() {
    super();
  }

}
