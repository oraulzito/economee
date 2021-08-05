import { NgModule } from '@angular/core';

import { DashboardRoutingModule } from './dashboard-routing.module';

import { DashboardComponent } from './dashboard.component';
import {HeaderComponent} from "./dashboard-desktop/header/header.component";
import {ReleasesCardComponent} from "../components/releases-card/releases-card.component";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzDatePickerModule} from "ng-zorro-antd/date-picker";
import {DashboardMobileComponent} from "./dashboard-mobile/dashboard-mobile.component";
import {DashboardDesktopComponent} from "./dashboard-desktop/dashboard-desktop.component";
import {CommonModule} from "@angular/common";


@NgModule({
  imports: [DashboardRoutingModule, NzCardModule, NzGridModule, NzDatePickerModule, CommonModule],
  declarations: [DashboardComponent, HeaderComponent, ReleasesCardComponent, DashboardMobileComponent, DashboardDesktopComponent],
  exports: [DashboardComponent]
})
export class DashboardModule { }
