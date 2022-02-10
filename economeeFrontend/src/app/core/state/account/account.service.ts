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
import {CardQuery} from "../card/card.query";
import {BalanceService} from "../balance/balance.service";
import {CardService} from "../card/card.service";

@Injectable({providedIn: 'root'})
export class AccountService {

  constructor(
    private uiService: UiService,
    private balanceService: BalanceService,
    private cardService: CardService,
    private accountStore: AccountStore,
    private balanceStore: BalanceStore,
    private releaseStore: ReleaseStore,
    private releaseQuery: ReleaseQuery,
    private accountQuery: AccountQuery,
    private cardQuery: CardQuery,
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
    this.balanceService.calculateBalanceExpenses();
    this.balanceService.calculateBalanceIncomes();
    this.cardService.calculateCardReleases();

    let balanceExpenseReleasesValue = this.balanceQuery.getValue().total_releases_expenses;
    let balanceIncomeReleasesValue = this.balanceQuery.getValue().total_releases_incomes;
    let invoiceValue = this.cardQuery.getValue().total_invoice_value;

    let totalAvailable = 0.0;

    if (this.invoiceQuery.hasActive() && this.invoiceQuery.getActive().is_paid) {
      totalAvailable = balanceIncomeReleasesValue - (balanceExpenseReleasesValue + invoiceValue);
    } else {
      totalAvailable = balanceIncomeReleasesValue - balanceExpenseReleasesValue;
    }

    this.accountStore.updateActive({total_available: totalAvailable});
  }


}
