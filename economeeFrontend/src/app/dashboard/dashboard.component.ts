import {Component, OnInit} from '@angular/core';
import {AccountService} from '../../state/account/account.service';
import {BalanceService} from '../../state/balance/balance.service';
import {CardService} from '../../state/card/card.service';
import {ReleaseService} from '../../state/release/release.service';
import {ReleaseQuery} from '../../state/release/release.query';
import {BalanceQuery} from '../../state/balance/balance.query';
import {CardQuery} from '../../state/card/card.query';
import {formatDate} from '@angular/common';
import {BalanceState, BalanceStore} from '../../state/balance/balance.store';
import {getEntityType} from '@datorama/akita';
import {AccountStore} from "../../state/account/account.store";
import {AccountQuery} from "../../state/account/account.query";
import {InvoiceService} from "../../state/invoice/invoice.service";
import {InvoiceQuery} from "../../state/invoice/invoice.query";
import {InvoiceStore} from "../../state/invoice/invoice.store";
import {CardStore} from "../../state/card/card.store";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  balances: getEntityType<BalanceState>;
  mobile$ = false;

  constructor(
    private accountService: AccountService,
    private balancesService: BalanceService,
    private cardService: CardService,
    private releaseService: ReleaseService,
    private invoiceService: InvoiceService,
    private accountQuery: AccountQuery,
    private balanceQuery: BalanceQuery,
    private cardQuery: CardQuery,
    private invoiceQuery: InvoiceQuery,
    private releaseQuery: ReleaseQuery,
    private accountStore: AccountStore,
    private balancesStore: BalanceStore,
    private invoiceStore: InvoiceStore,
    private cardStore: CardStore,
  ) {
  }

  // tslint:disable-next-line:typedef
  ngOnInit() {
    // Getting the actual date to select the balance of the actual month
    // It needs to be formatted to YYYY-MM
    const actualDate = new Date();
    const firstDayOfMonth = new Date(actualDate.getFullYear(), actualDate.getMonth(), 1);
    const date = formatDate(firstDayOfMonth.toString(), 'YYYY-MM', 'en-US');

    this.accountService.get().subscribe(
      () => {
        this.accountQuery.selectFirst().subscribe(
          r => this.accountStore.setActive(r.id)
        );
      }
    );

    this.releaseService.get().subscribe();

    this.balancesService.get().subscribe(
      () => {
        this.balanceQuery.selectEntity(({date_reference}) => date_reference === date).subscribe(
          r => {
            this.balancesStore.setActive(r.id);
            this.releaseQuery.selectAll({
              filterBy: ({balance_id}) => balance_id === r.id
            }).subscribe(
              (rb) => console.log(rb)
            );
          }
        );
      }
    );

    this.cardService.get().subscribe(
      () => {
        this.cardQuery.selectFirst().subscribe(
          r => {
            this.cardStore.setActive(r.id);

            this.invoiceService.getCardInvoice().subscribe(
              () => {
                this.invoiceQuery.selectEntity(({date_reference}) => date_reference === date).subscribe(
                  riq => {
                    this.invoiceStore.setActive(riq.id);
                    this.releaseQuery.selectAll({
                      filterBy: ({invoice_id}) => invoice_id === riq.id
                    }).subscribe(
                      (ri) => console.log(ri)
                    );
                  }
                );
              }
            );

          }
        );
      }
    );
  }

}
