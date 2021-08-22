import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ID} from '@datorama/akita';
import {shareReplay, tap} from 'rxjs/operators';
import {Account} from './account.model';
import {AccountStore} from './account.store';
import {BalanceStore} from '../balance/balance.store';
import {CardStore} from '../card/card.store';
import {UiService} from '../ui/ui.service';
import {ReleaseStore} from '../release/release.store';
import {ReleaseQuery} from '../release/release.query';
import {AccountQuery} from './account.query';

@Injectable({providedIn: 'root'})
export class AccountService {

  constructor(
    private uiService: UiService,
    private accountStore: AccountStore,
    private balanceStore: BalanceStore,
    private releaseStore: ReleaseStore,
    private releaseQuery: ReleaseQuery,
    private accountQuery: AccountQuery,
    private cardStore: CardStore,
    private http: HttpClient) {
  }

  // tslint:disable-next-line:typedef
  get() {
    return this.http.get<Account[]>('/api/account/', this.uiService.httpHeaderOptions()).pipe(tap(account => {
        this.accountStore.set(account);
      }),
      shareReplay(1));
  }

  // tslint:disable-next-line:typedef
  add(account: Account) {
    this.accountStore.add(account);
  }

  // tslint:disable-next-line:typedef
  update(id, account: Partial<Account>) {
    this.accountStore.update(id, account);
  }

  // tslint:disable-next-line:typedef
  remove(id: ID) {
    this.accountStore.remove(id);
  }

  // tslint:disable-next-line:typedef
  totalAvailable() {
    // tslint:disable-next-line:variable-name
    let total_available = 0.0;

    this.releaseQuery.selectAll({
      filterBy: ({type}) => type === 'IR'
    }).subscribe(
      r => {
        // tslint:disable-next-line:variable-name
        const income_values = r.map(results => results.value);
        const total = income_values.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        total_available += total;
        this.accountStore.update(this.accountQuery.getActiveId(), {total_incomes: total});
      }
    );

    this.releaseQuery.selectAll({
      filterBy: ({type}) => type === 'ER'
    }).subscribe(
      r => {
        // tslint:disable-next-line:variable-name
        const expense_values = r.map(results => results.value);
        const total = expense_values.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        total_available -= total;
        this.accountStore.update(this.accountQuery.getActiveId(), {total_expenses: total});
      }
    );

    this.accountStore.update(this.accountQuery.getActiveId(), {total_available});
  }
}
