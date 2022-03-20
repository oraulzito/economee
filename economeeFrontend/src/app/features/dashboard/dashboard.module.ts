import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DashboardComponent} from './dashboard.component';
import {DashboardDesktopComponent} from './dashboard-desktop/dashboard-desktop.component';
import {DashboardMobileComponent} from './dashboard-mobile/dashboard-mobile.component';
import {SharedModule} from '../../shared/shared.module';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzListModule} from 'ng-zorro-antd/list';
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzWaveModule} from "ng-zorro-antd/core/wave";
import {NzButtonModule} from "ng-zorro-antd/button";

import {NzStatisticModule} from "ng-zorro-antd/statistic";
import {ReleaseModule} from "../release/release.module";
import {ChartsModule} from "../charts/charts.module";
import {MoneyPanelComponent} from "../charts/money-panel/money-panel.component";

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardDesktopComponent,
    DashboardMobileComponent,
    MoneyPanelComponent,
  ],
  imports: [
    CommonModule,
    NzGridModule,
    NzListModule,
    NzIconModule,
    NzWaveModule,
    NzButtonModule,
    SharedModule,
    ChartsModule,
    NzStatisticModule,
    ReleaseModule
  ],
  providers: [],
  bootstrap: [DashboardComponent]
})
export class DashboardModule {

}
