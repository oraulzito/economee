import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {retry, shareReplay, tap} from 'rxjs/operators';
import {CategoryRelease} from './category-release.model';
import {CategoryReleasesStore} from './category-releases.store';
import {BalanceQuery} from '../../balance/balance.query';
import {AccountQuery} from '../../account/account.query';
import {UiService} from '../../ui/ui.service';

@Injectable({providedIn: 'root'})
export class CategoryReleasesService {

  constructor(
    private accountQuery: AccountQuery,
    private balanceQuery: BalanceQuery,
    private uiService: UiService,
    private categoryReleasesStore: CategoryReleasesStore,
    private http: HttpClient
  ) {
  }

// tslint:disable-next-line:typedef
  get() {
    // tslint:disable-next-line:max-line-length
    return this.http.get<[CategoryRelease]>('/api/release/category_graphic?account_id=' + this.accountQuery.getActive().id + '&balance_id=' + this.balanceQuery.getActive().id, this.uiService.httpHeaderOptions()).pipe(tap(entities => {
        this.categoryReleasesStore.update(entities);
      }),
      shareReplay(),
      retry(2),
    );
  }


}
