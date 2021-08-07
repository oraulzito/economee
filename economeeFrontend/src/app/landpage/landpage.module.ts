import {NgModule} from '@angular/core';

import { LandpageRoutingModule } from './landpage-routing.module';
import { LandpageComponent } from './landpage.component';
import {NzCardModule} from 'ng-zorro-antd/card';
import {NzTabsModule} from 'ng-zorro-antd/tabs';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    LandpageRoutingModule,
    NzCardModule,
    NzTabsModule,
    NzButtonModule,
    CommonModule
  ],
  declarations: [
    LandpageComponent
  ],
  exports: []
})
export class LandpageModule {
}
