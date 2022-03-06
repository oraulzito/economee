import {Component, Input, OnInit} from '@angular/core';
import {ReleaseQuery} from '../../../core/state/release/release.query';
import {Release, RELEASE_TYPE} from '../../../core/state/release/release.model';
import {BalanceQuery} from "../../../core/state/balance/balance.query";
import {CardQuery} from "../../../core/state/card/card.query";
import {Card} from "../../../core/state/card/card.model";
import {CardService} from "../../../core/state/card/card.service";
import {InvoiceQuery} from "../../../core/state/invoice/invoice.query";
import {ReleaseService} from "../../../core/state/release/release.service";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-release-list',
  templateUrl: './release-list.component.html',
  styleUrls: ['./release-list.component.less']
})
export class ReleaseListComponent implements OnInit {
  @Input()
  releaseType: number;

  card: Card;
  cards: Card[];
  releases: Release[];
  releasesLoading: boolean;
  isModalVisible = false;
  isPaidForm: FormGroup;

  constructor(
    private balanceQuery: BalanceQuery,
    private cardQuery: CardQuery,
    private invoiceQuery: InvoiceQuery,
    private releaseService: ReleaseService,
    private releaseQuery: ReleaseQuery,
    private cardService: CardService,
    private fb: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.balanceQuery.selectActive().subscribe(
      (b) => b ? this.loadReleases() : ''
    );

    this.releaseQuery.selectLoading().subscribe(
      l => this.releasesLoading = l
    );

    this.cardQuery.selectAll().subscribe(c => this.cards = c);

    this.cardQuery.selectActive().subscribe(r => this.card = r);

    this.isPaidForm = this.fb.group({
      is_paid: new FormControl()
    });
  }

  loadReleases(): void {
    this.releaseQuery.selectAll().subscribe(r => this.queryReleases(r));
  }

  changeActiveCard(id) {
    this.cardService.setActiveCard(id);
    this.loadReleases();
  }

  queryReleases(r) {
    switch (this.releaseType) {
      case 1:
        //all debit
        this.releases = r.filter(r => r.invoice_id === null)
        break;
      case 2:
        // card releases
        this.releases = r.filter(r => r.invoice_id !== null && r.invoice_id === this.invoiceQuery.getActiveId())
        break;
      case 3:
        // debit expenses
        this.releases = r.filter(r => r.type == RELEASE_TYPE.EXPENSE)
        break;
      case 4:
        // debit incomes
        this.releases = r.filter(r => r.type == RELEASE_TYPE.INCOME)
        break;
    }
  }

  delete(id) {
    this.releaseService.remove(id).subscribe();
    this.loadReleases();
  }

  pay(id, isPaid) {
    this.releaseService.pay(id, isPaid).subscribe();
    this.loadReleases();
  }

  openModalRelease() {
    this.isModalVisible = !this.isModalVisible;
  }
}

