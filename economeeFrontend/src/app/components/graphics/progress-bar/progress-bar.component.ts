import {Component, Input, OnInit} from '@angular/core';
import {Card} from "../../../../state/card/card.model";
import {Invoice} from "../../../../state/invoice/invoice.model";
import {Balance} from "../../../../state/balance/balance.model";
import {Account} from "../../../../state/account/account.model";
import {AccountQuery} from "../../../../state/account/account.query";
import {BalanceQuery} from "../../../../state/balance/balance.query";
import {CardQuery} from "../../../../state/card/card.query";
import {InvoiceQuery} from "../../../../state/invoice/invoice.query";

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css']
})
export class ProgressBarComponent implements OnInit {

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
    this.accountQuery.selectActive().subscribe(a => {
      if (a) {
        this.account = a;
        switch (this.id) {
          case 1:
            this.progressTitle1 = 'Total Gasto \n ' + this.account.currency.symbol + ' ' + this.balance.total_releases_expenses;
            this.progressTitle2 = 'Total recebido \n ' + this.account.currency.symbol + ' ' + this.balance.total_releases_incomes;
            console.log(this.progressTitle1);
            console.log(this.progressTitle2);
            break;
          case 2:
            this.progressTitle1 = 'Crédito Gasto \n ' + this.account.currency.symbol + ' ' + this.invoice.total_card_expenses;
            this.progressTitle2 = 'Crédito total \n ' + this.account.currency.symbol + ' ' + this.card.credit;
            break;
          default:
            break;
        }

      }
    });
  }

}
