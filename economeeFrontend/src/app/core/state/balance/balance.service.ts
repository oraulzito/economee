import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Balance} from './balance.model';
import {BalanceStore} from './balance.store';
import {UiService} from '../ui/ui.service';
import {formatDate} from '@angular/common';
import {BalanceQuery} from './balance.query';
import {ReleaseService} from '../release/release.service';
import {InvoiceService} from '../invoice/invoice.service';
import {catchError, shareReplay, tap} from 'rxjs/operators';
import {setLoading} from '@datorama/akita';
import {throwError} from 'rxjs';
import {ReleaseQuery} from "../release/release.query";

@Injectable({providedIn: 'root'})
export class BalanceService {

  constructor(
    private uiService: UiService,
    private balanceQuery: BalanceQuery,
    private balanceStore: BalanceStore,
    private releaseService: ReleaseService,
    private releaseQuery: ReleaseQuery,
    private invoiceService: InvoiceService,
    private http: HttpClient
  ) {
  }

  // tslint:disable-next-line:typedef
  get() {
    return this.http.get<Balance[]>('/api/balance', this.uiService.httpHeaderOptions()).pipe(
      shareReplay(1),
      setLoading(this.balanceStore),
      tap(balance => this.balanceStore.set(balance)),
      catchError((error) => throwError(error)),
    );
  }

  // tslint:disable-next-line:typedef
  setBalanceMonth(actualDate?) {
    if (actualDate === undefined) {
      // Get today's date
      actualDate = new Date();
    }

    // Change the day to the first day of the month
    const firstDayOfMonth = new Date(actualDate.getFullYear(), actualDate.getMonth(), 1);

    // Format to SQL date format
    // const date = DateTime.fromSQL(firstDayOfMonth).toISODate();
    const date = formatDate(firstDayOfMonth.toString(), 'YYYY-MM-dd', 'en-US');

    // Get and set active the balance referred to the current month
    this.balanceQuery.selectEntity(b => b.date_reference === date).subscribe(
      b => {
        if (b) {
          this.balanceStore.setActive(b.id);
        }
      }
    );
  }

  // tslint:disable-next-line:typedef
  changeBalance(date) {
    this.setBalanceMonth(date);
    this.invoiceService.setInvoiceMonth(date);
  }

  calculateBalanceExpenses(): void {
    let expenseValues = 0;
    // Only balance expenses
    this.releaseQuery.selectAll({
      filterBy: [
        ({type}) => type === 'ER',
        ({balance_id}) => balance_id === this.balanceQuery.getActiveId(),
        ({invoice_id}) => invoice_id === null
      ]
    }).subscribe(r => {
        if (r) {
          let expenseValuesMap = r.map(results => results.value);
          expenseValues = expenseValuesMap.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        }
        this.balanceStore.updateActive({
          total_releases_expenses: expenseValues
        });
      }
    );
  }

  calculateBalanceIncomes(): void {
    let incomeValues = 0;
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
  }

}
