import {Component, OnDestroy, OnInit} from '@angular/core';
import {ReleaseQuery} from '../../../state/release/release.query';
import {InvoiceQuery} from '../../../state/invoice/invoice.query';
import {BalanceQuery} from '../../../state/balance/balance.query';
import {Release} from '../../../state/release/release.model';
import {AccountService} from "../../../state/account/account.service";
import {BalanceService} from "../../../state/balance/balance.service";
import {CardService} from "../../../state/card/card.service";
import {ReleaseService} from "../../../state/release/release.service";
import {ReleaseCategoryService} from "../../../state/release-category/release-category.service";
import {InvoiceService} from "../../../state/invoice/invoice.service";
import {AccountQuery} from "../../../state/account/account.query";
import {CardQuery} from "../../../state/card/card.query";
import {AccountStore} from "../../../state/account/account.store";
import {BalanceState, BalanceStore} from "../../../state/balance/balance.store";
import {InvoiceStore} from "../../../state/invoice/invoice.store";
import {CardStore} from "../../../state/card/card.store";
import {Balance} from "../../../state/balance/balance.model";
import {Card} from "../../../state/card/card.model";
import {getEntityType} from "@datorama/akita";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-dashboard-desktop',
  templateUrl: './dashboard-desktop.component.html',
  styleUrls: ['./dashboard-desktop.component.css']
})
export class DashboardDesktopComponent implements OnInit, OnDestroy {
  balances: getEntityType<BalanceState>;
  // tslint:disable-next-line:variable-name
  active_balance: Balance;
  // tslint:disable-next-line:variable-name
  active_card: Card;

  balanceReleases: Release[] = [];
  cardReleases: Release[] = [];

  loadingReleases = false;
  loadingBalance = false;
  loadingCard = false;
  loadingRelease = false;
  loadingInvoice = false;

  balanceSubscription = new Subscription();
  invoiceSubscription = new Subscription();
  cardSubscription = new Subscription();
  releaseSubscription = new Subscription();
  releaseCategorySubscription = new Subscription();


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
    private cardStore: CardStore
  ) {
  }

  ngOnInit(): void {

  }

  ngOnDestroy() {
    this.cardSubscription.unsubscribe();
    this.balanceSubscription.unsubscribe();
    this.invoiceSubscription.unsubscribe();
    this.releaseSubscription.unsubscribe();
    this.releaseCategorySubscription.unsubscribe();
  }

}
