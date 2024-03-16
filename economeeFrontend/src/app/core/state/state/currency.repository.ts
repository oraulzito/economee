import { createStore, withProps } from '@ngneat/elf';
import { withEntities, selectAllEntities, setEntities, addEntities, updateEntities, deleteEntities, withUIEntities, withActiveId, selectActiveEntity, setActiveId, withActiveIds, selectActiveEntities, toggleActiveIds } from '@ngneat/elf-entities';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

export interface CurrencyUI {
  id: number;
}

export interface Currency {
  id: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CurrencyProps {
}

@Injectable({ providedIn: 'root' })
export class CurrencyRepository {
  activeCurrency$: Observable<Currency[]>;
  activeCurrency$: Observable<Currency | undefined>;
  currency$: Observable<Currency[]>;

  private store;

  constructor() {
    this.store = this.createStore();
    this.currency$ = this.store.pipe(selectAllEntities());
    this.activeCurrency$ = this.store.pipe(selectActiveEntity());
    this.activeCurrency$ = this.store.pipe(selectActiveEntities());
  }

  setCurrency(currency: Currency[]) {
    this.store.update(setEntities(currency));
  }

  addCurrency(currency: Currency) {
    this.store.update(addEntities(currency));
  }

  updateCurrency(id: Currency['id'], currency: Partial<Currency>) {
    this.store.update(updateEntities(id, currency));
  }

  deleteCurrency(id: Currency['id']) {
    this.store.update(deleteEntities(id));
  }

  setActiveId(id: Currency['id']) {
    this.store.update(setActiveId(id));
  }

  toggleActiveIds(ids: Array<Currency['id']>) {
    this.store.update(toggleActiveIds(ids));
  }

  private createStore(): typeof store {
    const store = createStore({ name: 'currency' }, withProps<CurrencyProps>({}), withEntities<Currency, 'id'>({ idKey: 'id' }), withUIEntities<CurrencyUI, 'id'>({ idKey: 'id' }), withActiveId(), withActiveIds());

    return store;
  }
}
