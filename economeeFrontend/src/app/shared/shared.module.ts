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
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzTransitionPatchModule} from 'ng-zorro-antd/core/transition-patch/transition-patch.module';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {FormsModule} from '@angular/forms';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzDropDownModule} from 'ng-zorro-antd/dropdown';

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
    NzIconModule,
    NzInputModule,
    NzSelectModule,
    FormsModule,
    NzFormModule,
    NzInputModule,
    NzDropDownModule,
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
