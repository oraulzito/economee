import {Injectable} from '@angular/core';
import {QueryEntity} from '@datorama/akita';
import {ReleaseCategoryState, ReleaseCategoryStore} from "./release-category.store";


@Injectable({providedIn: 'root'})
export class ReleaseCategoryQuery extends QueryEntity<ReleaseCategoryState> {
  selectAllAsOptions$ = this.selectAll().subscribe(
    c => {
      let categories = [];
      c.map(item => {
        categories.push({
          label: item.name,
          value: item.id
        })
      });
      return categories;
    });

  constructor(protected store: ReleaseCategoryStore) {
    super(store);
  }

}
