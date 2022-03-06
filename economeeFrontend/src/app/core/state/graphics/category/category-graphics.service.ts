import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {setLoading} from '@datorama/akita';
import {catchError, shareReplay, tap} from 'rxjs/operators';
import {CategoryGraphicsStore} from './category-graphics.store';
import {throwError} from "rxjs";
import {UiService} from "../../ui/ui.service";
import {CategoryGraphic} from "./category-graphics.model";
import {Account} from "../../account/account.model";
import {Balance} from "../../balance/balance.model";

@Injectable({providedIn: 'root'})
export class CategoryGraphicsService {

  constructor(
    private categoryStore: CategoryGraphicsStore,
    private uiService: UiService,
    private http: HttpClient
  ) {
  }

// tslint:disable-next-line:typedef
  getCategoryGraphic(account: Account, balance: Balance) {
    return this.http.get<CategoryGraphic[]>('/api/release/category_graphic?account_id=' + account.id + '&balance_id=' + balance.id,
      this.uiService.httpHeaderOptions()).pipe(
      shareReplay(1),
      setLoading(this.categoryStore),
      tap(entities => {
        this.categoryStore.set(entities);
        console.log(entities);
      }),
      catchError(error => throwError(error))
    );
  }

}
