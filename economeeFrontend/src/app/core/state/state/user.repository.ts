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
import {map, Observable, throwError} from 'rxjs';
import {Injectable} from '@angular/core';
import {catchError, finalize, tap} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {AuthenticationRepository} from "./authentication.repository";

export interface UserUI {
  id: number;
}

export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  dob: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UserProps {
}

@Injectable({providedIn: 'root'})
export class UserRepository {
  user$: Observable<User[]>;

  private store;

  constructor(
    private http: HttpClient,
    private authentication: AuthenticationRepository
  ) {
    this.store = this.createStore();
    this.user$ = this.store.pipe(selectAllEntities());
  }

  getUser() {
    return this.http.get<User>('/api/user/',
      this.authentication.getHttpHeaderOptions()
    ).pipe(
      tap(entities => {
        this.setUser(entities[0]);
      })
    );
  }

  setUser(user: User[]) {
    this.store.update(setEntities(user));
  }

  addUser(user: User) {
    this.store.update(addEntities(user));
  }

  updateUser(id: User['id'], user: Partial<User>) {
    this.store.update(updateEntities(id, user));
  }

  deleteUser(id: User['id']) {
    this.store.update(deleteEntities(id));
  }

  setActiveId(id: User['id']) {
    this.store.update(setActiveId(id));
  }

  toggleActiveIds(ids: Array<User['id']>) {
    this.store.update(toggleActiveIds(ids));
  }

  create(form): Observable<any> {
    this.store.setLoading(true);

    const body = {...form}; // Copy form data directly to body

    return this.http.post<any>('/api/user/', body).pipe(
      tap((key) => {
        this.authentication.login({
          email: form.email,
          password: form.password
        });
      }),
      catchError((error) => {
        // Handle errors and set loading state
        this.store.setLoading(false);
        return throwError(error);
      }),
      finalize(() => {
        // Ensure loading state is always set to false
        this.store.setLoading(false);
      })
    );
  }

  checkUsername(value: string): Observable<any> {
    return this.http.get<any>('/api/user/check_username', {params: {username: value}})
      .pipe(
        map(response => {
          if (!response.available) {
            return {error: true};
          } else {
            return {confirm: false, error: false};
          }
        })
      );
  }

  checkEmail(value) {
    return this.http.get('/api/user/check_email?email=' + value);
  }

  private createStore(): typeof store {
    const store =
      createStore(
        {name: 'user'},
        withProps<UserProps>({}),
        withEntities<User, 'id'>({idKey: 'id'}),
        withUIEntities<UserUI, 'id'>({idKey: 'id'}),
        withActiveId(),
        withActiveIds()
      );

    return store;
  }
}
