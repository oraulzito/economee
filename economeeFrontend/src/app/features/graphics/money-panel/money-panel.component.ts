import {Component, Input, OnInit} from '@angular/core';
import {AccountQuery} from "../../../core/state/account/account.query";
import {Observable} from "rxjs";
import {BalanceQuery} from "../../../core/state/balance/balance.query";

@Component({
  selector: 'app-statistic-money-panel',
  templateUrl: './money-panel.component.html',
  styleUrls: ['./money-panel.component.less']
})
export class MoneyPanelComponent implements OnInit {
  @Input()
  id: number;

  @Input()
  value: number;

  data: { value?: Observable<number> | number; color: string; icon: string; title: string; suffix: string; prefix?: 'R$' };

  constructor(
    private accountQuery: AccountQuery,
    private balanceQuery: BalanceQuery
  ) {
  }

  ngOnInit(): void {
    switch (this.id) {
      case 1:
        this.data = {
          title: 'Valor recebido no mês',
          icon: 'arrow-up',
          color: '#3F8600',
          value: this.value,
          suffix: '',
        };
        this.balanceQuery.totalIncomes$.subscribe(r => this.data.value = r);
        break;
      case 2:
        this.data = {
          title: 'Valor gasto no mês',
          icon: 'arrow-down',
          color: '#CF1322',
          value: this.value,
          suffix: '',
        };
        this.balanceQuery.totalExpenses$.subscribe(r => this.data.value = r);
        break;
      case 3:
        this.data = {
          title: 'Sobrará com todos os gastos pagos',
          icon: '',
          color: '#3F8600',
          value: this.value,
          suffix: '',
        };
        this.balanceQuery.willRemainWithPaid$.subscribe(r => this.data.value = r);
        break;
      case 4:
        this.data = {
          title: 'Sobrará com gastos ainda não pagos',
          icon: '',
          color: '#CF1322',
          value: this.value,
          suffix: '',
        };
        this.balanceQuery.willRemainWithoutPaid$.subscribe(r => this.data.value = r);
        break;
      case 5:
        this.data = {
          title: 'Disponível',
          icon: '',
          color: '#3F8600',
          suffix: '',
        };
        this.accountQuery.totalAvailable$.subscribe(r => this.data.value = r);
        break;
    }
  }

}
