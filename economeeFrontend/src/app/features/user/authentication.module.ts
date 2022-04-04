import {NgModule} from '@angular/core';
import {LoginComponent} from './login/login.component';
import {ProfileComponent} from './profile/profile.component';
import {SignInComponent} from './sign-in/sign-in.component';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzCardModule} from 'ng-zorro-antd/card';
import {ReactiveFormsModule} from '@angular/forms';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzInputNumberModule} from "ng-zorro-antd/input-number";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";

@NgModule({
  declarations: [
    LoginComponent,
    ProfileComponent,
    SignInComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NzGridModule,
    NzButtonModule,
    NzCardModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzIconModule,
    NzSelectModule,
    NzInputNumberModule,
    NzCheckboxModule,
  ],
  providers: [],
  bootstrap: []
})
export class AuthenticationModule {

}
