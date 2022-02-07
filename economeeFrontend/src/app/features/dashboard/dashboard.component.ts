import {Component, HostListener, OnInit} from '@angular/core';
import {UiService} from '../../core/state/ui/ui.service';
import {UiQuery} from '../../core/state/ui/ui.query';
import {Observable} from 'rxjs';
import {UiState} from '../../core/state/ui/ui.store';
import {ReleaseService} from '../../core/state/release/release.service';
import {BalanceQuery} from '../../core/state/balance/balance.query';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {
  mobile$: Observable<UiState>;

  constructor(
    private balanceQuery: BalanceQuery,
    private releaseService: ReleaseService,
    private uiService: UiService,
    private uiQuery: UiQuery,
  ) {
  }

  ngOnInit(): void {
    this.mobile$ = this.uiQuery.isMobile$;
    this.balanceQuery.selectActive().subscribe(
      (b) => b ? this.releaseService.getMonthReleases(b).subscribe() : console.log('n chamou')
    );
    this.onResize();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.uiService.mobile();
  }
}
