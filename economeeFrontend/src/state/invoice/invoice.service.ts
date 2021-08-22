import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ID} from '@datorama/akita';
import {shareReplay, tap} from 'rxjs/operators';
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
    return this.http.get<Invoice[]>('/api/invoice/', this.uiService.httpHeaderOptions()).pipe(tap(entities => {
      this.invoiceStore.set(entities);
    }));
  }

  // tslint:disable-next-line:typedef
  getCardInvoice() {
    // tslint:disable-next-line:max-line-length
    return this.http.get<Invoice[]>('/api/invoice?card_id=' + this.cardQuery.getActiveId(), this.uiService.httpHeaderOptions()).pipe(tap(entities => {
      this.invoiceStore.set(entities);
    }),
      shareReplay(1));
  }

  // tslint:disable-next-line:typedef
  add(invoice: Invoice) {
    this.invoiceStore.add(invoice);
  }

  // tslint:disable-next-line:typedef
  update(id, invoice: Partial<Invoice>) {
    this.invoiceStore.update(id, invoice);
  }

  // tslint:disable-next-line:typedef
  remove(id: ID) {
    this.invoiceStore.remove(id);
  }

}
