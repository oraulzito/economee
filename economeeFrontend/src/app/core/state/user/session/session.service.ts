import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {catchError, shareReplay, tap} from 'rxjs/operators';
import {SessionStore} from './session.store';
import {UiService} from '../../ui/ui.service';
import {resetStores} from '@datorama/akita';
import {Router} from "@angular/router";
import {finalize} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class SessionService {

  constructor(
    private uiService: UiService,
    private sessionStore: SessionStore,
    private http: HttpClient,
    private router: Router
  ) {
  }

  login(body: any) {
    this.sessionStore.setLoading(true);
    return this.http.post('/auth/login/', body).pipe(
      catchError(error => {
        this.handleLoginError(error);
        throw error; // Re-throwing the error to propagate it down the observable chain
      }),
      finalize(() => {
        this.sessionStore.setLoading(false);
      })
    ).subscribe(
      key => {
        this.handleLoginSuccess(key);
      }
    );
  }

  private handleLoginSuccess(key: any): void {
    this.sessionStore.update(key);
    this.router.navigate(['/dashboard']);
  }

  private handleLoginError(error: any): void {
    this.sessionStore.setError(error);
  }

  logout() {
    this.sessionStore.setLoading(true);
    return this.http.post('/auth/logout/', this.uiService.httpHeaderOptions()).pipe(
      catchError(error => {
        throw error;
      }),
      finalize(() => {
        this.sessionStore.setLoading(false);
        this.handleLogoutFinalization();
      })
    ).subscribe();
  }

  private handleLogoutFinalization(): void {
    this.sessionStore.update({key: ''});
    localStorage.clear();
    resetStores(); // Assuming this is a function you've defined somewhere else
  }
}
