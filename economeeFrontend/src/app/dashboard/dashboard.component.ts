import {Component, OnDestroy, OnInit} from '@angular/core';
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
import {AccountStore} from '../../state/account/account.store';
import {AccountQuery} from '../../state/account/account.query';
import {InvoiceService} from '../../state/invoice/invoice.service';
import {InvoiceQuery} from '../../state/invoice/invoice.query';
import {InvoiceStore} from '../../state/invoice/invoice.store';
import {CardStore} from '../../state/card/card.store';
import {Card} from '../../state/card/card.model';
import {Balance} from '../../state/balance/balance.model';
import {Subscription} from 'rxjs';
import {DateTime} from 'luxon';

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
    this.accountQuery.selectLoading().subscribe(r => this.loadingAccount = r);
    this.balanceQuery.selectLoading().subscribe(r => this.loadingBalance = r);
    this.cardQuery.selectLoading().subscribe(r => this.loadingCard = r);
    this.releaseQuery.selectLoading().subscribe(r => this.loadingRelease = r);
    this.invoiceQuery.selectLoading().subscribe(r => this.loadingInvoice = r);

    // tslint:disable-next-line:variable-name
    let card_exists = true;
    // Getting the actual date to select the balance of the actual month
    // It needs to be formatted to YYYY-MM
    const actualDate = new Date();
    const firstDayOfMonth = new Date(actualDate.getFullYear(), actualDate.getMonth(), 1);
    const date = formatDate(firstDayOfMonth.toString(), 'YYYY-MM-dd', 'en-US');

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
        this.balanceQuery.selectEntity(({date_reference}) => date_reference === date).subscribe(
          b => this.balancesStore.setActive(b.id)
        );
      }
    );

    // Get account cards
    this.cardSubscription = this.cardService.get().subscribe(
      () => {
        this.cardQuery.selectFirst().subscribe(
          c => c ? this.cardStore.setActive(c.id) : card_exists = false
        );
      }
    );

    this.releaseSubscription = this.releaseService.get().subscribe(
      () => this.accountService.totalAvailable()
    );

    this.balanceQuerySubscription = this.balanceQuery.selectActive().subscribe(r => {
      this.active_balance = r;
    });

    if (card_exists) {
      this.cardQuerySubscription = this.cardQuery.selectActive().subscribe(r => {
        this.active_card = r;

        if (this.active_card && this.active_balance) {
          // tslint:disable-next-line:variable-name
          const balance_pay_date = DateTime.fromSQL(this.active_balance.date_reference);

          // tslint:disable-next-line:variable-name
          const card_pay_date = DateTime.fromSQL(this.active_card.pay_date);

          // tslint:disable-next-line:variable-name
          const pay_date = new Date(balance_pay_date.year,
            balance_pay_date.month,
            card_pay_date.day);

          // tslint:disable-next-line:variable-name
          const invoice_date_reference = formatDate(pay_date, 'YYYY-MM-dd', 'en-US');

          // Get card invoice
          this.invoiceSubscription = this.invoiceService.getCardInvoice().subscribe(
            (invoice) => {
              this.invoiceQuery.selectEntity(({card_id}) => card_id === this.active_card.id,
                ({date_reference}) => date_reference === invoice_date_reference.toString()).subscribe(
                riq => {
                  this.invoiceStore.setActive(riq[0].id);
                }
              );
            }
          );
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.balanceQuerySubscription.unsubscribe();
    this.cardQuerySubscription.unsubscribe();
    this.accountSubscription.unsubscribe();
    this.cardSubscription.unsubscribe();
    this.balanceSubscription.unsubscribe();
    this.invoiceSubscription.unsubscribe();
    this.releaseSubscription.unsubscribe();
  }

}
