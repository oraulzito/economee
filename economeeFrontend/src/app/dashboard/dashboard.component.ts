import {Component, OnDestroy, OnInit} from '@angular/core';
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

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
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
  ) {
  }

  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.cardQuery.selectLoading().subscribe(r => this.loadingCard = r);
    this.accountQuery.selectLoading().subscribe(r => this.loadingAccount = r);
    this.balanceQuery.selectLoading().subscribe(r => this.loadingBalance = r);
    this.releaseQuery.selectLoading().subscribe(r => this.loadingRelease = r);
    this.invoiceQuery.selectLoading().subscribe(r => this.loadingInvoice = r);

    this.accountSubscription = this.accountService.get().subscribe(
      () => {
        this.accountQuery.selectFirst().subscribe(
          fa => this.accountStore.setActive(fa.id)
        );
      }
    );

    // get account balances
    this.balanceSubscription = this.balancesService.get().subscribe(
      () => {
        this.balancesService.loadMonthBalance();
        // Get the releases of the current balance
        this.releaseService.get().subscribe();
      }
    );

    // Get account cards
    this.cardSubscription = this.cardService.get().subscribe(
      () => {
        // Set active the first found card
        this.cardQuery.selectFirst().subscribe(
          (c) => {
            this.cardStore.setActive(c.id);

            this.invoiceSubscription = this.invoiceService.getCardInvoice().subscribe(() => {
              // Load the month invoice
              this.invoiceService.loadMonthInvoice();
              // Calc the expended, income, and total available value in the account.
              this.accountService.totalAvailable();
            });
          },
        );
      }
    );

    // Load all release categories
    this.releaseCategorySubscription = this.releaseCategoryService.get().subscribe();
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
