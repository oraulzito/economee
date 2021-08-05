import {NgModule} from '@angular/core';

import { LandpageRoutingModule } from './landpage-routing.module';
import { LandpageComponent } from './landpage.component';
import {NzCardModule} from "ng-zorro-antd/card";
import {NzTabsModule} from "ng-zorro-antd/tabs";


@NgModule({
  imports: [
    LandpageRoutingModule,
    NzCardModule,
    NzTabsModule
  ],
  declarations: [
    LandpageComponent
  ],
  exports: []
})
export class LandpageModule {
}
