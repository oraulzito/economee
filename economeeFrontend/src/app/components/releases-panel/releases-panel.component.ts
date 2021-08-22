import {Component, Input, OnInit} from '@angular/core';
import {Release} from '../../../state/release/release.model';
import {CardQuery} from '../../../state/card/card.query';
import {InvoiceQuery} from '../../../state/invoice/invoice.query';
import {ReleaseQuery} from '../../../state/release/release.query';

@Component({
  selector: 'app-releases-panel',
  templateUrl: './releases-panel.component.html',
  styleUrls: ['./releases-panel.component.css']
})
export class ReleasesPanelComponent implements OnInit {

  @Input() title;
  @Input() data: Release[];

  actionText: string;
  text: string;
  type: string;

  hasData = true;
  loadingReleases = false;
  // @Input() sm;
  // @Input() md;
  // @Input() xl;

  constructor(
    private cardQuery: CardQuery,
    private invoiceQuery: InvoiceQuery,
    private releaseQuery: ReleaseQuery,
  ) {
  }

  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.releaseQuery.selectLoading().subscribe(r => this.loadingReleases = r);
    if (this.title !== 'My Planning') {
      if (this.data.length === 0) {
        this.hasData = false;
        switch (this.title) {
          case 'Releases':
            this.type = 'releases';
            this.actionText = 'Criar lançamentos';
            this.text = 'Não há lançamentos criados';
            break;
          case 'Card Releases':
            if (!this.cardQuery.hasActive()) {
              this.type = 'card';
              this.actionText = 'Criar Cartão';
              this.text = 'Não há cartões criados em sua conta';
            } else if (!this.invoiceQuery.hasActive()) {
              this.type = 'invoice';
              this.actionText = 'Criar lançamentos';
              this.text = 'Não há lançamentos nesta fatura do seu cartão';
            }
            break;
        }
      }
    } else if (!this.cardQuery.hasActive() && !this.invoiceQuery.hasActive()) {
      this.hasData = false;
      this.type = 'planning';
      this.actionText = '';
      this.text = 'Não há lançamentos criados em sua conta, gráficos serão gerados com os dados de lançamentos.';
    }
  }
}
