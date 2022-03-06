import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {shareReplay, tap} from 'rxjs/operators';
import {SessionStore} from './session.store';
import {UiService} from '../../ui/ui.service';
import {resetStores} from '@datorama/akita';

@Injectable({providedIn: 'root'})
export class SessionService {

  constructor(
    private uiService: UiService,
    private sessionStore: SessionStore,
    private http: HttpClient
  ) {
  }


  // tslint:disable-next-line:typedef
  login(body) {
    this.sessionStore.setLoading(true);
    return this.http.post('/auth/login/', body).pipe(
      tap(
        key => {
          this.sessionStore.update(key);
        },
        error => {
          this.sessionStore.setError(error);
          this.sessionStore.setLoading(false);
        },
        () => {
          this.sessionStore.setLoading(false);
        }),
      shareReplay(1));
  }

  // tslint:disable-next-line:typedef
  logout() {
    this.sessionStore.setLoading(true);
    return this.http.post('/auth/logout/', this.uiService.httpHeaderOptions()).pipe(tap(key => {
        this.sessionStore.update({key: ''});
        this.sessionStore.setLoading(false);
        localStorage.clear();
        resetStores();
      }),
      shareReplay(1));
  }
}
