import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {UiStore} from './core/state/ui/ui.store';
import {Subscription} from 'rxjs';
import {UiQuery} from "./core/state/ui/ui.query";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit, OnDestroy {
  isCollapsed = false;
  event$: Subscription;
  actualUrl = '';

  constructor(
    private router: Router,
    private uiStore: UiStore,
    private uiQuery: UiQuery,
  ) {
    this.router.events.subscribe(
      (event) => {
        if (event instanceof NavigationEnd)
          this.uiStore.update({actualUrl: event.url});
      });
  }

  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.uiQuery.actualUrl$.subscribe(
      url => this.actualUrl = url
    )
  }

  // tslint:disable-next-line:typedef
  ngOnDestroy() {
    this.event$.unsubscribe();
  }
}
