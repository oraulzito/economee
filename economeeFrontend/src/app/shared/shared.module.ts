import {NgModule} from '@angular/core';
import {HeaderComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {PanelComponent} from './components/panel/panel.component';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {RouterModule} from '@angular/router';
import {NzAvatarModule} from 'ng-zorro-antd/avatar';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {CardComponent} from './components/card/card.component';
import {NzDropDownModule} from 'ng-zorro-antd/dropdown';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzTransitionPatchModule} from 'ng-zorro-antd/core/transition-patch/transition-patch.module';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzDatePickerModule} from 'ng-zorro-antd/date-picker';
import {CommonModule} from '@angular/common';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {FormsModule} from '@angular/forms';
import {NzFormModule} from 'ng-zorro-antd/form';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    PanelComponent,
    CardComponent,
  ],
  imports: [
    NzLayoutModule,
    NzMenuModule,
    RouterModule,
    NzAvatarModule,
    NzGridModule,
    NzDropDownModule,
    NzIconModule,
    NzTransitionPatchModule,
    NzInputModule,
    NzDatePickerModule,
    CommonModule,
    NzSelectModule,
    FormsModule,
    NzFormModule,
    NzInputModule,
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
