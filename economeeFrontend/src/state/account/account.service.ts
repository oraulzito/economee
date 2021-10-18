import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ID, setLoading} from '@datorama/akita';
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
import {catchError, shareReplay, tap} from "rxjs/operators";
import {throwError} from "rxjs";

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
    return this.http.get<Account[]>('/api/account/', this.uiService.httpHeaderOptions()).pipe(
      shareReplay(1),
      setLoading(this.accountStore),
      tap(account => this.accountStore.set(account)),
      catchError((error) => throwError(error)),
    );
  }

  // tslint:disable-next-line:typedef
  add(form) {
    const body = {
      name: form.name,
      currency_id: form.currency,
      is_main_account: form.is_main_account,
    };

    return this.http.post<Account>('/api/account/', body, this.uiService.httpHeaderOptions()).pipe(
      shareReplay(1),
      setLoading(this.accountStore),
      tap(account => this.accountStore.add(account)),
      catchError((error) => throwError(error)),
    )
      ;
  }

  // tslint:disable-next-line:typedef
  update(id, form) {
    const body = {
      name: form.name,
      currency_id: form.currency,
      is_main_account: form.is_main_account,
    };

    return this.http.patch<Account>('/api/account/' + id + '/', body, this.uiService.httpHeaderOptions()).pipe(
      shareReplay(1),
      setLoading(this.accountStore),
      tap(account => this.accountStore.update(id, account)),
      catchError((error) => throwError(error)),
    )
      ;
  }

  // tslint:disable-next-line:typedef
  remove(id: ID) {
    return this.http.delete<number>('/api/account/' + id + '/', this.uiService.httpHeaderOptions()).pipe(
      shareReplay(1),
      setLoading(this.accountStore),
      tap(account => account === 1 ? this.accountStore.remove(id) : this.accountStore.setError("Not removed")),
      catchError((error) => throwError(error)),
    );
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
        ({balance_id}) => balance_id === this.balanceQuery.getActiveId(),
        ({invoice_id}) => invoice_id === null
      ]
    }).subscribe(r => {
        if (r) {
          const expenseValuesMap = r.map(results => results.value);
          expenseValues = expenseValuesMap.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        }
        this.balanceStore.updateActive({
          total_releases_expenses: expenseValues
        });
      }
    );

    // Only balance incomes
    this.releaseQuery.selectAll({
      filterBy: [
        ({type}) => type === 'IR',
        ({balance_id}) => balance_id === this.balanceQuery.getActiveId()
      ]
    }).subscribe(r => {
        if (r) {
          const incomeValuesMap = r.map(results => results.value);
          incomeValues = incomeValuesMap.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
        }
        this.balanceStore.updateActive({
          total_releases_incomes: incomeValues
        });
      }
    );

    // Only card releases
    this.releaseQuery.selectAll({
      filterBy: [
        ({type}) => type === 'ER',
        ({invoice_id}) => invoice_id === this.invoiceQuery.getActiveId()
      ]
    }).subscribe(r => {
        if (r) {
          const cardExpenseValuesMap = r.map(results => results.value);
          cardExpenseValues = cardExpenseValuesMap.reduce((accumulator, currentValue) => accumulator + currentValue, 0)
        }
        this.invoiceStore.updateActive({
          total_card_expenses: cardExpenseValues
        });
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
