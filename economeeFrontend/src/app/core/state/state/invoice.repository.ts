import { createStore, withProps } from '@ngneat/elf';
import { withEntities, selectAllEntities, setEntities, addEntities, updateEntities, deleteEntities, withUIEntities, withActiveId, selectActiveEntity, setActiveId, withActiveIds, selectActiveEntities, toggleActiveIds } from '@ngneat/elf-entities';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

export interface InvoiceUI {
  id: number;
}

export interface Invoice {
  id: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface InvoiceProps {
}

@Injectable({ providedIn: 'root' })
export class InvoiceRepository {
  activeInvoice$: Observable<Invoice[]>;
  activeInvoice$: Observable<Invoice | undefined>;
  invoice$: Observable<Invoice[]>;

  private store;

  constructor() {
    this.store = this.createStore();
    this.invoice$ = this.store.pipe(selectAllEntities());
    this.activeInvoice$ = this.store.pipe(selectActiveEntity());
    this.activeInvoice$ = this.store.pipe(selectActiveEntities());
  }

  setInvoice(invoice: Invoice[]) {
    this.store.update(setEntities(invoice));
  }

  addInvoice(invoice: Invoice) {
    this.store.update(addEntities(invoice));
  }

  updateInvoice(id: Invoice['id'], invoice: Partial<Invoice>) {
    this.store.update(updateEntities(id, invoice));
  }

  deleteInvoice(id: Invoice['id']) {
    this.store.update(deleteEntities(id));
  }

  setActiveId(id: Invoice['id']) {
    this.store.update(setActiveId(id));
  }

  toggleActiveIds(ids: Array<Invoice['id']>) {
    this.store.update(toggleActiveIds(ids));
  }

  private createStore(): typeof store {
    const store = createStore({ name: 'invoice' }, withProps<InvoiceProps>({}), withEntities<Invoice, 'id'>({ idKey: 'id' }), withUIEntities<InvoiceUI, 'id'>({ idKey: 'id' }), withActiveId(), withActiveIds());

    return store;
  }
}
