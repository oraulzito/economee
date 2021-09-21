import {AfterViewInit, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {AccountService} from '../../state/account/account.service';
import {BalanceService} from '../../state/balance/balance.service';
import {CardService} from '../../state/card/card.service';
import {ReleaseService} from '../../state/release/release.service';
import {ReleaseQuery} from '../../state/release/release.query';
import {BalanceQuery} from '../../state/balance/balance.query';
import {CardQuery} from '../../state/card/card.query';
import {BalanceState, BalanceStore} from '../../state/balance/balance.store';
import {getEntityType} from '@datorama/akita';
import {AccountStore} from '../../state/account/account.store';
import {AccountQuery} from '../../state/account/account.query';
import {InvoiceService} from '../../state/invoice/invoice.service';
import {InvoiceQuery} from '../../state/invoice/invoice.query';
import {InvoiceStore} from '../../state/invoice/invoice.store';
import {CardStore} from '../../state/card/card.store';
import {Card} from '../../state/card/card.model';
import {Balance} from '../../state/balance/balance.model';
import {Subscription} from 'rxjs';
import {ReleaseCategoryService} from '../../state/release-category/release-category.service';
import {UiQuery} from "../../state/ui/ui.query";
import {UiService} from "../../state/ui/ui.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  balances: getEntityType<BalanceState>;
  mobile$ = false;

  // tslint:disable-next-line:variable-name
  active_balance: Balance;
  // tslint:disable-next-line:variable-name
  active_card: Card;

  accountSubscription = new Subscription();
  balanceSubscription = new Subscription();
  invoiceSubscription = new Subscription();
  cardSubscription = new Subscription();
  releaseSubscription = new Subscription();
  releaseCategorySubscription = new Subscription();

  accountQuerySubscription = new Subscription();
  balanceQuerySubscription = new Subscription();
  invoiceQuerySubscription = new Subscription();
  cardQuerySubscription = new Subscription();
  releaseQuerySubscription = new Subscription();

  loadingAccount = false;
  loadingBalance = false;
  loadingCard = false;
  loadingRelease = false;
  loadingInvoice = false;

  constructor(
    private accountService: AccountService,
    private balancesService: BalanceService,
    private cardService: CardService,
    private releaseService: ReleaseService,
    private releaseCategoryService: ReleaseCategoryService,
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
    private uiService: UiService,
    private uiQuery: UiQuery
  ) {
  }

  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.cardQuery.selectLoading().subscribe(r => this.loadingCard = r);
    this.accountQuery.selectLoading().subscribe(r => this.loadingAccount = r);
    this.balanceQuery.selectLoading().subscribe(r => this.loadingBalance = r);
    this.releaseQuery.selectLoading().subscribe(r => this.loadingRelease = r);
    this.invoiceQuery.selectLoading().subscribe(r => this.loadingInvoice = r);
    this.uiQuery.select('mobile').subscribe(m => this.mobile$ = m);

    this.accountService.get();

    this.accountQuery.selectFirst().subscribe(
      fa => {
        if (fa) {
          this.accountStore.setActive(fa.id);

          // get account balances
          this.balancesService.get();
          this.balancesService.loadMonthBalance();

          // Get the releases of the current balance
          this.releaseService.get();
        }
      }
    );

    // Get account cards
    this.cardService.get()

    // Set active the first found card
    this.cardQuery.selectFirst().subscribe(
      c => {
        if (c) {
          this.cardStore.setActive(c.id);
          this.invoiceService.getCardInvoice();
        }
      }
    );


    // Load all release categories
    this.releaseCategoryService.get();
  }

  ngAfterViewInit() {
    if (this.accountQuery.hasActive() && this.cardQuery.hasActive() && this.balanceQuery.hasActive() && this.invoiceQuery.hasActive()) {
      this.invoiceService.loadMonthInvoice();
      // Calc the expended, income, and total available value in the account.
      this.accountService.totalAvailable();
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.uiService.mobile();
  }

  ngOnDestroy(): void {
    this.balanceQuerySubscription.unsubscribe();
    this.cardQuerySubscription.unsubscribe();
    this.accountSubscription.unsubscribe();
    this.cardSubscription.unsubscribe();
    this.balanceSubscription.unsubscribe();
    this.invoiceSubscription.unsubscribe();
    this.releaseSubscription.unsubscribe();
    this.releaseCategorySubscription.unsubscribe();
  }

}
