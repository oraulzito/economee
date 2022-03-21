import {Component, Input, OnInit} from '@angular/core';
import {ReleaseQuery} from '../../../core/state/release/release.query';
import {BalanceQuery} from "../../../core/state/balance/balance.query";
import {CardQuery} from "../../../core/state/card/card.query";
import {CardService} from "../../../core/state/card/card.service";
import {InvoiceQuery} from "../../../core/state/invoice/invoice.query";
import {ReleaseService} from "../../../core/state/release/release.service";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {getEntityType} from "@datorama/akita";
import {ReleaseState} from "../../../core/state/release/release.store";
import {Observable} from "rxjs";
import {CardState} from "../../../core/state/card/card.store";
import {Release} from "../../../core/state/release/release.model";

@Component({
  selector: 'app-release-list',
  templateUrl: './release-list.component.html',
  styleUrls: ['./release-list.component.less']
})
export class ReleaseListComponent implements OnInit {
  @Input()
  releaseType: number;

  card_name: string;
  card: getEntityType<CardState>;
  cards: getEntityType<CardState>[];
  releases: getEntityType<ReleaseState>[];
  release: Release;
  releasesLoading: boolean;
  isCreationModalVisible = false;
  isEditModalVisible = false;
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
    this.isPaidForm = this.fb.group({
      is_paid: new FormControl()
    });

    this.releaseQuery.selectLoading().subscribe(
      l => this.releasesLoading = l
    );

    this.queryReleases(this.releaseType);
    this.cardQuery.activeCard$.subscribe(
      r => this.card = r
    );
    this.cardQuery.activeCardName$.subscribe(
      r => this.card_name = r
    );
    this.cardQuery.allCards$.subscribe(
      r => this.cards = r
    );
  }

  changeActiveCard(id) {
    this.cardService.setActiveCard(id);
    this.queryReleases(this.releaseType);
  }

  create() {
    this.isCreationModalVisible = !this.isCreationModalVisible;
  }

  edit(id) {
    this.release = this.releaseQuery.getEntity(id);
    this.isEditModalVisible = !this.isEditModalVisible;
  }

  delete(id) {
    this.releaseService.remove(id).subscribe();
    this.queryReleases(this.releaseType);
  }

  pay(id) {
    this.releaseService.pay(id).subscribe();
    this.queryReleases(this.releaseType);
  }

  queryReleases(releaseType) {
    switch (releaseType) {
      case 1:
        //all debit
        this.releaseQuery.loadReleasesDebit$.subscribe(
          r => this.releases = r
        );
        break;
      case 2:
        // card releases
        this.releaseQuery.loadReleasesCard$.subscribe(
          r => this.releases = r
        );
        break;
      case 3:
        // debit expenses
        this.releaseQuery.loadReleasesDebitExpense$.subscribe(
          r => this.releases = r
        );
        break;
      case 4:
        // debit incomes
        this.releaseQuery.loadReleasesDebitIncome$.subscribe(
          r => this.releases = r
        );
        break;
    }
  }
}

