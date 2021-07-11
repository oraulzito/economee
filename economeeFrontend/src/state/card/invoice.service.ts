import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { tap } from 'rxjs/operators';
import { Invoice } from './invoice.model';
import { InvoiceStore } from './invoice.store';

@Injectable({ providedIn: 'root' })
export class InvoiceService {

  constructor(private invoiceStore: InvoiceStore, private http: HttpClient) {
  }


  get() {
    return this.http.get<Invoice[]>('https://api.com').pipe(tap(entities => {
      this.invoiceStore.set(entities);
    }));
  }

  add(invoice: Invoice) {
    this.invoiceStore.add(invoice);
  }

  update(id, invoice: Partial<Invoice>) {
    this.invoiceStore.update(id, invoice);
  }

  remove(id: ID) {
    this.invoiceStore.remove(id);
  }

}
