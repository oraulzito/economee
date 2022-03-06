import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BalanceStore} from './balance.store';
import {ReleaseQuery} from "../release/release.query";
import {AccountStore} from "../account/account.store";
import {RANGE_BALANCE} from "../ui/ui.model";
import {UiQuery} from "../ui/ui.query";
import {AccountQuery} from "../account/account.query";
import {InvoiceQuery} from "../invoice/invoice.query";
import {BalanceQuery} from "./balance.query";
import {tap, throwError} from "rxjs";
import {catchError, shareReplay} from "rxjs/operators";
import {setLoading} from "@datorama/akita";
import {Balance} from "./balance.model";
import {ReleaseStore} from "../release/release.store";
import {InvoiceStore} from "../invoice/invoice.store";
import {UiService} from "../ui/ui.service";

@Injectable({providedIn: 'root'})
export class BalanceService {
  initialDateBalance: Date;
  finalDateBalance: Date;
  rangeDateBalance: RANGE_BALANCE;

  constructor(
    private accountStore: AccountStore,
    private balanceStore: BalanceStore,
    private releaseStore: ReleaseStore,
    private invoiceStore: InvoiceStore,
    private accountQuery: AccountQuery,
    private balanceQuery: BalanceQuery,
    private invoiceQuery: InvoiceQuery,
    private releaseQuery: ReleaseQuery,
    private uiService: UiService,
    private uiQuery: UiQuery,
    private http: HttpClient,
  ) {
    this.uiQuery.initialDateBalance$.subscribe(r => this.initialDateBalance = r);
    this.uiQuery.finalDateBalance$.subscribe(r => this.finalDateBalance = r);
    this.uiQuery.rangeDateBalance$.subscribe(r => this.rangeDateBalance = r);
  }

  getFullBalanceMonth(date_reference) {
    return this.http.get<Balance>('/api/balance/full_balance?date_reference=' + date_reference,
      this.uiService.httpHeaderOptions()).pipe(
      shareReplay(1),
      setLoading(this.accountStore),
      tap(balance => {
        this.releaseStore.set(balance['releases']);
        this.invoiceStore.set(balance['invoices']);
      }),
      catchError((error) => throwError(error)),
    );
  }

  setActiveMonthBalance(balance_id?, date_balance?: string) {
    if (balance_id === undefined) {
      if (date_balance === undefined) {
        date_balance = this.formatDateForBalance();
      } else {
        date_balance = this.formatDateForBalance(date_balance);
      }

      this.balanceQuery.selectEntity(r => r.date_reference == date_balance).subscribe(
        r => {
          if (r)
            this.setActiveAndGetData(r.id)
        }
      );
    } else {
      this.setActiveAndGetData(balance_id)
    }
  }

  formatDateForBalance(date?) {
    let todayMonthDate = new Date();

    if (date !== undefined) {
      todayMonthDate = new Date(date);
    }

    todayMonthDate = new Date(todayMonthDate.getFullYear(), todayMonthDate.getMonth(), 1);

    return todayMonthDate.toISOString().split('T')[0];
  }

  setActiveAndGetData(id) {
    this.balanceStore.setActive(id);
    this.getFullBalanceMonth(this.balanceQuery.getActive().date_reference).subscribe();
  }

  calculateExpenses() {
    // let total = 0;
    // this.releaseQuery.selectAll({
    //   filterBy: state =>
    //     state.date_release >= this.initialDateBalance &&
    //     state.date_release <= this.finalDateBalance &&
    //     state.type === RELEASE_TYPE.EXPENSE_RELEASE &&
    //     state.card_id === null
    // }).subscribe(
    //   r => {
    //     r.map(r => total += r.value)
    //     this.balanceStore.update({total_expenses: r});
    //   }
    // );
  }

  calculatePaidExpenses() {
    // let total = 0;
    // this.releaseQuery.selectAll({
    //   filterBy: state =>
    //     state.date_release >= this.initialDateBalance &&
    //     state.date_release <= this.finalDateBalance &&
    //     state.type === RELEASE_TYPE.EXPENSE_RELEASE &&
    //     state.card_id === null &&
    //     state.is_release_paid
    // }).subscribe(
    //   r => {
    //     r.map(r => total += r.value)
    //     this.balanceStore.update({total_paid_expenses: r});
    //   }
    // );
  }

  calculateIncomes() {
    // let total = 0;
    // this.releaseQuery.selectAll({
    //   filterBy: state =>
    //     state.date_release >= this.initialDateBalance &&
    //     state.date_release <= this.finalDateBalance &&
    //     state.type === RELEASE_TYPE.INCOME_RELEASE
    // }).subscribe(
    //   r => {
    //     r.map(r => total += r.card_id ? r.installment_value : r.value)
    //     this.balanceStore.update({total_incomes: r});
    //   }
    // );
  }

  calculatePaidIncomes() {
    // let total = 0;
    // this.releaseQuery.selectAll({
    //   filterBy: state =>
    //     state.date_release >= this.initialDateBalance &&
    //     state.date_release <= this.finalDateBalance &&
    //     state.type === RELEASE_TYPE.INCOME_RELEASE &&
    //     state.is_release_paid
    // }).subscribe(
    //   r => {
    //     r.map(r => total += r.card_id ? r.installment_value : r.value)
    //     this.balanceStore.update({total_paid_incomes: r});
    //   }
    // );
  }

  calculateInvoices() {

  }

  // tslint:disable-next-line:typedef
  calculateTotalAvailable() {
    let totalAvailable = 0;
    let expenses = this.balanceQuery.getActive().total_expenses;
    let incomes = this.balanceQuery.getActive().total_incomes;

    // TODO
    // let invoices = this.balanceQuery.getActive().total_invoices;
    // if (this.invoiceQuery.hasActive() && this.invoiceQuery.getActive().is_paid) {
    //   totalAvailable = (expenses + invoices) - incomes;
    // } else {
    totalAvailable = expenses - incomes;
    // }

    this.balanceStore.updateActive({total_available: totalAvailable});
    this.balanceStore.updateActive({total_available: totalAvailable});
  }

}
