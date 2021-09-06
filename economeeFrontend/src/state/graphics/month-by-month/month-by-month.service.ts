import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {retry, shareReplay, tap} from 'rxjs/operators';
import {MonthByMonthStore} from './month-by-month.store';
import {AccountQuery} from '../../account/account.query';
import {BalanceQuery} from '../../balance/balance.query';
import {UiService} from '../../ui/ui.service';
import {MonthByMonth} from './month-by-month.model';

@Injectable({providedIn: 'root'})
export class MonthByMonthService {

  constructor(
    private accountQuery: AccountQuery,
    private balanceQuery: BalanceQuery,
    private uiService: UiService,
    private monthByMonthStore: MonthByMonthStore,
    private http: HttpClient
  ) {
  }

  // tslint:disable-next-line:typedef
  get() {
    // tslint:disable-next-line:max-line-length
    return this.http.get<MonthByMonth>('/api/release/month_graphic?account_id=' + this.accountQuery.getActive().id, this.uiService.httpHeaderOptions()).pipe(tap(entities => {
        this.monthByMonthStore.update(entities);
      }),
      shareReplay(),
      retry(2),
    );
  }

}
