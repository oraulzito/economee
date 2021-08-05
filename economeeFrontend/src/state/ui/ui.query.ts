import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { UiStore, UiState } from './ui.store';

@Injectable({ providedIn: 'root' })
export class UiQuery extends QueryEntity<UiState> {

  constructor(protected store: UiStore) {
    super(store);
  }

}
