import { createStore, withProps } from '@ngneat/elf';
import { withEntities, selectAllEntities, setEntities, addEntities, updateEntities, deleteEntities, withUIEntities, withActiveId, selectActiveEntity, setActiveId, withActiveIds, selectActiveEntities, toggleActiveIds } from '@ngneat/elf-entities';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

export interface MonthlyUI {
  id: number;
}

export interface Monthly {
  id: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MonthlyProps {
}

@Injectable({ providedIn: 'root' })
export class MonthlyRepository {
  activeMonthly$: Observable<Monthly[]>;
  activeMonthly$: Observable<Monthly | undefined>;
  monthly$: Observable<Monthly[]>;

  private store;

  constructor() {
    this.store = this.createStore();
    this.monthly$ = this.store.pipe(selectAllEntities());
    this.activeMonthly$ = this.store.pipe(selectActiveEntity());
    this.activeMonthly$ = this.store.pipe(selectActiveEntities());
  }

  setMonthly(monthly: Monthly[]) {
    this.store.update(setEntities(monthly));
  }

  addMonthly(monthly: Monthly) {
    this.store.update(addEntities(monthly));
  }

  updateMonthly(id: Monthly['id'], monthly: Partial<Monthly>) {
    this.store.update(updateEntities(id, monthly));
  }

  deleteMonthly(id: Monthly['id']) {
    this.store.update(deleteEntities(id));
  }

  setActiveId(id: Monthly['id']) {
    this.store.update(setActiveId(id));
  }

  toggleActiveIds(ids: Array<Monthly['id']>) {
    this.store.update(toggleActiveIds(ids));
  }

  private createStore(): typeof store {
    const store = createStore({ name: 'monthly' }, withProps<MonthlyProps>({}), withEntities<Monthly, 'id'>({ idKey: 'id' }), withUIEntities<MonthlyUI, 'id'>({ idKey: 'id' }), withActiveId(), withActiveIds());

    return store;
  }
}
