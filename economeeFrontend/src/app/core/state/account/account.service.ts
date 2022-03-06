import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ID, setLoading} from '@datorama/akita';
import {Account} from './account.model';
import {AccountStore} from './account.store';

import {CardStore} from '../card/card.store';
import {UiService} from '../ui/ui.service';
import {ReleaseStore} from '../release/release.store';
import {ReleaseQuery} from '../release/release.query';
import {AccountQuery} from './account.query';
import {catchError, shareReplay, tap} from "rxjs/operators";
import {throwError} from "rxjs";
import {CardQuery} from "../card/card.query";

import {CardService} from "../card/card.service";
import {UiQuery} from "../ui/ui.query";
import {BalanceStore} from "../balance/balance.store";
import {BalanceService} from "../balance/balance.service";
import {InvoiceService} from "../invoice/invoice.service";

@Injectable({providedIn: 'root'})
export class AccountService {

  constructor(
    private uiService: UiService,
    private uiQuery: UiQuery,
    private accountStore: AccountStore,
    private accountQuery: AccountQuery,
    private releaseStore: ReleaseStore,
    private releaseQuery: ReleaseQuery,
    private cardService: CardService,
    private cardQuery: CardQuery,
    private cardStore: CardStore,
    private balanceStore: BalanceStore,
    private balanceService: BalanceService,
    private invoiceService: InvoiceService,
    private http: HttpClient) {

  }

  // tslint:disable-next-line:typedef
  get() {
    return this.http.get<Account[]>('/api/account', this.uiService.httpHeaderOptions()).pipe(
      shareReplay(1),
      setLoading(this.accountStore),
      tap(account => {
        this.accountStore.set(account);
        this.setActiveAccount();
      }),
      catchError((error) => throwError(error)),
    );
  }

  // tslint:disable-next-line:typedef
  getFull() {
    return this.http.get<Account[]>('/api/account?full', this.uiService.httpHeaderOptions()).pipe(
      shareReplay(1),
      setLoading(this.accountStore),
      tap(account => {
        this.balanceStore.set(account['balances']);
        this.cardStore.set(account['cards']);
        this.accountStore.set(account);
      }),
      catchError((error) => throwError(error)),
    );
  }

  // tslint:disable-next-line:typedef
  getMainAccount() {
    return this.http.get<Account>('/api/account/main_account', this.uiService.httpHeaderOptions()).pipe(
      shareReplay(1),
      setLoading(this.accountStore),
      tap(account => {
        this.balanceStore.set(account['balances']);
        delete account['balances'];
        this.balanceService.setActiveMonthBalance();
        this.cardStore.set(account['cards']);
        this.cardService.setActiveCard();
        delete account['cards'];
      }),
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

    return this.http.post<Account>('/api/account', body, this.uiService.httpHeaderOptions()).pipe(
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

    return this.http.patch<Account>('/api/account/' + id, body, this.uiService.httpHeaderOptions()).pipe(
      shareReplay(1),
      setLoading(this.accountStore),
      tap(account => this.accountStore.update(id, account)),
      catchError((error) => throwError(error)),
    );
  }

  // tslint:disable-next-line:typedef
  remove(id: ID) {
    return this.http.delete<number>('/api/account/' + id, this.uiService.httpHeaderOptions()).pipe(
      shareReplay(1),
      setLoading(this.accountStore),
      tap(account => account === 1 ? this.accountStore.remove(id) : this.accountStore.setError("Not removed")),
      catchError((error) => throwError(error)),
    );
  }

  setActiveAccount(account?) {
    if (account === undefined) {
      this.accountQuery
        .selectEntity(({is_main_account}) => is_main_account === true)
        .subscribe(a => this.accountStore.setActive(a.id));
    } else {
      this.setStores(account);
    }
  }

  setStores(account) {
    this.cardStore.set(account['cards']);
    this.cardService.setActiveCard();
    this.accountStore.setActive(account);
  }

}
