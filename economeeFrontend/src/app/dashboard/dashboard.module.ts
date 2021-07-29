import { NgModule } from '@angular/core';

import { DashboardRoutingModule } from './dashboard-routing.module';

import { DashboardComponent } from './dashboard.component';
import {HeaderComponent} from "./dashboard-desktop/header/header.component";
import {ReleasesCardComponent} from "../components/releases-card/releases-card.component";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzGridModule} from "ng-zorro-antd/grid";


@NgModule({
  imports: [DashboardRoutingModule, NzCardModule, NzGridModule],
  declarations: [DashboardComponent, HeaderComponent, ReleasesCardComponent],
  exports: [DashboardComponent]
})
export class DashboardModule { }
