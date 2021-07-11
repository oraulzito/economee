import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { AccountStore, AccountState } from './account.store';

@Injectable({ providedIn: 'root' })
export class AccountQuery extends QueryEntity<AccountState> {

  constructor(protected store: AccountStore) {
    super(store);
  }

}
