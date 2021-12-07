import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ID} from '@datorama/akita';
import {User} from './user.model';
import {UserStore} from './user.store';
import {UiService} from '../ui/ui.service';
import {SessionStore} from '../session/session.store';
import {Router} from "@angular/router";
import {Session} from "../session/session.model";
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

  // tslint:disable-next-line:typedef
  signup(value) {
    this.userStore.setLoading(true);

    const body = {
      email: value.email,
      password: value.password,
      repeat_password: value.repeat_password,
      username: value.username,
      first_name: value.first_name,
      last_name: value.last_name,
      dob: value.dob,
      // photo: value.photo.item(0),
      account_name: value.account_name,
      currency_id: value.currency_id
    };

    return this.http.post<Session>('/api/user/', body).pipe(
      tap(key => {
          this.userStore.update({
            email: value.email,
            username: value.username,
            first_name: value.first_name,
            last_name: value.last_name,
            dob: value.dob,
          });
          this.sessionStore.update(key);
          this.userStore.setLoading(false);
        },
        e => {
          this.userStore.setLoading(false);
        })
    );
  }

  // tslint:disable-next-line:typedef
  checkUsername(value) {
    return this.http.get('/api/user/check_username?username=' + value);
  }

  // tslint:disable-next-line:typedef
  checkEmail(value) {
    return this.http.get('/api/user/check_email?email=' + value);
  }

// tslint:disable-next-line:typedef
  get() {
    // return this.http.get<User>('/api/user/', this.uiService.httpHeaderOptions()).pipe(tap(entities => {
    //   this.userStore.set(entities);
    // }));
  }

// tslint:disable-next-line:typedef
  update(id, user
    :
    Partial<User>
  ) {
    // this.userStore.update(id, user);
  }

// tslint:disable-next-line:typedef
  remove(id
           :
           ID
  ) {
  }

}
