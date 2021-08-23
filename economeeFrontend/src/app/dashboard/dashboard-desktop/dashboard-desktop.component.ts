import {Component, OnInit} from '@angular/core';
import {ReleaseQuery} from '../../../state/release/release.query';
import {InvoiceQuery} from '../../../state/invoice/invoice.query';
import {BalanceQuery} from '../../../state/balance/balance.query';
import {Release} from '../../../state/release/release.model';

@Component({
  selector: 'app-dashboard-desktop',
  templateUrl: './dashboard-desktop.component.html',
  styleUrls: ['./dashboard-desktop.component.css']
})
export class DashboardDesktopComponent implements OnInit {
  balanceReleases: Release[] = [];
  cardReleases: Release[] = [];
  loadingReleases = false;

  constructor(
    private releaseQuery: ReleaseQuery,
    private balanceQuery: BalanceQuery,
    private invoiceQuery: InvoiceQuery
  ) {
  }

  ngOnInit(): void {

  }

}
