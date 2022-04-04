import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NotFoundComponent} from './not-found.component';
import {NzResultModule} from 'ng-zorro-antd/result';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {SharedModule} from "../../shared.module";

@NgModule({
  declarations: [
    NotFoundComponent,
  ],
  imports: [
    CommonModule,
    NzResultModule,
    NzGridModule,
    NzButtonModule,
    SharedModule,
  ],
  providers: [],
  bootstrap: [NotFoundComponent]
})
export class NotFoundModule {

}
