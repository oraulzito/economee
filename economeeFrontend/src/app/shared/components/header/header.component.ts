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
import {UiStore} from "../../../core/state/ui/ui.store";
import {UserQuery} from "../../../core/state/user/user.query";
import {UserState} from "../../../core/state/user/user.store";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
  isLogged$ = this.sessionQuery.isLoggedIn$;
  actualUrl$ = '/';

  isLogged = false;
  accountName$ = this.accountQuery.activeAccountName$;

  balanceDate$ = this.balanceQuery.dateReference$;
  balance: Balance;
  user: UserState;

  constructor(
    private router: Router,
    private uiQuery: UiQuery,
    private uiStore: UiStore,
    private userQuery: UserQuery,
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
    this.userQuery.select().subscribe(user => {
      this.user = user;
    });

    this.uiQuery.actualUrl$.subscribe(url => this.actualUrl$ = url);

    this.sessionQuery.isLoggedIn$.subscribe(
      ili => this.isLogged = ili
    );

    if (this.isLogged) {
      this.releaseCategoryService.get().subscribe();
      this.accountService.get().subscribe();
      this.accountService.getMainAccount().subscribe();
    }
  }

  onMonthChange(result): void {
    let date_balance = this.balanceService.formatDateForBalance(result.target.value);
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

  openCardsModal() {
    this.uiStore.update({
      cardsModalVisible: true
    });
  }

  openCategoriesModal() {
    this.uiStore.update({
      categoriesModalVisible: true
    });
  }


}
