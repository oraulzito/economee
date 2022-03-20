import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Observable} from "rxjs";

import {Account} from "../../../core/state/account/account.model";
import {Balance} from "../../../core/state/balance/balance.model";

import {SessionQuery} from "../../../core/state/user/session/session.query";
import {BalanceQuery} from "../../../core/state/balance/balance.query";
import {AccountQuery} from "../../../core/state/account/account.query";

import {AccountService} from "../../../core/state/account/account.service";
import {SessionService} from "../../../core/state/user/session/session.service";
import {ReleaseService} from "../../../core/state/release/release.service";
import {BalanceService} from "../../../core/state/balance/balance.service";
import {ReleaseCategoryService} from "../../../core/state/release/category/release-category.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
  isLogged$ = this.sessionQuery.isLoggedIn$;
  date_balance: string;
  total_available = this.accountQuery.totalAvailable$;

  account: Observable<Account>;
  balance: Observable<Balance>;

  constructor(
    private router: Router,
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
    if (this.isLogged$) {
      this.releaseCategoryService.get().subscribe();
      this.accountService.get().subscribe();
      this.accountService.getMainAccount().subscribe();
      this.balanceQuery.dateReference$.subscribe(d => this.date_balance = new Date(d).getFullYear() + '/' + new Date(d).getMonth());
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
