import {Injectable} from '@angular/core';
import {QueryEntity} from '@datorama/akita';
import {ReleaseState, ReleaseStore} from './release.store';
import {CardQuery} from "../card/card.query";
import {InvoiceQuery} from "../invoice/invoice.query";

@Injectable({providedIn: 'root'})
export class ReleaseQuery extends QueryEntity<ReleaseState> {

  loadAllNonInvoiceReleases$ = this.selectAll({
    filterBy: r => r.invoice_id === null
  });
  loadInvoiceReleases$ = this.selectAll({
    filterBy: r => r.invoice_id !== null && r.invoice_id === this.invoiceQuery.getActiveId()
  });
  loadPaidExpensesReleases$ = this.selectAll({
    filterBy: r => r.type === 0 && r.invoice_id == null && r.is_paid == true
  });
  loadPaidIncomesReleases$ = this.selectAll({
    filterBy: r => r.type === 1 && r.invoice_id == null && r.is_paid == true
  });
  loadNonPaidExpensesReleases$ = this.selectAll({
    filterBy: r => r.type === 0 && r.invoice_id == null && r.is_paid == false
  });
  loadNonPaidIncomesReleases$ = this.selectAll({
    filterBy: r => r.type === 1 && r.invoice_id == null && r.is_paid == false
  });
  loadDebitExpensesReleases$ = this.selectAll({
    filterBy: r => r.type === 0 && r.invoice_id == null
  });
  loadDebitIncomesReleases$ = this.selectAll({
    filterBy: r => r.type === 1 && r.invoice_id == null
  })

  constructor(
    protected store: ReleaseStore,
    protected cardQuery: CardQuery,
    protected invoiceQuery: InvoiceQuery
  ) {
    super(store);
  }

  queryReleases(releaseType) {
    let query;
    switch (releaseType) {
      case 0:
        // card releases
        query = this.loadInvoiceReleases$;
        break;
      case 1:
        //all debit
        query = this.loadAllNonInvoiceReleases$;
        break;
      case 2:
        // debit expenses
        query = this.loadDebitExpensesReleases$;
        break;
      case 3:
        // debit incomes
        query = this.loadDebitIncomesReleases$;
        break;
      case 4:
        query = this.loadPaidExpensesReleases$;
        break;
      case 5:
        query = this.loadNonPaidExpensesReleases$;
        break;
      case 6:
        query = this.loadPaidIncomesReleases$;
        break;
      case 7:
        query = this.loadNonPaidIncomesReleases$;
        break;
    }
    return query;
  }
}
