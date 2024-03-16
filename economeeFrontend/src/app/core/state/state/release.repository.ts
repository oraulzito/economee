import { createStore, withProps } from '@ngneat/elf';
import { withEntities, selectAllEntities, setEntities, addEntities, updateEntities, deleteEntities, withUIEntities, withActiveId, selectActiveEntity, setActiveId, withActiveIds, selectActiveEntities, toggleActiveIds } from '@ngneat/elf-entities';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

export interface ReleaseUI {
  id: number;
}

export interface Release {
  id: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ReleaseProps {
}

@Injectable({ providedIn: 'root' })
export class ReleaseRepository {
  activeRelease$: Observable<Release[]>;
  activeRelease$: Observable<Release | undefined>;
  release$: Observable<Release[]>;

  private store;

  constructor() {
    this.store = this.createStore();
    this.release$ = this.store.pipe(selectAllEntities());
    this.activeRelease$ = this.store.pipe(selectActiveEntity());
    this.activeRelease$ = this.store.pipe(selectActiveEntities());
  }

  setRelease(release: Release[]) {
    this.store.update(setEntities(release));
  }

  addRelease(release: Release) {
    this.store.update(addEntities(release));
  }

  updateRelease(id: Release['id'], release: Partial<Release>) {
    this.store.update(updateEntities(id, release));
  }

  deleteRelease(id: Release['id']) {
    this.store.update(deleteEntities(id));
  }

  setActiveId(id: Release['id']) {
    this.store.update(setActiveId(id));
  }

  toggleActiveIds(ids: Array<Release['id']>) {
    this.store.update(toggleActiveIds(ids));
  }

  private createStore(): typeof store {
    const store = createStore({ name: 'release' }, withProps<ReleaseProps>({}), withEntities<Release, 'id'>({ idKey: 'id' }), withUIEntities<ReleaseUI, 'id'>({ idKey: 'id' }), withActiveId(), withActiveIds());

    return store;
  }
}
