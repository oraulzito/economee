import {Component, OnInit} from '@angular/core';
import {CategoryChartService} from "../../../core/state/charts/category/category-chart.service";
import {CategoryChartQuery} from "../../../core/state/charts/category/category-chart-query.service";
import {BalanceQuery} from "../../../core/state/balance/balance.query";
import {AccountQuery} from "../../../core/state/account/account.query";
import {ChartData, ChartOptions, ChartType} from "chart.js";
import DatalabelsPlugin from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-pizza-chart',
  templateUrl: './pizza-chart.component.html',
  styleUrls: ['./pizza-chart.component.less']
})
export class PizzaChartComponent implements OnInit {
  // Pie
  pieChartOptions: ChartOptions = {
    responsive: true,
  };
  pieChartLabels = [];
  pieChartData: ChartData<'pie'>;
  pieChartType: ChartType = 'pie';
  pieChartLegend = true;
  pieChartPlugins = [DatalabelsPlugin];
  values = [];

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
          values.forEach(value => {
            this.pieChartLabels.push(value.name);
            this.values.push(value.total)
          });
          this.pieChartData = {
            labels: this.pieChartLabels,
            datasets:
              [{'data': this.values}]
          }
        }
      }
    );
  }
}
