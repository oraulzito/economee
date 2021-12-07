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
  styleUrls: ['./dashboard.component.s.less']
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
    this.uiQuery.select('mobile').subscribe(m => this.mobile$ = m);

    this.accountService.get().subscribe(
      (fa) => {
        if (fa) {
          // TODO change to set active a preferred account
          // set the first account as active
          this.accountStore.setActive(fa[0].id);
        }
      },
      () => {
      },
      () => {
        this.balancesService.get().subscribe(
          () => this.balancesService.loadMonthBalance(),
          () => {
          },
          () => this.releaseService.getMonthReleases().subscribe()
        );

        // Get account cards
        this.cardService.get().subscribe(
          c => this.cardStore.setActive(c[0].id),
          () => {
          },
          () => {
            this.invoiceService.getCardInvoice().subscribe(
              () => {},
              () => {},
              () => this.invoiceService.loadMonthInvoice()
            );
          }
        );

        // Load all release categories
        this.releaseCategoryService.get().subscribe();
      }
    );
  }

  @HostListener('window:resize')
  onResize() {
    this.uiService.mobile();
  }

  ngOnDestroy(): void {
    this.accountSubscription.unsubscribe();
  }

}
