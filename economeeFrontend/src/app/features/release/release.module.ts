import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from "@angular/forms";

import {ReleaseCreateComponent} from "./release-create/release-create.component";
import {ReleaseListComponent} from "./release-list/release-list.component";
import {ReleaseComponent} from './release/release.component';

import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzListModule} from 'ng-zorro-antd/list';
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzModalModule} from "ng-zorro-antd/modal";
import {ReleaseEditComponent} from "./release-edit/release-edit.component";
import {ScrollingModule} from "@angular/cdk/scrolling";
import {NzPageHeaderModule} from "ng-zorro-antd/page-header";
import {NzTabsModule} from "ng-zorro-antd/tabs";
import {ReleaseCategoriesComponent} from "./release-categories/release-categories.component";
import {SharedModule} from "../../shared/shared.module";
import {NzLayoutModule} from "ng-zorro-antd/layout";
import {NzFormModule} from "ng-zorro-antd/form";


@NgModule({
  declarations: [
    ReleaseCreateComponent,
    ReleaseListComponent,
    ReleaseEditComponent,
    ReleaseComponent,
    ReleaseCategoriesComponent
  ],
  imports: [
    ScrollingModule,
    NzListModule,
    NzGridModule,
    NzIconModule,
    NzButtonModule,
    CommonModule,
    SharedModule,
    NzModalModule,
    ReactiveFormsModule,
    NzInputModule,
    NzPageHeaderModule,
    NzTabsModule,
    NzLayoutModule,
    NzFormModule

  ],
  providers: [],
  exports: [
    ReleaseListComponent,
    ReleaseCreateComponent,
    ReleaseComponent,
    ReleaseCategoriesComponent
  ],
  bootstrap: []
})
export class ReleaseModule {

}
