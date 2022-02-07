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

@Injectable({providedIn: 'root'})
export class BalanceService {

  constructor(
    private uiService: UiService,
    private balanceQuery: BalanceQuery,
    private balanceStore: BalanceStore,
    private releaseService: ReleaseService,
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

}
