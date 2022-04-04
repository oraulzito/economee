import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree
} from '@angular/router';
import {Observable} from 'rxjs';
import {SessionQuery} from '../state/user/session/session.query';
import {UiQuery} from '../state/ui/ui.query';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate, CanLoad {
  isLogged;

  constructor(
    private router: Router,
    private sessionQuery: SessionQuery,
    private uiQuery: UiQuery
  ) {
    this.sessionQuery.isLoggedIn$.subscribe((e) => {
      this.isLogged = e;
    });
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.isLogged) {
      //if the actual url is not dashboard, redirect to dashboard
      if (state.url !== '/dashboard') {
        this.router.navigate(['/dashboard']).then();
      } else {
        return true;
      }
    } else {
      // If the user is not logged in and the actual url is not "dashboard", allow them to continue to the url
      if (state.url !== '/dashboard') {
        return true;
      } else {
        // If the user is not logged in and the actual url is "dashboard", redirect to the login page
        this.router.navigateByUrl('login').then();
      }
    }
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    if (this.uiQuery.getValue().actualUrl.includes('welcome') || this.uiQuery.getValue().actualUrl === '/') {
      return !this.isLogged;
    } else {
      return this.isLogged;
    }
  }
}
