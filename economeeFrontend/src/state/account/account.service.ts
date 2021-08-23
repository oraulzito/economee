import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ID} from '@datorama/akita';
import {shareReplay, tap} from 'rxjs/operators';
import {Account} from './account.model';
import {AccountStore} from './account.store';
import {BalanceStore} from '../balance/balance.store';
import {CardStore} from '../card/card.store';
import {UiService} from '../ui/ui.service';
import {ReleaseStore} from '../release/release.store';
import {ReleaseQuery} from '../release/release.query';
import {AccountQuery} from './account.query';
import {BalanceQuery} from '../balance/balance.query';
import {InvoiceStore} from '../invoice/invoice.store';
import {InvoiceQuery} from '../invoice/invoice.query';

@Injectable({providedIn: 'root'})
export class AccountService {

  constructor(
    private uiService: UiService,
    private accountStore: AccountStore,
    private balanceStore: BalanceStore,
    private releaseStore: ReleaseStore,
    private releaseQuery: ReleaseQuery,
    private accountQuery: AccountQuery,
    private balanceQuery: BalanceQuery,
    private invoiceQuery: InvoiceQuery,
    private cardStore: CardStore,
    private invoiceStore: InvoiceStore,
    private http: HttpClient) {
  }

  // tslint:disable-next-line:typedef
  get() {
    return this.http.get<Account[]>('/api/account/', this.uiService.httpHeaderOptions()).pipe(tap(account => {
        this.accountStore.set(account);
      }),
      shareReplay(1));
  }

  // tslint:disable-next-line:typedef
  add(account: Account) {
    this.accountStore.add(account);
  }

  // tslint:disable-next-line:typedef
  update(id, account: Partial<Account>) {
    this.accountStore.update(id, account);
  }

  // tslint:disable-next-line:typedef
  remove(id: ID) {
    this.accountStore.remove(id);
  }

  // tslint:disable-next-line:typedef
  totalAvailable() {
    // tslint:disable-next-line:variable-name
    let total_available = 0.0;

    // all income releases
    this.releaseQuery.selectAll({
      filterBy: ({type}) => type === 'IR'
    }).subscribe(
      r => {
        if (r) {
          // tslint:disable-next-line:variable-name
          const income_values = r.map(results => results.value);
          // tslint:disable-next-line:variable-name
          const total_releases_incomes = income_values.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
          total_available += total_releases_incomes;
          this.balanceStore.updateActive({total_releases_incomes});
        }
      }
    );

    // Get all expenses
    this.releaseQuery.selectAll({
      filterBy: [
        ({type}) => type === 'ER',
        // FIXME
        // ({balance_id}) => balance_id === this.balanceQuery.getActiveId(),
        // ({invoice_id}) => invoice_id === (this.invoiceQuery.hasActive() ? this.invoiceQuery.getActiveId() : 0),
      ]
    }).subscribe(
      r => {
        if (r) {
          // tslint:disable-next-line:variable-name
          const expense_values = r.map(results => results.value);
          // tslint:disable-next-line:variable-name
          const total_releases_expenses = expense_values.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
          total_available -= total_releases_expenses;
          this.balanceStore.updateActive({total_releases_expenses});
        }
      }
    );

    // Only balance releases
    this.releaseQuery.selectAll({
      filterBy: [
        ({type}) => type === 'ER',
        ({balance_id}) => balance_id !== null
      ]
    }).subscribe(
      r => {
        if (r) {
          // tslint:disable-next-line:variable-name
          const income_values = r.map(results => results.value);
          // tslint:disable-next-line:variable-name
          const total_releases_expenses = income_values.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
          this.balanceStore.updateActive({total_releases_expenses});
        }
      }
    );

    // Only balance releases
    this.releaseQuery.selectAll({
      filterBy: [
        ({type}) => type === 'IR',
        ({balance_id}) => balance_id !== null
      ]
    }).subscribe(
      r => {
        if (r) {
          // tslint:disable-next-line:variable-name
          const income_values = r.map(results => results.value);
          // tslint:disable-next-line:variable-name
          const total_releases_incomes = income_values.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
          this.balanceStore.updateActive({total_releases_incomes});
        }
      }
    );

    // Only card releases
    this.releaseQuery.selectAll({
      filterBy: [
        ({type}) => type === 'ER',
        ({invoice_id}) => invoice_id !== null
      ]
    }).subscribe(
      r => {
        if (r) {
          // tslint:disable-next-line:variable-name
          const income_values = r.map(results => results.value);
          // tslint:disable-next-line:variable-name
          const total_card_expenses = income_values.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
          if (this.invoiceQuery.hasActive()) {
            this.invoiceStore.updateActive({total_card_expenses});
          }
        }
      }
    );

    this.accountStore.updateActive({total_available});
  }
}
