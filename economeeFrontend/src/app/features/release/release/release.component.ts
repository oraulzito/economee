import {Component, Input, OnInit} from '@angular/core';
import {BalanceQuery} from "../../../core/state/balance/balance.query";
import {CardQuery} from "../../../core/state/card/card.query";
import {InvoiceQuery} from "../../../core/state/invoice/invoice.query";
import {ReleaseService} from "../../../core/state/release/release.service";
import {ReleaseQuery} from "../../../core/state/release/release.query";
import {CardService} from "../../../core/state/card/card.service";
import {getEntityType} from "@datorama/akita";
import {CardState} from "../../../core/state/card/card.store";
import {Release} from "../../../core/state/release/release.model";
import {Observable} from "rxjs";
import {ReleaseState} from "../../../core/state/release/release.store";

@Component({
  selector: 'app-release',
  templateUrl: './release.component.html',
  styleUrls: ['./release.component.less']
})
export class ReleaseComponent implements OnInit {
  @Input()
  releaseType: number;

  cards: getEntityType<CardState>[];
  cardID$;

  releaseItems: Observable<getEntityType<ReleaseState>[]>;
  releaseEditItem: Release;

  isEditModalVisible = false;
  isCreationModalVisible = false;

  listOptions = [{
    id: 1,
    name: 'Tudo',
  }, {
    id: 2,
    name: 'Despesas',
  }, {
    id: 3,
    name: 'Receitas',
  }, {
    id: 4,
    name: 'Despesas pagas',
  }, {
    id: 5,
    name: 'Despesas não pagas',
  }, {
    id: 6,
    name: 'Receitas recebidas',
  }, {
    id: 7,
    name: 'Receitas não recebidas',
  },]

  constructor(
    private balanceQuery: BalanceQuery,
    private cardQuery: CardQuery,
    private invoiceQuery: InvoiceQuery,
    private releaseService: ReleaseService,
    private releaseQuery: ReleaseQuery,
    private cardService: CardService,
  ) {
  }

  ngOnInit(): void {
    if (this.releaseType === 0) {
      this.cardQuery.allCards$.subscribe(r => this.cards = r);
      this.cardID$ = this.cardQuery.activeCardID$;
    }

    this.loadReleases(this.releaseType);
  }

  loadReleases(id) {
    if (id === 0) {
      this.invoiceQuery.selectActiveId().subscribe(
        (invoice) => {
          if (invoice)
            this.releaseItems = this.releaseQuery.queryReleases(0);
        });
    } else {
      this.releaseItems = this.releaseQuery.queryReleases(id);
    }
  }

  createRelease() {
    this.isCreationModalVisible = !this.isCreationModalVisible;
  }

  editRelease(release: Release) {
    this.releaseEditItem = release;
    this.isEditModalVisible = !this.isEditModalVisible;
  }

  changeActiveCard(id) {
    this.cardService.setActiveCard(id);
    this.releaseItems = this.releaseQuery.queryReleases(4);
  }

  changeActiveReleaseList(id) {
    this.releaseItems = this.releaseQuery.queryReleases(id);
  }
}
