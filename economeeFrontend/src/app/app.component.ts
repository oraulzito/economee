import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';
import {UiStore} from './core/state/ui/ui.store';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit, OnDestroy {
  isCollapsed = false;
  event$: Subscription;

  constructor(
    private router: Router,
    private uiStore: UiStore,
  ) {
    this.event$
      = this.router.events
      .subscribe(
        (event) => {
          if (event instanceof NavigationStart || event instanceof NavigationEnd || event instanceof NavigationError) {
            this.uiStore.update({url: event.url});
          }
        });
  }

  // tslint:disable-next-line:typedef
  ngOnInit() {
  }

  // tslint:disable-next-line:typedef
  ngOnDestroy() {
    this.event$.unsubscribe();
  }
}
