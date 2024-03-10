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
import {CreditCardComponent} from "../../features/credit-card/credit-card.component";
import {NzModalModule} from "ng-zorro-antd/modal";
import {NzListModule} from "ng-zorro-antd/list";
import {ReactiveFormsModule} from "@angular/forms";
import {NzWaveModule} from "ng-zorro-antd/core/wave";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzButtonModule} from "ng-zorro-antd/button";
import {AccountComponent} from "../../features/account/account.component";
import {NzInputModule} from "ng-zorro-antd/input";

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardDesktopComponent,
    DashboardMobileComponent,
    WelcomeComponent,
    CreditCardComponent,
    AccountComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    NzGridModule,
    RouterModule,
    ChartsModule,
    ReleaseModule,
    NzModalModule,
    NzListModule,
    ReactiveFormsModule,
    NzWaveModule,
    NzFormModule,
    NzButtonModule,
    NzInputModule,
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
