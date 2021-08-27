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
    let expenseValues = 0.0;
    let incomeValues = 0.0;
    let cardExpenseValues = 0.0;

    // Only balance expenses
    this.releaseQuery.selectAll({
      filterBy: [
        ({type}) => type === 'ER',
        ({balance_id}) => balance_id !== null
      ]
    }).subscribe(
      r => {
        if (r) {
          const expenseValuesMap = r.map(results => results.value);
          expenseValues = expenseValuesMap.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
          this.balanceStore.updateActive({
            total_releases_expenses: expenseValues
          });
        }
      }
    );

    // Only balance incomes
    this.releaseQuery.selectAll({
      filterBy: [
        ({type}) => type === 'IR',
        ({balance_id}) => balance_id !== null
      ]
    }).subscribe(
      r => {
        if (r) {
          const incomeValuesMap = r.map(results => results.value);
          incomeValues = incomeValuesMap.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
          this.balanceStore.updateActive({
            total_releases_incomes: incomeValues
          });
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
          const cardExpenseValuesMap = r.map(results => results.value);
          cardExpenseValues = cardExpenseValuesMap.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
          this.invoiceStore.updateActive({
            total_card_expenses: cardExpenseValues
          });
        }
      }
    );

    let totalAvailable = 0.0;

    if (this.invoiceQuery.hasActive() && this.invoiceQuery.getActive().is_paid) {
      totalAvailable = incomeValues - (expenseValues + cardExpenseValues);
    } else {
      totalAvailable = incomeValues - expenseValues;
    }

    this.accountStore.updateActive({total_available: totalAvailable});
  }
}
