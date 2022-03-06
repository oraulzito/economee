import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {InvoiceStore} from './invoice.store';
import {InvoiceQuery} from "./invoice.query";
import {CardQuery} from "../card/card.query";

@Injectable({providedIn: 'root'})
export class InvoiceService {

  constructor(
    private invoiceStore: InvoiceStore,
    private cardQuery: CardQuery,
    private invoiceQuery: InvoiceQuery,
    private http: HttpClient
  ) {
  }

  setActiveMonthInvoice(invoice_id?) {
    if (invoice_id === undefined) {
      const todayMonthDateStr = this.formatDateForInvoice();
      this.invoiceQuery.selectEntity(i => i.date_reference === todayMonthDateStr).subscribe(
        r => {
          if (r) {
            this.invoiceStore.setActive(r.id)
          } else {
            this.invoiceStore.setActive(null)
          }
        }
      );
    } else {
      this.invoiceStore.setActive(invoice_id);
    }
  }

  formatDateForInvoice() {
    let pay_date = new Date(this.cardQuery.getActive().pay_date);
    let todayMonthDate = new Date();

    todayMonthDate = new Date(todayMonthDate.getFullYear(), todayMonthDate.getMonth(), pay_date.getUTCDate());

    return todayMonthDate.toISOString().split('T')[0];
  }

  // TODO
  // calculateInvoiceExpenses() {
  //   let total = 0;
  //   this.releaseQuery.selectAll({
  //     filterBy: state =>
  //       state.date_release >= this.initialDateBalance &&
  //       state.date_release <= this.finalDateBalance &&
  //       state.type === RELEASE_TYPE.EXPENSE_RELEASE
  //   }).subscribe(
  //     r => {
  //       r.map(r => total += r.card_id ? r.installment_value : r.value)
  //       this.balanceStore.update({total_available: r});
  //     }
  //   );
  // }

}
