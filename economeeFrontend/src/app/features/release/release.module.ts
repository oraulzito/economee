import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from "@angular/forms";

import {ReleaseCreateComponent} from "./release-create/release-create.component";
import {ReleaseListComponent} from "./release-list/release-list.component";
import {ReleaseComponent} from './release/release.component';
import {SharedModule} from "../../shared/shared.module";

import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzListModule} from 'ng-zorro-antd/list';
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzWaveModule} from "ng-zorro-antd/core/wave";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzStatisticModule} from "ng-zorro-antd/statistic";
import {NzSpinModule} from "ng-zorro-antd/spin";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzDropDownModule} from "ng-zorro-antd/dropdown";
import {NzModalModule} from "ng-zorro-antd/modal";
import {NzInputNumberModule} from "ng-zorro-antd/input-number";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {NzDatePickerModule} from "ng-zorro-antd/date-picker";
import {ReleaseEditComponent} from "./release-edit/release-edit.component";
import {ScrollingModule} from "@angular/cdk/scrolling";
import {NzPageHeaderModule} from "ng-zorro-antd/page-header";
import {NzTabsModule} from "ng-zorro-antd/tabs";
import {NoDataComponent} from "../../shared/components/no-data/no-data.component";
import {NzResultModule} from "ng-zorro-antd/result";
import {NzTypographyModule} from "ng-zorro-antd/typography";


@NgModule({
  declarations: [
    ReleaseCreateComponent,
    ReleaseListComponent,
    ReleaseEditComponent,
    NoDataComponent,
    ReleaseComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    NzGridModule,
    NzListModule,
    NzIconModule,
    NzWaveModule,
    NzButtonModule,
    NzStatisticModule,
    NzSpinModule,
    NzSelectModule,
    ReactiveFormsModule,
    NzInputModule,
    NzDropDownModule,
    NzModalModule,
    NzInputNumberModule,
    NzDividerModule,
    NzDatePickerModule,
    ScrollingModule,
    NzPageHeaderModule,
    NzTabsModule,
    NzResultModule,
    NzTypographyModule
  ],
  providers: [],
  exports: [
    ReleaseListComponent,
    ReleaseCreateComponent,
    ReleaseComponent
  ],
  bootstrap: []
})
export class ReleaseModule {

}
