import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ID} from '@datorama/akita';
import {User} from './user.model';
import {UserStore} from './user.store';
import {UiService} from '../ui/ui.service';
import {SessionStore} from './session/session.store';
import {Router} from "@angular/router";
import {Session} from "./session/session.model";
import {tap} from "rxjs/operators";

@Injectable({providedIn: 'root'})
export class UserService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private uiService: UiService,
    private userStore: UserStore,
    private sessionStore: SessionStore,
  ) {
  }

  create(form) {
    this.userStore.setLoading(true);

    const body = {
      email: form.email,
      password: form.password,
      repeat_password: form.repeat_password,
      username: form.username,
      first_name: form.first_name,
      last_name: form.last_name,
      dob: form.dob,
      // photo: form.photo.item(0),
      account_name: form.account_name,
      currency_id: form.currency_id
    };

    return this.http.post<Session>('/api/user/', body).pipe(
      tap(key => {
          this.userStore.update({
            email: form.email,
            username: form.username,
            first_name: form.first_name,
            last_name: form.last_name,
            dob: form.dob,
          });
          this.sessionStore.update(key);
          this.userStore.setLoading(false);
        },
        e => {
          this.userStore.setLoading(false);
        })
    );
  }

  checkUsername(value) {
    return this.http.get('/api/user/check_username?username=' + value).pipe(
      tap(
        r => {
          if (!r['available']) {
            return {error: true};
          } else {
            return {confirm: false, error: false};
          }
        }
      )
    );
  }

  checkEmail(value) {
    return this.http.get('/api/user/check_email?email=' + value);
  }

  get() {
    return this.http.get<User>('/api/user/', this.uiService.httpHeaderOptions()).pipe(tap(entities => {
      this.userStore.update(entities[0]);
    }));
  }

  update(id, user: Partial<User>) {
    // this.userStore.update(id, user);
  }

  remove(id: ID) {
  }
}
