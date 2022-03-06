import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzListModule} from 'ng-zorro-antd/list';
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzWaveModule} from "ng-zorro-antd/core/wave";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzStatisticModule} from "ng-zorro-antd/statistic";

import {ReleaseModalComponent} from "./release-modal/release-modal.component";
import {ReleaseListComponent} from "./release-list/release-list.component";
import {SharedModule} from "../../shared/shared.module";
import {NzSpinModule} from "ng-zorro-antd/spin";
import {NzSelectModule} from "ng-zorro-antd/select";
import {ReactiveFormsModule} from "@angular/forms";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzDropDownModule} from "ng-zorro-antd/dropdown";
import {NzModalModule} from "ng-zorro-antd/modal";
import {NzInputNumberModule} from "ng-zorro-antd/input-number";
import {NzDividerModule} from "ng-zorro-antd/divider";
import {NzDatePickerModule} from "ng-zorro-antd/date-picker";

@NgModule({
  declarations: [
    ReleaseModalComponent,
    ReleaseListComponent,
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
    NzDatePickerModule
  ],
  providers: [],
  exports: [
    ReleaseListComponent
  ],
  bootstrap: []
})
export class ReleaseModule {

}
