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
  toggleActiveIds
} from '@ngneat/elf-entities';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {catchError, finalize} from "rxjs/operators";
import {resetStores} from "@datorama/akita";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UserRepository} from "./user.repository";

export interface Authentication {
  token: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AuthenticationProps {
}

@Injectable({providedIn: 'root'})
export class AuthenticationRepository {
  activeAuthentication$: Observable<Authentication[]>;
  Authentication$: Observable<Authentication[]>;

  private store;

  constructor(
    private http: HttpClient,
    private user: UserRepository
  ) {
    this.store = this.createStore();
    this.Authentication$ = this.store.pipe(selectAllEntities());
    this.activeAuthentication$ = this.store.pipe(selectActiveEntity());
  }

  setAuthentication(Authentication: Authentication[]) {
    this.store.update(setEntities(Authentication));
  }

  addAuthentication(Authentication: Authentication) {
    this.store.update(addEntities(Authentication));
  }

  updateAuthentication(id: Authentication['token'], Authentication: Partial<Authentication>) {
    this.store.update(updateEntities(id, Authentication));
  }

  deleteAuthentication(id: Authentication['token']) {
    this.store.update(deleteEntities(id));
  }

  private createStore(): typeof store {
    const store =
      createStore(
        {name: 'Authentication'},
        withProps<AuthenticationProps>({}),
        withEntities<Authentication, 'token'>({idKey: 'token'})
      );
    return store;
  }

  login(body: any) {
    this.store.setLoading(true);
    return this.http.post('/auth/login/', body).pipe(
      catchError(error => {
        this.handleLoginError(error);
        throw error; // Re-throwing the error to propagate it down the observable chain
      }),
      finalize(() => {
        this.store.setLoading(false);
      })
    ).subscribe(
      key => {
        this.handleLoginSuccess(key);
        this.user.getUser();
      }
    );
  }

  private handleLoginSuccess(key: any): void {
    this.store.update(key);
  }

  private handleLoginError(error: any): void {
    this.store.setError(error);
  }

  logout() {
    this.store.setLoading(true);
    return this.http.post('/auth/logout/',
      this.getHttpHeaderOptions()
    ).pipe(
      catchError(error => {
        throw error;
      }),
      finalize(() => {
        this.store.setLoading(false);
        this.handleLogoutFinalization();
      })
    ).subscribe();
  }

  private handleLogoutFinalization(): void {
    this.store.update({key: ''});
    localStorage.clear();
    resetStores(); // Assuming this is a function you've defined somewhere else
  }

  getHttpHeaderOptions() {
    const token = this.getSessionKey();
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Token ' + token
      })
    };
  }

  getSessionKey(): string {
    return this.store.getValue().token || ''; // Assuming key is a string
  }
}
