import { NgModule } from '@angular/core';

import { DashboardRoutingModule } from './dashboard-routing.module';

import { DashboardComponent } from './dashboard.component';
import {HeaderComponent} from "./dashboard-desktop/header/header.component";
import {ReleasesCardComponent} from "../components/releases-card/releases-card.component";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzDatePickerModule} from "ng-zorro-antd/date-picker";


@NgModule({
    imports: [DashboardRoutingModule, NzCardModule, NzGridModule, NzDatePickerModule],
  declarations: [DashboardComponent, HeaderComponent, ReleasesCardComponent],
  exports: [DashboardComponent]
})
export class DashboardModule { }
