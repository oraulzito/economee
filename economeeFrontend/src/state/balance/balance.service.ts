import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ID} from '@datorama/akita';
import {shareReplay, tap} from 'rxjs/operators';
import {Balance} from './balance.model';
import {BalanceStore} from './balance.store';
import {UiService} from '../ui/ui.service';
import {formatDate} from '@angular/common';
import {BalanceQuery} from './balance.query';
import {ReleaseService} from '../release/release.service';
import {InvoiceService} from '../invoice/invoice.service';

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
    this.balanceStore.setLoading(true);
    return this.http.get<Balance[]>('/api/balance/', this.uiService.httpHeaderOptions()).pipe(tap(entities => {
        this.balanceStore.set(entities);
        this.balanceStore.setLoading(false);
      }),
      shareReplay(1));
  }

  // tslint:disable-next-line:typedef
  add(balance: Balance) {
    this.balanceStore.add(balance);
  }

  // tslint:disable-next-line:typedef
  update(id, balance: Partial<Balance>) {
    this.balanceStore.update(id, balance);
  }

  // tslint:disable-next-line:typedef
  remove(id: ID) {
    this.balanceStore.remove(id);
  }

  // tslint:disable-next-line:typedef
  loadMonthBalance(actualDate?) {
    if (actualDate === undefined) {
      // Get today's date
      actualDate = new Date();
    }

    // Change the day to the first day of the month
    const firstDayOfMonth = new Date(actualDate.getFullYear(), actualDate.getMonth(), 1);
    // Format to SQL date format
    const date = formatDate(firstDayOfMonth.toString(), 'YYYY-MM-dd', 'en-US');

    // Get and set active the balance referred to the current month
    this.balanceQuery.selectEntity(({date_reference}) => date_reference === date).subscribe(
      b => {
        this.balanceStore.setActive(b.id);
      }
    );
  }

  // tslint:disable-next-line:typedef
  changeBalance(date) {
    this.loadMonthBalance(date);
    this.invoiceService.loadMonthInvoice(date);
  }

}
