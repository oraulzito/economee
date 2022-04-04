import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ReleaseQuery} from '../../../core/state/release/release.query';
import {BalanceQuery} from "../../../core/state/balance/balance.query";
import {CardQuery} from "../../../core/state/card/card.query";
import {InvoiceQuery} from "../../../core/state/invoice/invoice.query";
import {ReleaseService} from "../../../core/state/release/release.service";
import {Release} from "../../../core/state/release/release.model";
import {ReleaseCategoryQuery} from "../../../core/state/release/category/release-category.query";
import {CurrencyQuery} from "../../../core/state/currency/currency.query";
import {AccountQuery} from "../../../core/state/account/account.query";
import {getEntityType} from "@datorama/akita";
import {CurrencyState} from "../../../core/state/currency/currency.store";

@Component({
  selector: 'app-release-list',
  templateUrl: './release-list.component.html',
  styleUrls: ['./release-list.component.less']
})
export class ReleaseListComponent implements OnInit {
  @Input() releases;
  @Input() listType;

  @Output() releaseEditEventEmitter = new EventEmitter<Release>();

  categories;
  releaseEdit: Release;
  releasesLoading: boolean;
  releaseQueryName: string;
  currency: number | string;
  currencies: getEntityType<CurrencyState>[];

  constructor(
    private balanceQuery: BalanceQuery,
    private cardQuery: CardQuery,
    private invoiceQuery: InvoiceQuery,
    private releaseService: ReleaseService,
    private releaseQuery: ReleaseQuery,
    private categoryQuery: ReleaseCategoryQuery,
    private currencyQuery: CurrencyQuery,
    private accountQuery: AccountQuery
  ) {
  }

  ngOnInit(): void {
    this.releaseQuery.selectLoading().subscribe(l => this.releasesLoading = l);
    this.categoryQuery.selectAll().subscribe(c => this.categories = c);
    this.accountQuery.currencySymbol$.subscribe(c => this.currency = c);
  }

  edit(id) {
    this.releaseEdit = this.releaseQuery.getEntity(id);
    this.releaseEditEventEmitter.emit(this.releaseEdit);
  }

  delete(id) {
    this.releaseService.remove(id).subscribe();
    this.releaseQuery.queryReleases(this.listType);
  }

  pay(id) {
    this.releaseService.pay(id).subscribe();
    this.releaseQuery.queryReleases(this.listType);
  }


}

