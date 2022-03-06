import {Injectable} from '@angular/core';
import {QueryEntity} from '@datorama/akita';
import {ReleaseCategoryState, ReleaseCategoryStore} from "./release-category.store";


@Injectable({providedIn: 'root'})
export class ReleaseCategoryQuery extends QueryEntity<ReleaseCategoryState> {

  constructor(protected store: ReleaseCategoryStore) {
    super(store);
  }

}
