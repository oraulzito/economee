import {Injectable} from '@angular/core';
import {QueryEntity} from '@datorama/akita';
import {ReleaseStore, ReleaseState} from './release.store';

@Injectable({providedIn: 'root'})
export class ReleaseQuery extends QueryEntity<ReleaseState> {
  allReleases$ = this.selectAll();
  debitReleases$ = this.selectAll({
    filterBy: state => state.invoice_id === null
  });
  debitExpensesReleases$ = this.selectAll({
    filterBy: state => state.type === 'ER' && state.invoice_id === null
  });
  debitIncomesReleases$ = this.selectAll({
    filterBy: state => state.type === 'IR' && state.invoice_id === null
  });
  cardReleases$ = this.selectAll({
    filterBy: state => state.invoice_id !== null
  });

  constructor(protected store: ReleaseStore) {
    super(store);
  }

}
