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
    // get balance releases
    this.releaseQuery.selectAll({
      filterBy: ({balance_id}) => balance_id === this.balanceQuery.getActiveId()
    }).subscribe(
      (rb) => {
        this.balanceReleases = rb;
        // console.log(JSON.stringify(rb));
      }
    );

    // get card releases
    if (this.invoiceQuery.hasActive()) {
      this.releaseQuery.selectAll({
        filterBy: ({invoice_id}) => invoice_id === this.invoiceQuery.getActiveId()
      }).subscribe(
        (ri) => {
          this.cardReleases = ri;
        }
      );
    }
  }

}
