import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {UiStore} from './ui.store';
import isMobile from 'ismobilejs';

@Injectable({providedIn: 'root'})
export class UiService {

  constructor(private uiStore: UiStore, private http: HttpClient) {
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
}
