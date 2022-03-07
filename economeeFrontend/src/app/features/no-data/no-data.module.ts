import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NoDataComponent} from './not-data.component';
import {NzResultModule} from 'ng-zorro-antd/result';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzButtonModule} from 'ng-zorro-antd/button';

@NgModule({
  declarations: [
    NoDataComponent,
  ],
  imports: [
    CommonModule,
    NzResultModule,
    NzGridModule,
    NzButtonModule,
  ],
  providers: [],
  bootstrap: [NoDataComponent]
})
export class NoDataModule {

}
