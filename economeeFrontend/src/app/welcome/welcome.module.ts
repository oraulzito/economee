import {NgModule} from '@angular/core';

import {WelcomeRoutingModule} from './welcome-routing.module';
import {SignupComponent} from './signup/signup.component';
import {LoginComponent} from './login/login.component';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NzCardModule} from 'ng-zorro-antd/card';
import {NzCheckboxModule} from 'ng-zorro-antd/checkbox';
import {NzSpaceModule} from 'ng-zorro-antd/space';
import {ForgetPasswordComponent} from './forget-password/forget-password.component';
import {CommonModule} from '@angular/common';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzIconModule} from "ng-zorro-antd/icon";

@NgModule({
    imports: [
        WelcomeRoutingModule,
        NzInputModule,
        NzFormModule,
        NzLayoutModule,
        NzButtonModule,
        NzCardModule,
        FormsModule,
        NzCheckboxModule,
        ReactiveFormsModule,
        NzSpaceModule,
        NzSelectModule,
        CommonModule,
        NzIconModule
    ],
  declarations: [
    SignupComponent,
    LoginComponent,
    ForgetPasswordComponent,
  ],
  exports: []
})

export class WelcomeModule {
}
