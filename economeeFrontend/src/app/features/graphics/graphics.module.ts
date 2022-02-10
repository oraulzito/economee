import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GraphicPizzaComponent} from "./pizza/graphic-pizza.component";
import {GraphicTimelineComponent} from "./timeline/graphic-timeline.component";
import {GraphicProgressBarComponent} from "./progress-bar/graphic-progress-bar.component";
import {NzProgressModule} from "ng-zorro-antd/progress";
import {NzGridModule} from "ng-zorro-antd/grid";
import {StatisticAccountGraphicComponent} from './statistic-account-graphic/statistic-account-graphic.component';
import {NzStatisticModule} from "ng-zorro-antd/statistic";
import {NzIconModule} from "ng-zorro-antd/icon";

@NgModule({
  declarations: [
    GraphicPizzaComponent,
    GraphicTimelineComponent,
    GraphicProgressBarComponent,
    StatisticAccountGraphicComponent,
  ],
  imports: [
    CommonModule,
    NzProgressModule,
    NzGridModule,
    NzStatisticModule,
    NzIconModule,
  ],
  providers: [],
  exports: [
    GraphicPizzaComponent,
    GraphicTimelineComponent,
    GraphicProgressBarComponent,
    StatisticAccountGraphicComponent
  ],
  bootstrap: []
})
export class GraphicsModule {

}
