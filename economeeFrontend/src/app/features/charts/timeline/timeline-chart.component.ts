import {Component, OnInit, ViewChild} from '@angular/core';
import {AccountQuery} from "../../../core/state/account/account.query";
import {TimelineChartService} from "../../../core/state/charts/timeline/timeline-chart.service";
import {TimelineChartQuery} from "../../../core/state/charts/timeline/timeline-chart-query.service";
import {ChartConfiguration, ChartData, ChartType} from "chart.js";
import {BaseChartDirective} from "ng2-charts";

@Component({
  selector: 'app-timeline-chart',
  templateUrl: './timeline-chart.component.html',
  styleUrls: ['./timeline-chart.component.less']
})
export class TimelineChartComponent implements OnInit {

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 10
      }
    },
    plugins: {
      legend: {
        display: true,
      },
    }
  };

  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'>;

  private labels = [];
  private valueIncomes = [];
  private valueExpenses = [];

  constructor(
    private timelineService: TimelineChartService,
    private timelineQuery: TimelineChartQuery,
    private accountQuery: AccountQuery,
  ) {
    this.accountQuery.selectActive().subscribe(
      a => {
        if (a)
          this.timelineService.get().subscribe(
            () => this.constructChartData()
          )
      }
    );
  }

  ngOnInit() {
  }

  constructChartData() {
    this.timelineQuery.selectAll({
      sortBy: 'date_reference',
    }).subscribe(
      (values) => {
        if (values) {
          this.valueIncomes = [];
          this.valueExpenses = [];
          this.labels = [];
          values.forEach(value => {
            this.labels.push(new Date(value.date_reference).toLocaleString('PT-br', {month: 'short'}) + '/' + new Date(value.date_reference).getFullYear());
            this.valueIncomes.push(value.total_incomes);
            this.valueExpenses.push(value.total_expenses);
          });
        }
      });

    this.barChartData = {
      labels: [...this.labels],
      datasets: [
        {data: [...this.valueExpenses], label: 'Gastos'},
        {data: [...this.valueIncomes], label: 'Ganhos'}
      ]
    }
  }

}
