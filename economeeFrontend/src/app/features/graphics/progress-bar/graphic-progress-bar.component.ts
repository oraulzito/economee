import {Component, Input, OnInit} from '@angular/core';
import {Account} from "../../../core/state/account/account.model";
import {Balance} from "../../../core/state/balance/balance.model";
import {Card} from "../../../core/state/card/card.model";
import {Invoice} from "../../../core/state/invoice/invoice.model";
import {AccountQuery} from "../../../core/state/account/account.query";
import {BalanceQuery} from "../../../core/state/balance/balance.query";
import {CardQuery} from "../../../core/state/card/card.query";
import {InvoiceQuery} from "../../../core/state/invoice/invoice.query";


@Component({
  selector: 'app-progress-bar',
  templateUrl: './graphic-progress-bar.component.html',
  styleUrls: ['./graphic-progress-bar.component.less']
})
export class GraphicProgressBarComponent implements OnInit {

  @Input() id;
  @Input() progressTitle1?: string = '';
  @Input() progressTitle2?: string = '';
  @Input() successPercentage?: number = 0;

  account: Account;
  balance: Balance;
  card: Card;
  invoice: Invoice;

  constructor(
    private accountQuery: AccountQuery,
    private balanceQuery: BalanceQuery,
    private cardQuery: CardQuery,
    private invoiceQuery: InvoiceQuery,
  ) {
  }

  ngOnInit() {
    this.account = this.accountQuery.getActive();
    this.balance = this.balanceQuery.getActive();
    this.card = this.cardQuery.getActive();

    switch (this.id) {
      case 1:
        this.progressTitle1 = 'Total Gasto \n ' + this.account.currency.symbol + ' ' + this.balance.total_releases_expenses;
        this.progressTitle2 = 'Total recebido \n ' + this.account.currency.symbol + ' ' + this.balance.total_releases_incomes;
        break;
      case 2:
        this.progressTitle1 = 'Crédito Gasto \n ' + this.account.currency.symbol + ' ' + this.invoice.total_invoice_value;
        this.progressTitle2 = 'Crédito total \n ' + this.account.currency.symbol + ' ' + this.card.credit;
        break;
      default:
        break;
    }
  }

}
