import {Component, OnInit} from '@angular/core';
import {SessionQuery} from "../../../core/state/user/session/session.query";
import {AccountService} from "../../../core/state/account/account.service";
import {SessionService} from "../../../core/state/user/session/session.service";
import {ReleaseService} from "../../../core/state/release/release.service";
import {Router} from "@angular/router";
import {BalanceQuery} from "../../../core/state/balance/balance.query";
import {Account} from "../../../core/state/account/account.model";
import {Observable} from "rxjs";
import {Balance} from "../../../core/state/balance/balance.model";
import {BalanceService} from "../../../core/state/balance/balance.service";
import {ReleaseCategoryService} from "../../../core/state/release/category/release-category.service";
import {AccountQuery} from "../../../core/state/account/account.query";

@Component({
  selector: 'app-header', templateUrl: './header.component.html', styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
  date_balance = null;

  isLogged$ = this.sessionQuery.isLoggedIn$;

  total_available: number;

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
      this.balanceQuery.activeEntity$.subscribe(r => this.date_balance = r.date_reference);
      this.accountQuery.totalAvailable$.subscribe(r => this.total_available = r);
    }
  }

  onMonthChange(result): void {
    let date_balance = this.balanceService.formatDateForBalance(result);
    this.balanceService.setActiveMonthBalance(undefined, date_balance);
  }

  // tslint:disable-next-line:typedef
  logout() {
    // TODO add a logout message and the loader
    this.sessionService.logout().subscribe(
      () => {
        this.router.navigate(['/'])
      },
      (err) => alert(err)
    );
  }

}
