import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DashboardComponent} from './dashboard.component';
import {DashboardDesktopComponent} from './dashboard-desktop/dashboard-desktop.component';
import {DashboardMobileComponent} from './dashboard-mobile/dashboard-mobile.component';
import {SharedModule} from "../../shared/shared.module";
import {NzGridModule} from "ng-zorro-antd/grid";

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardDesktopComponent,
    DashboardMobileComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NzGridModule,
  ],
  providers: [],
  bootstrap: [DashboardComponent]
})
export class DashboardModule {

}
