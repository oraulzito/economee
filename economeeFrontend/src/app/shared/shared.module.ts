import {NgModule} from '@angular/core';

import {HeaderComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component';
import {CardComponent} from './components/card/card.component';
import {FormComponent} from './components/form/form.component';
import {NotFoundComponent} from "./components/not-found/not-found.component";
import {NoDataComponent} from "./components/no-data/no-data.component";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzDropDownModule} from "ng-zorro-antd/dropdown";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {NzDatePickerModule} from "ng-zorro-antd/date-picker";
import {NzPageHeaderModule} from "ng-zorro-antd/page-header";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzFormModule} from "ng-zorro-antd/form";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzTypographyModule} from "ng-zorro-antd/typography";
import {NzResultModule} from "ng-zorro-antd/result";
import {BrowserModule} from "@angular/platform-browser";

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    CardComponent,
    FormComponent,
    NotFoundComponent,
    NoDataComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    NzGridModule,
    NzDropDownModule,
    NzAvatarModule,
    NzDatePickerModule,
    NzPageHeaderModule,
    NzIconModule,
    NzButtonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzTypographyModule,
    NzResultModule,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    CardComponent,
    FormComponent,
    NotFoundComponent,
    NoDataComponent,
  ],
  providers: [],
  bootstrap: []
})
export class SharedModule {

}
