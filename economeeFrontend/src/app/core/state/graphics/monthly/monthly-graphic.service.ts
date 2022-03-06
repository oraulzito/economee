import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {setLoading} from '@datorama/akita';
import {catchError, shareReplay, tap} from 'rxjs/operators';
import {MonthlyGraphic} from './monthly-graphic.model';
import {MonthlyGraphicStore} from './monthly-graphic.store';
import {throwError} from "rxjs";
import {UiService} from "../../ui/ui.service";
import {AccountQuery} from "../../account/account.query";

@Injectable({providedIn: 'root'})
export class MonthlyGraphicService {

  constructor(
    private monthlyGraphicsStore: MonthlyGraphicStore,
    private accountQuery: AccountQuery,
    private uiService: UiService,
    private http: HttpClient
  ) {
  }

  // tslint:disable-next-line:typedef
  getMonthlyGraphic() {
    return this.http.get<MonthlyGraphic[]>('/api/release/monthly_graphic?account_id=' + this.accountQuery.getActiveId(),
      this.uiService.httpHeaderOptions()).pipe(
      shareReplay(1),
      setLoading(this.monthlyGraphicsStore),
      tap(entities => {
        this.monthlyGraphicsStore.set(entities);
        console.log(entities);
      }),
      catchError(error => throwError(error))
    );
  }

}
