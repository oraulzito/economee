import {Component, Input, OnInit} from '@angular/core';
import {AccountService} from "../../../core/state/account/account.service";
import {AccountQuery} from "../../../core/state/account/account.query";
import {BalanceQuery} from "../../../core/state/balance/balance.query";
import {CardQuery} from "../../../core/state/card/card.query";

@Component({
  selector: 'app-statistic-account-graphic',
  templateUrl: './statistic-account-graphic.component.html',
  styleUrls: ['./statistic-account-graphic.component.less']
})
export class StatisticAccountGraphicComponent implements OnInit {
  @Input()
  id: number;

  data: { value?: number; color: string; icon: string; title: string; suffix: string };

  constructor(
    private accountService: AccountService,
    private balanceQuery: BalanceQuery,
    private cardQuery: CardQuery,
    private accountQuery: AccountQuery
  ) {
  }

  ngOnInit(): void {
    switch (this.id) {
      case 1:
        this.accountQuery.select('total_available').subscribe(
          r => {
            this.data.value = r
          }
        );
        this.data = {
          title: 'Valor recebido no mês',
          icon: 'arrow-up',
          color: '#3F8600',
          suffix: '',
        };
        break;
      case 2:
        this.balanceQuery.select('total_releases_expenses').subscribe(
          r => {
            this.data.value = r
          }
        );
        this.data = {
          title: 'Valor gasto no mês',
          icon: 'arrow-down',
          color: '#CF1322',
          suffix: '',
        };
        break;
      case 3:
        this.balanceQuery.select('total_releases_incomes').subscribe(
          r => {
            this.data.value = r
          }
        );
        this.data = {
          title: 'Sobrará com gastos pagos',
          icon: 'check-circle',
          color: '#3F8600',
          suffix: '',
        };
        break;
      case 4:
        this.data = {
          title: 'Sobrará com gastos ainda não pagos',
          icon: 'close-circle',
          color: '#CF1322',
          suffix: '',
        };
        break;
      case 5:
        this.data = {
          title: 'Disponível',
          icon: 'dollar',
          color: '#3F8600',
          suffix: '',
        };
        break;
    }
  }

}
