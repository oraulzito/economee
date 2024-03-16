import {createStore} from '@ngneat/elf';
import {
  withEntities,
  selectAllEntities,
  setEntities,
  addEntities,
  updateEntities,
  selectActiveEntity,
  selectActiveEntities,
} from '@ngneat/elf-entities';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import isMobile from "ismobilejs";
import {HttpHeaders} from "@angular/common/http";
import {now} from "moment";

export interface Ui {
  id: number | string;
  mobile: boolean;
  portrait: boolean;
  initialDateFilter: Date;
  finalDateFilter: Date;
  screenWidth: number;
  screenHeight: number;
  // pageLocation: string;
  // actualUrl: string;
  cardsModalVisible: boolean;
  categoriesModalVisible: boolean;
  selectedDateRange: RANGE_BALANCE;
}

enum RANGE_BALANCE {
  MONTH = 30 | 31 | 28,
  HALF_MONTH = 15,
  WEEK = 7,
  DAY = 1
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UiProps {
}

@Injectable({providedIn: 'root'})
export class UiRepository {
  activeUi$: Observable<Ui[]>;
  ui$: Observable<Ui[]>;

  private store;

  constructor() {
    this.store = this.createStore();
    this.ui$ = this.store.pipe(selectAllEntities());
    this.activeUi$ = this.store.pipe(selectActiveEntity());
    this.activeUi$ = this.store.pipe(selectActiveEntities());
  }

  setUi(ui: Ui[]) {
    this.store.update(setEntities(ui));
  }

  addUi(ui: Ui) {
    this.store.update(addEntities(ui));
  }

  updateUi(id: Ui['id'], ui: Partial<Ui>) {
    this.store.update(updateEntities(id, ui));
  }

  mobile() {
    const browser = window.navigator.userAgent;
    if (isMobile(browser).phone || isMobile(browser).tablet || isMobile(browser)) {
      this.store.update(updateEntities(1, {mobile: true}));
      return true;
    } else {
      this.store.update(updateEntities(1, {mobile: false}));
      return false;
    }
  }

  updateOrientation() {
    if (window.matchMedia('(orientation: portrait)').matches) {
      this.store.update(updateEntities(1, {portrait: true}));
      return true;
    } else {
      this.store.update(updateEntities(1, {portrait: false}));
      return false;
    }
  }

  updateScreenSize() {
    this.store.update(updateEntities(1, {screenWidth: window.innerWidth}));
    this.store.update(updateEntities(1, {screenHeight: window.innerHeight}));
  }

  dateRangeChange(value: number) {
    this.store.update(updateEntities(1, {selectedDateRange: value}));
  }

  private createStore(): typeof store {
    const store =
      createStore(
        {name: 'ui'},
        withEntities<Ui>({
          initialValue: [
            {
              id: 1,
              screenWidth: window.innerWidth,
              screenHeight: window.innerHeight,
              mobile: true,
              portrait: true,
              initialDateFilter: new Date(),
              finalDateFilter: new Date(),
              cardsModalVisible: false,
              categoriesModalVisible: false,
              selectedDateRange: RANGE_BALANCE.MONTH
            },
          ],
        })
      );

    return store;
  }
}
