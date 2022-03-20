import {Component, OnInit} from '@angular/core';
import {AccountQuery} from "../../../core/state/account/account.query";
import {TimelineChartService} from "../../../core/state/charts/timeline/timeline-chart.service";
import {TimelineChartQuery} from "../../../core/state/charts/timeline/timeline-chart-query.service";


@Component({
  selector: 'app-timeline-chart',
  templateUrl: './timeline-chart.component.html',
  styleUrls: ['./timeline-chart.component.less']
})
export class TimelineChartComponent implements OnInit {

  view: any[] = [700, 400];
  data: any[] = [];
  legendTitle: string;
  xAxisLabel: string;
  yAxisLabel: string;
  legend: boolean;
  showXAxisLabel: boolean;
  showYAxisLabel: boolean;
  xAxis: boolean;
  yAxis: boolean;
  gradient: boolean;

  constructor(
    private timelineService: TimelineChartService,
    private timelineQuery: TimelineChartQuery,
    private accountQuery: AccountQuery,
  ) {
    this.accountQuery.selectActive().subscribe(
      a => {
        if (a)
          this.timelineService.get().subscribe(
            () => this.constructChart()
          )
      }
    );
  }

  ngOnInit() {

  }

  constructChart() {
    this.timelineQuery.selectAll().subscribe(
      (values) => {
        if (values) {
          values.forEach(value => {
            let series = [{
              'name': 'Gastos',
              'value': value.total_expenses
            }, {
              'name': 'Ganhos',
              'value': value.total_incomes
            }];

            this.data.push(
              {
                'name': new Date(value.date_reference).toLocaleString('PT-br', {month: 'short'}) + '/' + new Date(value.date_reference).getFullYear(),
                'series': series
              }
            )
          });
          this.data = [...this.data];
        }
      }
    );

    this.legendTitle = "Linha do tempo de gastos e ganhos";
    this.xAxisLabel = "Mês";
    this.yAxisLabel = "Valor Gasto";
    this.legend = true;
    this.showXAxisLabel = true;
    this.showYAxisLabel = true;
    this.xAxis = true;
    this.yAxis = true;
    this.gradient = true;

  }

}
