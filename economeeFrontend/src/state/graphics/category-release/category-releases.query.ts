import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { CategoryReleasesStore, CategoryReleasesState } from './category-releases.store';

@Injectable({ providedIn: 'root' })
export class CategoryReleasesQuery extends QueryEntity<CategoryReleasesState> {

  constructor(protected store: CategoryReleasesStore) {
    super(store);
  }

}
