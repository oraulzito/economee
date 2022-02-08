import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GraphicPizzaComponent} from "./pizza/graphic-pizza.component";
import {GraphicTimelineComponent} from "./timeline/graphic-timeline.component";
import {GraphicProgressBarComponent} from "./progress-bar/graphic-progress-bar.component";
import {NzProgressModule} from "ng-zorro-antd/progress";
import {NzGridModule} from "ng-zorro-antd/grid";

@NgModule({
  declarations: [
    GraphicPizzaComponent,
    GraphicTimelineComponent,
    GraphicProgressBarComponent
  ],
  imports: [
    CommonModule,
    NzProgressModule,
    NzGridModule,
  ],
  providers: [],
  exports: [
    GraphicPizzaComponent,
    GraphicTimelineComponent,
    GraphicProgressBarComponent
  ],
  bootstrap: []
})
export class GraphicsModule {

}
