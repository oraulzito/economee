import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {tap} from 'rxjs/operators';
import {SessionStore} from './session.store';

@Injectable({providedIn: 'root'})
export class SessionService {

  constructor(
    private sessionStore: SessionStore,
    private http: HttpClient
  ) {
  }


  // tslint:disable-next-line:typedef
  login(body) {
    return this.http.post('/api/v1/login', body).pipe(tap(token => {
      this.sessionStore.update(token);
    }));
  }

  // tslint:disable-next-line:typedef
  logout() {
    // TODO backend request to delete the token on database
    this.sessionStore.update({token: ''});
  }
}
