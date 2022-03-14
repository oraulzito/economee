import {NgModule} from '@angular/core';

import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {NzAvatarModule} from 'ng-zorro-antd/avatar';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzDropDownModule} from 'ng-zorro-antd/dropdown';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzDatePickerModule} from 'ng-zorro-antd/date-picker';

import {HeaderComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component';
import {PanelComponent} from './components/panel/panel.component';
import {RouterModule} from '@angular/router';
import {CardComponent} from './components/card/card.component';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {GraphicsModule} from "../features/graphics/graphics.module";

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    PanelComponent,
    CardComponent,
  ],
  imports: [
    RouterModule,
    FormsModule,
    CommonModule,
    GraphicsModule,
    NzLayoutModule,
    NzMenuModule,
    NzAvatarModule,
    NzGridModule,
    NzIconModule,
    NzInputModule,
    NzSelectModule,
    NzFormModule,
    NzInputModule,
    NzDropDownModule,
    NzButtonModule,
    NzDatePickerModule,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    PanelComponent,
    CardComponent
  ],
  providers: [],
  bootstrap: []
})
export class SharedModule {

}
