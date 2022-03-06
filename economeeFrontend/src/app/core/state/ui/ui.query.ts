import {Injectable} from '@angular/core';
import {Query} from '@datorama/akita';
import {UiState, UiStore} from './ui.store';

@Injectable({providedIn: 'root'})
export class UiQuery extends Query<UiState> {
  isLoading$ = this.selectLoading();
  hasErrors$ = this.selectError();
  isMobile$ = this.select(state => state.mobile);
  initialDateBalance$ = this.select(state => state.initialDateBalance);
  finalDateBalance$ = this.select(state => state.finalDateBalance);
  rangeDateBalance$ = this.select(state => state.rangeDateBalance);

  constructor(protected store: UiStore) {
    super(store);
  }

}
