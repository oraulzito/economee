import {Component, OnInit} from '@angular/core';
import {CategoryChartService} from "../../../core/state/charts/category/category-chart.service";
import {CategoryChartQuery} from "../../../core/state/charts/category/category-chart-query.service";
import {BalanceQuery} from "../../../core/state/balance/balance.query";
import {AccountQuery} from "../../../core/state/account/account.query";

@Component({
  selector: 'app-pizza-chart',
  templateUrl: './pizza-chart.component.html',
  styleUrls: ['./pizza-chart.component.less']
})
export class PizzaChartComponent implements OnInit {
  view: any[] = [350, 250];
  data: any[] = [];
  legendTitle: string;
  legend: boolean;
  gradient: boolean;

  constructor(
    private categoryChartsService: CategoryChartService,
    private accountQuery: AccountQuery,
    private balanceQuery: BalanceQuery,
    private categoryChartsQuery: CategoryChartQuery
  ) {
  }

  ngOnInit() {
    this.accountQuery.selectActive().subscribe(a => {
      if (a) {
        this.balanceQuery.selectActive().subscribe(b => {
          if (b) {
            this.categoryChartsService.getCategoryChart(b.id).subscribe(
              () => this.constructChart()
            );
          }
        });
      }
    });
  }

  constructChart() {
    this.categoryChartsQuery.selectAll().subscribe(
      (values) => {
        if (values) {
          this.data = [];
          values.forEach(value => {
            this.data.push({
              'name': value.name,
              'value': value.total
            })
          });
          this.data = [...this.data];
        }
      }
    );

    this.legendTitle = "Gastos por categoria";
    this.legend = true;
    this.gradient = true;

  }
}
