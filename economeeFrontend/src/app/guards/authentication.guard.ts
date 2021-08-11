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
import {SessionQuery} from '../../state/session/session.query';
import {UiQuery} from '../../state/ui/ui.query';
import {toBoolean} from "@datorama/akita";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate, CanLoad {
  isLooged;

  constructor(
    private router: Router,
    private sessionQuery: SessionQuery,
    private uiQuery: UiQuery
  ) {
    this.sessionQuery.isLoggedIn$.subscribe((e) => {
      this.isLooged = e;
    });
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.isLooged) {
      if (this.uiQuery.getValue().url.includes('welcome') || this.uiQuery.getValue().url === '/') {
        return this.router.navigate(['dashboard']);
      }
    } else {
      if (this.uiQuery.getValue().url.includes('dashboard')) {
        return this.router.navigate(['welcome/login']);
      }
    }
    return true;
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    if (this.uiQuery.getValue().url.includes('welcome') || this.uiQuery.getValue().url === '/') {
      return !this.isLooged;
    } else {
      return this.isLooged;
    }
  }
}
