import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {UiStore} from './ui.store';
import isMobile from 'ismobilejs';
import {SessionQuery} from '../user/session/session.query';

@Injectable({providedIn: 'root'})
export class UiService {

  constructor(
    private uiStore: UiStore,

    private sessionQuery: SessionQuery,
    private http: HttpClient
  ) {
  }

  // tslint:disable-next-line:typedef
  mobile() {
    const browser = window.navigator.userAgent;
    if (isMobile(browser).phone) {
      this.uiStore.update({mobile: true});
    } else {
      this.uiStore.update({mobile: false});
    }
  }

  // tslint:disable-next-line:typedef
  httpHeaderOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Token ' + this.sessionQuery.getValue().key
      })
    };
  }
}
