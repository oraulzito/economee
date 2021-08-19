import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ID} from '@datorama/akita';
import {tap} from 'rxjs/operators';
import {Account} from './account.model';
import {AccountStore} from './account.store';
import {BalanceStore} from '../balance/balance.store';
import {CardStore} from '../card/card.store';
import {UiService} from '../ui/ui.service';

@Injectable({providedIn: 'root'})
export class AccountService {

  constructor(
    private uiService: UiService,
    private accountStore: AccountStore,
    private balanceStore: BalanceStore,
    private cardStore: CardStore,
    private http: HttpClient) {
  }

  // tslint:disable-next-line:typedef
  get() {
    return this.http.get<Account[]>('api/account/', this.uiService.httpHeaderOptions()).pipe(tap(account => {
      this.accountStore.set(account);
    }));
  }

  add(account: Account) {
    this.accountStore.add(account);
  }

  update(id, account: Partial<Account>) {
    this.accountStore.update(id, account);
  }

  remove(id: ID) {
    this.accountStore.remove(id);
  }

}
