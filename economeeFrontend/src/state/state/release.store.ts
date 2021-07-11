import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Release } from './release.model';

export interface ReleaseState extends EntityState<Release> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'release' })
export class ReleaseStore extends EntityStore<ReleaseState> {

  constructor() {
    super();
  }

}
