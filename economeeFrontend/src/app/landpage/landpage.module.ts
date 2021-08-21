import {NgModule} from '@angular/core';

import {LandpageRoutingModule} from './landpage-routing.module';
import {LandpageComponent} from './landpage.component';
import {NzCardModule} from 'ng-zorro-antd/card';
import {NzTabsModule} from 'ng-zorro-antd/tabs';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {CommonModule} from '@angular/common';
import {NzTypographyModule} from 'ng-zorro-antd/typography';

@NgModule({
  imports: [
    LandpageRoutingModule,
    NzCardModule,
    NzTabsModule,
    NzButtonModule,
    CommonModule,
    NzTypographyModule
  ],
  declarations: [
    LandpageComponent
  ],
  exports: []
})
export class LandpageModule {
}
