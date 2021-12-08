import {NgModule} from '@angular/core';
import {WelcomeComponent} from './welcome.component';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {NzGridModule} from 'ng-zorro-antd/grid';

@NgModule({
  declarations: [
    WelcomeComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NzGridModule
  ],
  providers: [],
  bootstrap: [
    WelcomeComponent
  ]
})
export class WelcomeModule {

}
