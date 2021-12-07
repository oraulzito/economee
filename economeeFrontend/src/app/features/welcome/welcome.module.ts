import {NgModule} from '@angular/core';
import {WelcomeComponent} from './welcome.component';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  declarations: [
    WelcomeComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [
    WelcomeComponent
  ]
})
export class WelcomeModule {

}
