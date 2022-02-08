import {Component, Input, OnInit} from '@angular/core';
import {ReleaseQuery} from '../../../core/state/release/release.query';
import {Release} from '../../../core/state/release/release.model';
import {BalanceQuery} from "../../../core/state/balance/balance.query";

@Component({
  selector: 'app-release',
  templateUrl: './release.component.html',
  styleUrls: ['./release.component.less']
})
export class ReleaseComponent implements OnInit {
  @Input()
  releaseType: number;

  releases: Release[];
  releasesLoading: boolean;

  constructor(
    private balanceQuery: BalanceQuery,
    private releaseQuery: ReleaseQuery,
  ) {
  }

  ngOnInit(): void {
    this.balanceQuery.selectActive().subscribe(
      (b) => b ? this.queryReleases() : ''
    );

    this.releaseQuery.selectLoading().subscribe(
      l => this.releasesLoading = l
    );
  }

  queryReleases(): void {
    switch (this.releaseType) {
      case 1:
        this.releaseQuery.debitReleases$.subscribe(
          r => this.releases = r
        );
        break;
      case 2:
        this.releaseQuery.cardReleases$.subscribe(
          r => this.releases = r
        );
        break;
      case 3:
        this.releaseQuery.debitExpensesReleases$.subscribe(
          r => this.releases = r
        );
        break;
      case 4:
        this.releaseQuery.debitIncomesReleases$.subscribe(
          r => this.releases = r
        );
        break;
      default:
        this.releaseQuery.allReleases$.subscribe(
          r => this.releases = r
        );
        break;
    }
  }
}
