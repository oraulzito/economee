import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';


import {NzProgressModule} from "ng-zorro-antd/progress";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzStatisticModule} from "ng-zorro-antd/statistic";
import {NzIconModule} from "ng-zorro-antd/icon";
import {BarChartModule, PieChartModule} from "@swimlane/ngx-charts";
import {PizzaChartComponent} from "./pizza/pizza-chart.component";
import {ProgressBarChartComponent} from "./progress-bar/progress-bar-chart.component";
import {TimelineChartComponent} from "./timeline/timeline-chart.component";
import {NgChartsModule} from "ng2-charts";
import {MoneyPanelComponent} from "./money-panel/money-panel.component";


@NgModule({
  declarations: [
    PizzaChartComponent,
    ProgressBarChartComponent,
    TimelineChartComponent,
    MoneyPanelComponent
  ],
  imports: [
    CommonModule,
    NzProgressModule,
    NzGridModule,
    NzStatisticModule,
    NzIconModule,
    BarChartModule,
    PieChartModule,
    NgChartsModule,
  ],
  providers: [],
  exports: [
    MoneyPanelComponent,
    PizzaChartComponent,
    ProgressBarChartComponent,
    TimelineChartComponent
  ],
  bootstrap: []
})
export class ChartsModule {

}
