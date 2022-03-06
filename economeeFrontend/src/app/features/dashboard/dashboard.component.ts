import {Component, HostListener, OnInit} from '@angular/core';
import {UiService} from '../../core/state/ui/ui.service';
import {UiQuery} from '../../core/state/ui/ui.query';
import {Observable} from 'rxjs';
import {UiState} from '../../core/state/ui/ui.store';
import {ReleaseService} from '../../core/state/release/release.service';
import {AccountService} from "../../core/state/account/account.service";
import {AccountQuery} from "../../core/state/account/account.query";
import {ReleaseQuery} from "../../core/state/release/release.query";

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

  constructor(
    private accountQuery: AccountQuery,
    private accountService: AccountService,
    private releaseService: ReleaseService,
    private releaseQuery: ReleaseQuery,
    private uiService: UiService,
    private uiQuery: UiQuery,
  ) {
  }

  ngOnInit(): void {
    this.mobile$ = this.uiQuery.isMobile$;
    this.onResize();
    //
    // this.accountService.getTotalExpenses();
    // this.accountService.getTotalIncomes();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.uiService.mobile();
  }
}
