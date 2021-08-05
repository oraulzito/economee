import {Injectable} from '@angular/core';
import {EntityState, Store, StoreConfig} from '@datorama/akita';
import {Ui} from './ui.model';

export interface UiState extends EntityState<Ui> {
}


@Injectable({providedIn: 'root'})
@StoreConfig({name: 'ui'})
export class UiStore extends Store<UiState> {

  constructor() {
    super({
      id: 1,
      mobile: false,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
    });
  }

}
