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

@Component({
  selector: 'app-release-list',
  templateUrl: './release-list.component.html',
  styleUrls: ['./release-list.component.less']
})
export class ReleaseListComponent implements OnInit {
  @Input()
  releaseType: number;

  card_name: Observable<string | ''>;
  card: Observable<getEntityType<CardState> | ''>;
  cards: Observable<getEntityType<CardState>[]>;
  releases: Observable<getEntityType<ReleaseState>[]>;
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
    this.isPaidForm = this.fb.group({
      is_paid: new FormControl()
    });

    this.releaseQuery.selectLoading().subscribe(
      l => this.releasesLoading = l
    );

    this.queryReleases(this.releaseType);
    this.card = this.cardQuery.activeCard$;
    this.card_name = this.cardQuery.activeCardName$;
    this.cards = this.cardQuery.allCards$;
  }

  changeActiveCard(id) {
    this.cardService.setActiveCard(id);
    this.queryReleases(this.releaseType);
  }

  delete(id) {
    this.releaseService.remove(id).subscribe();
    this.queryReleases(this.releaseType);
  }

  pay(id, isPaid) {
    this.releaseService.pay(id, isPaid).subscribe();
    this.queryReleases(this.releaseType);
  }

  openModalRelease() {
    this.isModalVisible = !this.isModalVisible;
  }

  queryReleases(releaseType) {
    switch (releaseType) {
      case 1:
        //all debit
        this.releases = this.releaseQuery.loadReleasesDebit$;
        break;
      case 2:
        // card releases
        this.releases = this.releaseQuery.loadReleasesCard$;
        break;
      case 3:
        // debit expenses
        this.releases = this.releaseQuery.loadReleasesDebitExpense$;
        break;
      case 4:
        // debit incomes
        this.releases = this.releaseQuery.loadReleasesDebitIncome$;
        break;
    }
  }
}

