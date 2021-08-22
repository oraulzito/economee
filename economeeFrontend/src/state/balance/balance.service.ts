import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ID} from '@datorama/akita';
import {shareReplay, tap} from 'rxjs/operators';
import {Balance} from './balance.model';
import {BalanceStore} from './balance.store';
import {UiService} from '../ui/ui.service';

@Injectable({providedIn: 'root'})
export class BalanceService {

  constructor(
    private uiService: UiService,
    private balanceStore: BalanceStore,
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

}
