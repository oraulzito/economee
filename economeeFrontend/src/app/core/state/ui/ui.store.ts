import {Injectable} from '@angular/core';
import {EntityState, Store, StoreConfig} from '@datorama/akita';
import {RANGE_BALANCE, Ui} from './ui.model';

export interface UiState extends EntityState<Ui> {
}


@Injectable({providedIn: 'root'})
@StoreConfig({name: 'ui'})
export class UiStore extends Store<UiState> {

  constructor() {
    let date = new Date();
    super({
      id: 1,
      actualrl:'',
      mobile: false,
      ui: '',
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      rangeDateBalance: RANGE_BALANCE.MONTH,
      initialDateBalance: new Date(date.getFullYear(), date.getMonth(), 1),
      finalDateBalance: new Date(date.getFullYear(), date.getMonth() + 1, 0),
    });
  }

}
