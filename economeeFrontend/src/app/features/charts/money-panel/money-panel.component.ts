import {Component, Input, OnInit} from '@angular/core';
import {AccountQuery} from "../../../core/state/account/account.query";
import {Observable} from "rxjs";
import {BalanceQuery} from "../../../core/state/balance/balance.query";
import {ReleaseQuery} from "../../../core/state/release/release.query";
import {InvoiceQuery} from "../../../core/state/invoice/invoice.query";

@Component({
  selector: 'app-statistic-money-panel',
  templateUrl: './money-panel.component.html',
  styleUrls: ['./money-panel.component.less']
})
export class MoneyPanelComponent implements OnInit {
  @Input()
  id: number;

  @Input()
  value?: number;

  data: { value?: Observable<number> | number; color: string; icon: string; title: string; suffix: string; prefix?: 'R$' };
  currency: string;

  constructor(
    private accountQuery: AccountQuery,
    private balanceQuery: BalanceQuery,
    private invoiceQuery: InvoiceQuery,
    private releaseQuery: ReleaseQuery
  ) {
  }

  ngOnInit(): void {
    this.accountQuery.currencySymbol$.subscribe(c => this.currency = c);
    let balance_total = 0;
    switch (this.id) {
      case 1:
        this.data = {
          title: 'Receitas',
          icon: '',
          color: '#3F8600',
          value: this.value,
          suffix: '',
        };
        this.balanceQuery.totalIncomes$.subscribe(r => this.data.value = r);
        break;
      case 2:
        this.data = {
          title: 'Despesas',
          icon: '',
          color: '#CF1322',
          value: this.value,
          suffix: '',
        };
        this.balanceQuery.totalExpenses$.subscribe(r => this.data.value = r);
        break;
      case 3:
        this.data = {
          title: 'Balanço mensal com despesas pagas',
          icon: '',
          color: '#3F8600',
          value: 0,
          suffix: '',
        };
        this.balanceQuery.selectActive().subscribe(
          b => b ? balance_total = b.total_incomes : ""
        );

        this.releaseQuery.selectAll({
          filterBy: release => release.is_paid === false
        }).subscribe(releases => {
          let sum = 0;
          releases.forEach(release => sum = +release.installment_value);
          this.data.value = balance_total - sum;
        });
        break;
      case 4:
        this.data = {
          title: 'Balanço mensal com despesas não pagas',
          icon: '',
          color: '#CF1322',
          value: 0,
          suffix: '',
        };

        this.balanceQuery.selectActive().subscribe(
          b => b ? balance_total = b.total_incomes : ""
        );

        this.releaseQuery.selectAll({
          filterBy: release => release.is_paid === false
        }).subscribe(releases => {
          let sum = 0;
          releases.forEach(release => sum = +release.installment_value);
          this.data.value = balance_total - sum;
        });
        break;
      case 5:
        this.data = {
          title: 'Saldo atual',
          icon: '',
          color: '#3F8600',
          suffix: '',
        };
        this.accountQuery.totalAvailable$.subscribe(r => this.data.value = r);
        break;
      case 6:
        this.data = {
          title: 'Somatório das faturas',
          icon: '',
          color: '#3F8600',
          suffix: '',
        };
        this.invoiceQuery.selectAll().subscribe(r => {
          let sum = 0;
          r.forEach(release => sum = +release.total_value);
          this.data.value = sum;
        });
        break;
    }
  }

}
