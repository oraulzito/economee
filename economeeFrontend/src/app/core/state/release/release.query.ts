import {Injectable} from '@angular/core';
import {QueryEntity} from '@datorama/akita';
import {ReleaseState, ReleaseStore} from './release.store';
import {CardQuery} from "../card/card.query";
import {InvoiceQuery} from "../invoice/invoice.query";

@Injectable({providedIn: 'root'})
export class ReleaseQuery extends QueryEntity<ReleaseState> {

  loadReleasesDebit$ = this.selectAll(
    {
      filterBy: r => r.invoice_id === null
    });
  loadReleasesCard$ = this.selectAll({
    filterBy: r => r.invoice_id !== null && r.invoice_id === this.invoiceQuery.getActiveId()
  });
  loadReleasesDebitExpense$ = this.selectAll({
    filterBy: r => r.type === 0
  });
  loadReleasesDebitIncome$ = this.selectAll({
    filterBy: r => r.type === 1
  });

  constructor(
    protected store: ReleaseStore,
    protected cardQuery: CardQuery,
    protected invoiceQuery: InvoiceQuery
  ) {
    super(store);
  }
}
