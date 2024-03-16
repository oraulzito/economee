import { createStore, withProps } from '@ngneat/elf';
import { withEntities, selectAllEntities, setEntities, addEntities, updateEntities, deleteEntities, withUIEntities, withActiveId, selectActiveEntity, setActiveId, withActiveIds, selectActiveEntities, toggleActiveIds } from '@ngneat/elf-entities';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

export interface BalanceUI {
  id: number;
}

export interface Balance {
  id: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BalanceProps {
}

@Injectable({ providedIn: 'root' })
export class BalanceRepository {
  activeBalance$: Observable<Balance[]>;
  activeBalance$: Observable<Balance | undefined>;
  balance$: Observable<Balance[]>;

  private store;

  constructor() {
    this.store = this.createStore();
    this.balance$ = this.store.pipe(selectAllEntities());
    this.activeBalance$ = this.store.pipe(selectActiveEntity());
    this.activeBalance$ = this.store.pipe(selectActiveEntities());
  }

  setBalance(balance: Balance[]) {
    this.store.update(setEntities(balance));
  }

  addBalance(balance: Balance) {
    this.store.update(addEntities(balance));
  }

  updateBalance(id: Balance['id'], balance: Partial<Balance>) {
    this.store.update(updateEntities(id, balance));
  }

  deleteBalance(id: Balance['id']) {
    this.store.update(deleteEntities(id));
  }

  setActiveId(id: Balance['id']) {
    this.store.update(setActiveId(id));
  }

  toggleActiveIds(ids: Array<Balance['id']>) {
    this.store.update(toggleActiveIds(ids));
  }

  private createStore(): typeof store {
    const store = createStore({ name: 'balance' }, withProps<BalanceProps>({}), withEntities<Balance, 'id'>({ idKey: 'id' }), withUIEntities<BalanceUI, 'id'>({ idKey: 'id' }), withActiveId(), withActiveIds());

    return store;
  }
}
