import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DashboardComponent} from './dashboard.component';
import {DashboardDesktopComponent} from './dashboard-desktop/dashboard-desktop.component';
import {DashboardMobileComponent} from './dashboard-mobile/dashboard-mobile.component';
import {SharedModule} from '../../shared/shared.module';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {ReleaseComponent} from './release/release.component';
import {NzListModule} from 'ng-zorro-antd/list';
import {NzSkeletonModule} from 'ng-zorro-antd/skeleton';
import {ScrollingModule} from "@angular/cdk/scrolling";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzWaveModule} from "ng-zorro-antd/core/wave";
import {NzButtonModule} from "ng-zorro-antd/button";
import {GraphicsModule} from "../graphics/graphics.module";
import {NzStatisticModule} from "ng-zorro-antd/statistic";

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardDesktopComponent,
    DashboardMobileComponent,
    ReleaseComponent,
  ],
    imports: [
        CommonModule,
        NzGridModule,
        NzListModule,
        NzIconModule,
        NzWaveModule,
        NzButtonModule,
        SharedModule,
        GraphicsModule,
        NzStatisticModule,
    ],
  providers: [],
  bootstrap: [DashboardComponent]
})
export class DashboardModule {

}
