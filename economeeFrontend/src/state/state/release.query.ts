import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ReleaseStore, ReleaseState } from './release.store';

@Injectable({ providedIn: 'root' })
export class ReleaseQuery extends QueryEntity<ReleaseState> {

  constructor(protected store: ReleaseStore) {
    super(store);
  }

}
