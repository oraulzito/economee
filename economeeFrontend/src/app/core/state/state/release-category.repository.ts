import { createStore, withProps } from '@ngneat/elf';
import { withEntities, selectAllEntities, setEntities, addEntities, updateEntities, deleteEntities, withUIEntities, withActiveId, selectActiveEntity, setActiveId, withActiveIds, selectActiveEntities, toggleActiveIds } from '@ngneat/elf-entities';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

export interface ReleaseCategoryUI {
  id: number;
}

export interface ReleaseCategory {
  id: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ReleaseCategoryProps {
}

@Injectable({ providedIn: 'root' })
export class ReleaseCategoryRepository {
  activeReleaseCategory$: Observable<ReleaseCategory[]>;
  activeReleaseCategory$: Observable<ReleaseCategory | undefined>;
  releaseCategory$: Observable<ReleaseCategory[]>;

  private store;

  constructor() {
    this.store = this.createStore();
    this.releaseCategory$ = this.store.pipe(selectAllEntities());
    this.activeReleaseCategory$ = this.store.pipe(selectActiveEntity());
    this.activeReleaseCategory$ = this.store.pipe(selectActiveEntities());
  }

  setReleaseCategory(releaseCategory: ReleaseCategory[]) {
    this.store.update(setEntities(releaseCategory));
  }

  addReleaseCategory(releaseCategory: ReleaseCategory) {
    this.store.update(addEntities(releaseCategory));
  }

  updateReleaseCategory(id: ReleaseCategory['id'], releaseCategory: Partial<ReleaseCategory>) {
    this.store.update(updateEntities(id, releaseCategory));
  }

  deleteReleaseCategory(id: ReleaseCategory['id']) {
    this.store.update(deleteEntities(id));
  }

  setActiveId(id: ReleaseCategory['id']) {
    this.store.update(setActiveId(id));
  }

  toggleActiveIds(ids: Array<ReleaseCategory['id']>) {
    this.store.update(toggleActiveIds(ids));
  }

  private createStore(): typeof store {
    const store = createStore({ name: 'releaseCategory' }, withProps<ReleaseCategoryProps>({}), withEntities<ReleaseCategory, 'id'>({ idKey: 'id' }), withUIEntities<ReleaseCategoryUI, 'id'>({ idKey: 'id' }), withActiveId(), withActiveIds());

    return store;
  }
}
