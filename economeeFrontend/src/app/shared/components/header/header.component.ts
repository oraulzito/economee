import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Balance} from "../../../core/state/balance/balance.model";

import {SessionQuery} from "../../../core/state/user/session/session.query";
import {BalanceQuery} from "../../../core/state/balance/balance.query";
import {AccountQuery} from "../../../core/state/account/account.query";

import {AccountService} from "../../../core/state/account/account.service";
import {SessionService} from "../../../core/state/user/session/session.service";
import {ReleaseService} from "../../../core/state/release/release.service";
import {BalanceService} from "../../../core/state/balance/balance.service";
import {ReleaseCategoryService} from "../../../core/state/release/category/release-category.service";
import {UiQuery} from "../../../core/state/ui/ui.query";
import {format} from "date-fns";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
  isLogged$ = this.sessionQuery.isLoggedIn$;
  actualUrl$ = '/';
  isLogged;
  accountName$ = this.accountQuery.activeAccountName$;

  balanceDate;
  balance: Balance;

  constructor(
    private router: Router,
    private uiQuery: UiQuery,
    private sessionQuery: SessionQuery,
    private sessionService: SessionService,
    private balanceQuery: BalanceQuery,
    private balanceService: BalanceService,
    private accountQuery: AccountQuery,
    private accountService: AccountService,
    private releaseService: ReleaseService,
    private releaseCategoryService: ReleaseCategoryService,
  ) {
  }

  ngOnInit(): void {
    this.uiQuery.actualUrl$.subscribe(url => this.actualUrl$ = url);

    this.sessionQuery.isLoggedIn$.subscribe(
      ili => this.isLogged = ili
    );

    if (this.isLogged) {
      this.releaseCategoryService.get().subscribe();
      this.accountService.get().subscribe();
      this.accountService.getMainAccount().subscribe();
      this.balanceQuery.dateReference$.subscribe(d => {
        this.balanceDate = format(new Date(d), 'mm/yyyy');
      });
    }
  }

  onMonthChange(result): void {
    let date_balance = this.balanceService.formatDateForBalance(result);
    this.balanceService.setActiveMonthBalance(undefined, date_balance);
  }

  // tslint:disable-next-line:typedef
  logout() {
    this.sessionService.logout().subscribe(
      () => console.log("Loggin out"),
      (err) => alert(err),
      () => this.router.navigate(['/'])
    );
  }

}
