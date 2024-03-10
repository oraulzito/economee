import {Component, HostListener, OnInit} from '@angular/core';
import {UiService} from '../../state/ui/ui.service';
import {UiQuery} from '../../state/ui/ui.query';
import {Observable} from 'rxjs';
import {UiState} from '../../state/ui/ui.store';
import {ReleaseService} from '../../state/release/release.service';
import {AccountService} from "../../state/account/account.service";
import {AccountQuery} from "../../state/account/account.query";
import {ReleaseQuery} from "../../state/release/release.query";
import {UserService} from "../../state/user/user.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {
  mobile$: Observable<UiState>;
  totalAvailableValue: number;
  totalExpensesValue: number;
  totalIncomesValue: number;
  categoriesModalVisible = false;
  accountsModalVisible = false;
  cardsModalVisible = false;

  constructor(
    private userService: UserService,
    private accountQuery: AccountQuery,
    private accountService: AccountService,
    private releaseService: ReleaseService,
    private releaseQuery: ReleaseQuery,
    private uiService: UiService,
    private uiQuery: UiQuery,
  ) {
  }

  ngOnInit(): void {
    this.userService.get().subscribe(u=> console.log(u));
    this.mobile$ = this.uiQuery.isMobile$;
    this.onResize();
    this.uiQuery.select().subscribe(
      ui => {
        this.cardsModalVisible = ui.cardsModalVisible;
        this.categoriesModalVisible = ui.categoriesModalVisible;
        this.accountsModalVisible = ui.accountsModalVisible;
      }
    );

  }

  @HostListener('window:resize')
  onResize(): void {
    this.uiService.mobile();
  }
}
