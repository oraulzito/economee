import {Injectable} from '@angular/core';
import {Query} from '@datorama/akita';
import {UiState, UiStore} from './ui.store';

@Injectable({providedIn: 'root'})
export class UiQuery extends Query<UiState> {
  isLoading$ = this.selectLoading();
  hasErrors$ = this.selectError();
  isMobile$ = this.select(state => state.mobile);

  constructor(protected store: UiStore) {
    super(store);
  }

}
