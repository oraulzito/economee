import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import {setLoading} from '@datorama/akita';
import {catchError, shareReplay, tap} from 'rxjs/operators';
import {CategoryChartStore} from './category-chart-store.service';
import {throwError} from "rxjs";
import {UiService} from "../../ui/ui.service";
import {CategoryChart} from "./category-chart.model";
import {AccountQuery} from "../../account/account.query";
import {BalanceQuery} from "../../balance/balance.query";

@Injectable({providedIn: 'root'})
export class CategoryChartService {

  constructor(
    private accountQuery: AccountQuery,
    private balanceQuery: BalanceQuery,
    private categoryStore: CategoryChartStore,
    private uiService: UiService,
    private http: HttpClient
  ) {
  }

// tslint:disable-next-line:typedef
  getCategoryChart(balance_id) {
    return this.http.get<CategoryChart[]>('/api/charts/category?account_id='
      + this.accountQuery.getActiveId() + '&balance_id=' + balance_id,
      this.uiService.httpHeaderOptions()).pipe(
      shareReplay(1),
      setLoading(this.categoryStore),
      tap(entities => {
        this.categoryStore.set(entities);
      }),
      catchError(error => throwError(error))
    );
  }

}
