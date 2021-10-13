import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {AccountService} from '../../state/account/account.service';
import {AccountStore} from '../../state/account/account.store';
import {AccountQuery} from '../../state/account/account.query';
import {Subscription} from 'rxjs';
import {UiQuery} from "../../state/ui/ui.query";
import {UiService} from "../../state/ui/ui.service";
import {BalanceService} from "../../state/balance/balance.service";
import {CardService} from "../../state/card/card.service";
import {ReleaseService} from "../../state/release/release.service";
import {ReleaseCategoryService} from "../../state/release-category/release-category.service";
import {InvoiceService} from "../../state/invoice/invoice.service";
import {BalanceQuery} from "../../state/balance/balance.query";
import {CardQuery} from "../../state/card/card.query";
import {InvoiceQuery} from "../../state/invoice/invoice.query";
import {CardStore} from "../../state/card/card.store";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  mobile$ = false;

  accountSubscription = new Subscription();
  accountQuerySubscription = new Subscription();

  loadingAccount = false;

  constructor(
    private balancesService: BalanceService,
    private cardService: CardService,
    private releaseService: ReleaseService,
    private releaseCategoryService: ReleaseCategoryService,
    private invoiceService: InvoiceService,
    private accountService: AccountService,
    private accountQuery: AccountQuery,
    private balanceQuery: BalanceQuery,
    private invoiceQuery: InvoiceQuery,
    private cardQuery: CardQuery,
    private accountStore: AccountStore,
    private cardStore: CardStore,
    private uiService: UiService,
    private uiQuery: UiQuery,
  ) {


  }

  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.onResize();
    this.accountService.get().subscribe();

    this.accountQuery.selectFirst().subscribe(
      fa => {
        if (fa) {
          // TODO change to set active a preferred account
          // set the first account as active
          this.accountStore.setActive(fa.id);
        }
      });

    this.accountQuery.selectActive().subscribe(
      aa => {
        if (aa) {
          // get account balances
          this.balancesService.get().subscribe(
            () => this.balancesService.loadMonthBalance()
          );

          // Get account cards
          this.cardService.get().subscribe();

          // Load all release categories
          this.releaseCategoryService.get().subscribe();
        }
      }
    );

    this.balanceQuery.selectActive().subscribe(ab => {
      if (ab) {
        this.releaseService.getMonthReleases().subscribe();
      }
    });

    // Set active the first found card
    this.cardQuery.selectFirst().subscribe(
      c => {
        if (c) {
          this.cardStore.setActive(c.id);
        }
      }
    );

    this.cardQuery.selectActive().subscribe(
      ac => {
        if (ac) {
          this.invoiceService.getCardInvoice().subscribe(
            () => this.invoiceService.loadMonthInvoice()
          );
        }
      }
    );

    this.uiQuery.select('mobile').subscribe(m => this.mobile$ = m);
  }

  @HostListener('window:resize')
  onResize() {
    this.uiService.mobile();
  }

  ngOnDestroy(): void {
    this.accountSubscription.unsubscribe();
  }

}
