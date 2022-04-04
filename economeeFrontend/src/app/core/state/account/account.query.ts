import {Injectable} from '@angular/core';
import {QueryEntity} from '@datorama/akita';
import {AccountState, AccountStore} from './account.store';

@Injectable({providedIn: 'root'})
export class AccountQuery extends QueryEntity<AccountState> {
  activeEntity$ = this.selectActive();
  activeAccountName$ = this.selectActive(({name}) => name);
  totalAvailable$ = this.selectActive(({total_available}) => total_available);
  currencySymbol$ = this.selectActive(({currency}) => currency.symbol);
  currencyId$ = this.selectActive(({currency}) => currency.id);

  constructor(protected store: AccountStore) {
    super(store);
  }

}
