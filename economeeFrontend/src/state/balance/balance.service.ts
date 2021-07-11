import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { tap } from 'rxjs/operators';
import { Balance } from './balance.model';
import { BalanceStore } from './balance.store';

@Injectable({ providedIn: 'root' })
export class BalanceService {

  constructor(private balanceStore: BalanceStore, private http: HttpClient) {
  }


  get() {
    return this.http.get<Balance[]>('https://api.com').pipe(tap(entities => {
      this.balanceStore.set(entities);
    }));
  }

  add(balance: Balance) {
    this.balanceStore.add(balance);
  }

  update(id, balance: Partial<Balance>) {
    this.balanceStore.update(id, balance);
  }

  remove(id: ID) {
    this.balanceStore.remove(id);
  }

}
