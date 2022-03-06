import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ID, setLoading} from '@datorama/akita';
import {Card} from './card.model';
import {CardStore} from './card.store';
import {UiService} from '../ui/ui.service';
import {catchError, shareReplay, tap} from "rxjs/operators";
import {AccountQuery} from "../account/account.query";
import {throwError} from "rxjs";
import {ReleaseQuery} from "../release/release.query";
import {InvoiceQuery} from "../invoice/invoice.query";
import {InvoiceStore} from "../invoice/invoice.store";
import {CardQuery} from "./card.query";
import {InvoiceService} from "../invoice/invoice.service";

@Injectable({providedIn: 'root'})
export class CardService {

  constructor(
    private uiService: UiService,
    private cardStore: CardStore,
    private cardQuery: CardQuery,
    private accountQuery: AccountQuery,
    private invoiceService: InvoiceService,
    private releaseQuery: ReleaseQuery,
    private invoiceQuery: InvoiceQuery,
    private invoiceStore: InvoiceStore,
    private http: HttpClient
  ) {
  }

  // tslint:disable-next-line:typedef
  get() {
    this.cardStore.setLoading(true);

    return this.http.get<Card[]>('/api/card/', this.uiService.httpHeaderOptions()).pipe(
      shareReplay(1),
      setLoading(this.cardStore),
      tap(card => this.cardStore.set(card)),
      catchError((error) => throwError(error)),
    );
  }

  // tslint:disable-next-line:typedef
  add(form) {
    this.cardStore.setLoading(true);

    const body = {
      name: form.name,
      credit: form.credit,
      pay_date: form.pay_date,
      account_id: this.accountQuery.getActiveId(),
    };

    return this.http.post<Card>('/api/card/', body, this.uiService.httpHeaderOptions()).pipe(
      shareReplay(1),
      setLoading(this.cardStore),
      tap(card => this.cardStore.add(card)),
      catchError((error) => throwError(error)),
    );
  }

  // tslint:disable-next-line:typedef
  update(id, form) {
    this.cardStore.setLoading(true);

    const body = {
      name: form.name,
      credit: form.credit,
      pay_date: form.pay_date,
    };

    return this.http.patch<Card>('/api/card/' + id + '/', body, this.uiService.httpHeaderOptions()).pipe(
      shareReplay(1),
      setLoading(this.cardStore),
      tap(card => this.cardStore.update(id, card)),
      catchError((error) => throwError(error)),
    );
  }

  // tslint:disable-next-line:typedef
  remove(id: ID) {
    this.cardStore.setLoading(true);

    return this.http.delete<number>('/api/card/' + id + '/', this.uiService.httpHeaderOptions()).pipe(
      shareReplay(1),
      setLoading(this.cardStore),
      tap(card => card === 1 ? this.cardStore.remove(id) : this.cardStore.setError("Not removed")),
      catchError((error) => throwError(error)),
    );
  }

  calculateCardReleases(): void {
    // let cardExpenseValues = 0;
    // // Only card releases
    // this.releaseQuery.selectAll({
    //   filterBy: [
    //     ({type}) => type === 0,
    //     ({recurring_releases}) => recurring_releases.(r => r.invoice = this.invoiceQuery.getActiveId())
    //   ]
    // }).subscribe(r => {
    //     if (r) {
    //       const cardExpenseValuesMap = r.map(results => results.value);
    //       cardExpenseValues = cardExpenseValuesMap.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    //     }
    //     this.invoiceStore.updateActive({
    //       total_invoice_value: cardExpenseValues
    //     });
    //   }
    // );
  }

  setActiveCard(id?) {
    if (id === undefined) {
      this.cardQuery.selectFirst().subscribe(
        c => {
          if (c) {
            this.setCardAndInvoice(c.id);
          }
        }
      )
    } else {
      this.setCardAndInvoice(id);
    }
  }

  setCardAndInvoice(id) {
    this.cardStore.setActive(id);
    this.invoiceService.setActiveMonthInvoice();
  }
}
