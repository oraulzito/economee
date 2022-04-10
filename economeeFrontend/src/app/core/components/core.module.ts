import {NgModule} from '@angular/core';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {DashboardDesktopComponent} from "./dashboard/dashboard-desktop/dashboard-desktop.component";
import {DashboardMobileComponent} from "./dashboard/dashboard-mobile/dashboard-mobile.component";
import {WelcomeComponent} from "./welcome/welcome.component";
import {SharedModule} from "../../shared/shared.module";
import {CommonModule} from "@angular/common";
import {NzGridModule} from "ng-zorro-antd/grid";
import {RouterModule} from "@angular/router";
import {ChartsModule} from "../../features/charts/charts.module";
import {ReleaseModule} from "../../features/release/release.module";

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardDesktopComponent,
    DashboardMobileComponent,
    WelcomeComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    NzGridModule,
    RouterModule,
    ChartsModule,
    ReleaseModule,
  ],
  exports: [
    DashboardComponent,
    DashboardDesktopComponent,
    DashboardMobileComponent,
    WelcomeComponent
  ],
  providers: [],
  bootstrap: []
})
export class CoreModule {

}
