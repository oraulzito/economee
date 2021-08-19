import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ID} from '@datorama/akita';
import {tap} from 'rxjs/operators';
import {Invoice} from './invoice.model';
import {InvoiceStore} from './invoice.store';
import {UiService} from '../ui/ui.service';
import {CardQuery} from '../card/card.query';

@Injectable({providedIn: 'root'})
export class InvoiceService {

  constructor(
    private uiService: UiService,
    private invoiceStore: InvoiceStore,
    private cardQuery: CardQuery,
    private http: HttpClient
  ) {
  }

  // tslint:disable-next-line:typedef
  get() {
    return this.http.get<Invoice[]>('api/invoice/', this.uiService.httpHeaderOptions()).pipe(tap(entities => {
      this.invoiceStore.set(entities);
    }));
  }

  // tslint:disable-next-line:typedef
  getCardInvoice() {
    return this.http.get<Invoice[]>('api/invoice?card_id' + this.cardQuery.getActive().id, this.uiService.httpHeaderOptions()).pipe(tap(entities => {
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
