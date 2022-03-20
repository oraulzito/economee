import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {setLoading} from '@datorama/akita';
import {catchError, shareReplay, tap} from 'rxjs/operators';
import {MonthlyChart} from './monthly-chart.model';
import {MonthlyChartStore} from './monthly-chart.store';
import {throwError} from "rxjs";
import {UiService} from "../../ui/ui.service";
import {AccountQuery} from "../../account/account.query";

@Injectable({providedIn: 'root'})
export class MonthlyChartService {

  constructor(
    private monthlyChartsStore: MonthlyChartStore,
    private accountQuery: AccountQuery,
    private uiService: UiService,
    private http: HttpClient
  ) {
  }

  // tslint:disable-next-line:typedef
  getMonthlyChart() {
    return this.http.get<MonthlyChart[]>('/api/charts/monthly?account_id=' + this.accountQuery.getActiveId(),
      this.uiService.httpHeaderOptions()).pipe(
      shareReplay(1),
      setLoading(this.monthlyChartsStore),
      tap(entities => {
        this.monthlyChartsStore.set(entities);
        console.log(entities);
      }),
      catchError(error => throwError(error))
    );
  }

}
