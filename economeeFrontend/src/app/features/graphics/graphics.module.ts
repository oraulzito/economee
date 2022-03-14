import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {GraphicPizzaComponent} from "./pizza/graphic-pizza.component";
import {GraphicTimelineComponent} from "./timeline/graphic-timeline.component";
import {GraphicProgressBarComponent} from "./progress-bar/graphic-progress-bar.component";
import {MoneyPanelComponent} from "./money-panel/money-panel.component";

import {NzProgressModule} from "ng-zorro-antd/progress";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzStatisticModule} from "ng-zorro-antd/statistic";
import {NzIconModule} from "ng-zorro-antd/icon";
import {PlotlySharedModule} from "angular-plotly.js";


@NgModule({
  declarations: [
    GraphicPizzaComponent,
    GraphicTimelineComponent,
    GraphicProgressBarComponent,
    MoneyPanelComponent,
  ],
  imports: [
    CommonModule,
    NzProgressModule,
    NzGridModule,
    NzStatisticModule,
    NzIconModule,
    PlotlySharedModule,
  ],
  providers: [],
  exports: [
    GraphicPizzaComponent,
    GraphicTimelineComponent,
    GraphicProgressBarComponent,
    MoneyPanelComponent
  ],
  bootstrap: []
})
export class GraphicsModule {

}
