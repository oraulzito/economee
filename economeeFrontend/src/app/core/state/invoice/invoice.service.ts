import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {setLoading} from '@datorama/akita';
import {catchError, shareReplay, tap} from 'rxjs/operators';
import {Invoice} from './invoice.model';
import {InvoiceStore} from './invoice.store';
import {UiService} from '../ui/ui.service';
import {CardQuery} from '../card/card.query';
import {formatDate} from '@angular/common';
import {InvoiceQuery} from './invoice.query';
import {BalanceQuery} from '../balance/balance.query';
import {DateTime} from 'luxon';
import {throwError} from "rxjs";

@Injectable({providedIn: 'root'})
export class InvoiceService {

  constructor(
    private uiService: UiService,
    private invoiceStore: InvoiceStore,
    private cardQuery: CardQuery,
    private balanceQuery: BalanceQuery,
    private invoiceQuery: InvoiceQuery,
    private http: HttpClient
  ) {
  }

  // tslint:disable-next-line:typedef
  get() {
    return this.http.get<Invoice[]>('/api/invoice/', this.uiService.httpHeaderOptions()).pipe(
      shareReplay(1),
      setLoading(this.invoiceStore),
      tap(invoice => this.invoiceStore.set(invoice)),
      catchError((error) => throwError(error)),
    );
  }

  // tslint:disable-next-line:typedef
  getCardInvoice() {
    // tslint:disable-next-line:max-line-length
    return this.http.get<Invoice[]>('/api/invoice?card_id=' + this.cardQuery.getActiveId(),
      this.uiService.httpHeaderOptions()).pipe(
      shareReplay(1),
      setLoading(this.invoiceStore),
      tap(invoice => this.invoiceStore.set(invoice)),
      catchError((error) => throwError(error)),
    );
  }

  // tslint:disable-next-line:typedef
  setInvoiceMonth(invoiceDateReference?) {
    // Get the active card
    const activeCard = this.cardQuery.getActive();

    // Get the active card pay date
    const cardPayDate = DateTime.fromISO(activeCard.pay_date);
    let payDate;

    if (invoiceDateReference === undefined) {
      // Get the active balance date reference
      const activeBalance = this.balanceQuery.getActive();
      payDate = DateTime.fromISO(activeBalance.date_reference);
    } else {
      // Date informed by the user
      payDate = DateTime.fromISO(invoiceDateReference);
    }

    // Transform it into date
    payDate = new Date(payDate.year,
      payDate.month - 1,
      cardPayDate.day);

    // Format date as SQL date string (actual API return)
    const invoicePayDate = formatDate(payDate, 'YYYY-MM-dd', 'en-US');

    this.invoiceQuery.selectEntity(
      ({date_reference}) => date_reference === invoicePayDate
    ).subscribe(
      riq => {
        if (riq) {
          this.invoiceStore.setActive(riq.id);
        }
      }
    );
  }
}
