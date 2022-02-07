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

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardDesktopComponent,
    DashboardMobileComponent,
    ReleaseComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NzGridModule,
    NzListModule,
    NzSkeletonModule,
    ScrollingModule,
  ],
  providers: [],
  bootstrap: [DashboardComponent]
})
export class DashboardModule {

}
