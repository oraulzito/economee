import {createStore, withProps} from '@ngneat/elf';
import {
  withEntities,
  selectAllEntities,
  setEntities,
  addEntities,
  updateEntities,
  deleteEntities,
  withUIEntities,
  withActiveId,
  selectActiveEntity,
  setActiveId,
  withActiveIds,
  selectActiveEntities,
  toggleActiveIds, selectEntityByPredicate, getEntity
} from '@ngneat/elf-entities';
import {Observable, throwError} from 'rxjs';
import {Injectable} from '@angular/core';
import {ID, setLoading} from "@datorama/akita";
import {Currency} from "../currency/currency.model";
import {catchError, shareReplay, tap} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {AuthenticationRepository} from "./authentication.repository";

export interface AccountUI {
  id: number;
  open: boolean;
}

export interface Account {
  id: ID;
  owner_id: ID;
  name: string;
  currency: Currency;
  is_main_account: boolean;
  total_available: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AccountProps {
}

@Injectable({providedIn: 'root'})
export class AccountRepository {
  activeAccount$: Observable<Account[]>;
  activeAccounts$: Observable<Account | undefined>;
  account$: Observable<Account[]>;

  private store;

  constructor(
    private http: HttpClient,
    private authentication: AuthenticationRepository
  ) {
    this.store = this.createStore();
    this.account$ = this.store.pipe(selectAllEntities());
    this.activeAccount$ = this.store.pipe(selectActiveEntity());
    this.activeAccount$ = this.store.pipe(selectActiveEntities());
  }

  getAccount() {
    return this.http.get<Account[]>('/api/account', this.authentication.getHttpHeaderOptions()).pipe(
      shareReplay(1),
      tap(accounts => {
        this.store.set(accounts);
        let main_account = this.store.query(
          getEntity(({a}) => a.is_main_account)
        );
        this.setActiveId(main_account.id);
      }),
      catchError(error => throwError(error))
    );
  }

  setAccount(account: Account[]) {
    this.store.update(setEntities(account));
  }

  addAccount(account: Account) {
    this.store.update(addEntities(account));
  }

  updateAccount(id: Account['id'], account: Partial<Account>) {
    this.store.update(updateEntities(id, account));
  }

  deleteAccount(id: Account['id']) {
    this.store.update(deleteEntities(id));
  }

  setActiveId(id: Account['id']) {
    this.store.update(setActiveId(id));
  }

  toggleActiveIds(ids: Array<Account['id']>) {
    this.store.update(toggleActiveIds(ids));
  }

  private createStore(): typeof store {
    const store =
      createStore(
        {name: 'account'},
        withProps<AccountProps>({}),
        withEntities<Account, 'id'>({idKey: 'id'}),
        withUIEntities<AccountUI, 'id'>({idKey: 'id'}),
        withActiveId(),
        withActiveIds()
      );

    return store;
  }


}
