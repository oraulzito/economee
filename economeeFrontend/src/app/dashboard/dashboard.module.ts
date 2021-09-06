import {NgModule} from '@angular/core';

import {DashboardRoutingModule} from './dashboard-routing.module';

import {DashboardComponent} from './dashboard.component';
import {HeaderComponent} from './dashboard-desktop/header/header.component';
import {ReleasesCardComponent} from '../components/releases-card/releases-card.component';
import {NzCardModule} from 'ng-zorro-antd/card';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzDatePickerModule} from 'ng-zorro-antd/date-picker';
import {DashboardMobileComponent} from './dashboard-mobile/dashboard-mobile.component';
import {DashboardDesktopComponent} from './dashboard-desktop/dashboard-desktop.component';
import {CommonModule} from '@angular/common';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzDropDownModule} from 'ng-zorro-antd/dropdown';
import {NoDataComponent} from '../components/no-data/no-data.component';
import {ReleasesPanelComponent} from '../components/releases-panel/releases-panel.component';
import {NzEmptyModule} from 'ng-zorro-antd/empty';
import {NzProgressModule} from 'ng-zorro-antd/progress';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzInputModule} from 'ng-zorro-antd/input';
import {ReleaseAddCardComponent} from '../components/release-add-card/release-add-card.component';
import {PlotlyModule} from 'angular-plotly.js';


@NgModule({
    imports: [
        DashboardRoutingModule,
        NzCardModule,
        NzGridModule,
        NzDatePickerModule,
        CommonModule,
        NzButtonModule,
        NzMenuModule,
        NzIconModule,
        NzDropDownModule,
        NzEmptyModule,
        NzProgressModule,
        ReactiveFormsModule,
        NzSelectModule,
        FormsModule,
        NzFormModule,
        NzInputModule,
        PlotlyModule
    ],
  declarations: [
    DashboardComponent,
    HeaderComponent,
    ReleasesCardComponent,
    DashboardMobileComponent,
    DashboardDesktopComponent,
    NoDataComponent,
    ReleasesPanelComponent,
    ReleaseAddCardComponent
  ],
  exports: [
    DashboardComponent]
})
export class DashboardModule {
}
