import {Component, Input, OnInit} from '@angular/core';
import {Release} from '../../../state/release/release.model';
import {CardQuery} from '../../../state/card/card.query';
import {InvoiceQuery} from '../../../state/invoice/invoice.query';
import {ReleaseQuery} from '../../../state/release/release.query';
import {BalanceQuery} from '../../../state/balance/balance.query';
import {AccountQuery} from '../../../state/account/account.query';
import {Account} from '../../../state/account/account.model';
import {Balance} from '../../../state/balance/balance.model';
import {Card} from '../../../state/card/card.model';
import {Invoice} from '../../../state/invoice/invoice.model';

@Component({
  selector: 'app-releases-panel',
  templateUrl: './releases-panel.component.html',
  styleUrls: ['./releases-panel.component.css']
})
export class ReleasesPanelComponent implements OnInit {

  @Input() title;
  releases: Release[];
  account: Account;
  balance: Balance;
  card: Card;
  invoice: Invoice;

  actionText: string;
  text: string;
  type: string;

  balanceExpensesPercentage: number;
  invoiceExpensesPercentage: number;
  balanceIncomes: number;

  hasData = true;
  loadingReleases = false;
  loadingBalance = false;
  loadingAccount = false;

  constructor(
    private cardQuery: CardQuery,
    private invoiceQuery: InvoiceQuery,
    private releaseQuery: ReleaseQuery,
    private balanceQuery: BalanceQuery,
    private accountQuery: AccountQuery,
  ) {
  }

  // tslint:disable-next-line:typedef
  ngOnInit() {
    this.accountQuery.selectLoading().subscribe(la => this.loadingAccount = la);
    this.balanceQuery.selectLoading().subscribe(lb => this.loadingBalance = lb);

    this.accountQuery.selectActive().subscribe(a => this.account = a);

    if (this.title === 'Releases') {
      // get balance releases
      this.releaseQuery.selectAll({
        filterBy: ({balance_id}) => balance_id === this.balanceQuery.getActiveId()
      }).subscribe(
        (rb) => {
          if (rb.length > 0) {
            this.releases = rb;
            this.hasData = true;
          } else {
            this.hasData = false;
            this.type = 'releases';
            this.actionText = 'Criar lançamentos';
            this.text = 'Não há lançamentos criados';
          }
        }
      );

      this.balanceQuery.selectActive().subscribe(b => {
        this.balance = b;
        if (b) {
          this.balanceExpensesPercentage = (b.total_releases_expenses * 100) / b.total_releases_incomes;
        }
      });
    }

    if (this.title === 'Card Releases') {
      // get card releases
      if (this.invoiceQuery.hasActive()) {
        this.releaseQuery.selectAll({
          filterBy: ({invoice_id}) => invoice_id === this.invoiceQuery.getActiveId()
        }).subscribe(
          (ri) => {
            if (ri.length > 0) {
              this.releases = ri;
              this.hasData = true;
            }
          });
      } else {
        this.hasData = false;
        if (!this.cardQuery.hasActive()) {
          this.type = 'card';
          this.actionText = 'Criar Cartão';
          this.text = 'Não há cartões criados em sua conta';
        } else {
          this.type = 'invoice';
          this.actionText = 'Criar lançamentos';
          this.text = 'Não há lançamentos nesta fatura do seu cartão';
        }
      }

      this.cardQuery.selectActive().subscribe(c => {
        this.card = c;
        if (c && this.invoiceQuery.hasActive()) {
          this.invoiceQuery.selectActive().subscribe(i => {
            this.invoice = i;
            this.invoiceExpensesPercentage = (c.credit * 100) / i.total_card_expenses;
          });
        }
      });
    }

    if (this.title === 'My Planning') {
      if (!this.cardQuery.hasActive() || !this.invoiceQuery.hasActive() || !this.releaseQuery.hasEntity()) {
        this.hasData = false;
        this.type = 'planning';
        this.actionText = '';
        this.text = 'Não há lançamentos criados em sua conta, gráficos serão gerados com os dados de lançamentos.';
      }
    }

    // this.releaseQuery.selectLoading().subscribe(r => {
    //   this.loadingReleases = r;
    //   if (!r) {
    //     switch (this.title) {
    //       case 'Releases':
    //
    //         break;
    //       case 'Card Releases':
    //
    //         break;
    //       case 'My Planning':
    //         // if (!this.cardQuery.hasActive() || !this.invoiceQuery.hasActive() || !this.releaseQuery.hasEntity()) {
    //         this.hasData = false;
    //         this.type = 'planning';
    //         this.actionText = '';
    //         this.text = 'Não há lançamentos criados em sua conta, gráficos serão gerados com os dados de lançamentos.';
    //         // }
    //         break;
    //     }
    //   }
    //
    // });
  }
}
