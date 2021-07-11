import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Invoice } from './invoice.model';

export interface InvoiceState extends EntityState<Invoice> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'invoice' })
export class InvoiceStore extends EntityStore<InvoiceState> {

  constructor() {
    super();
  }

}
