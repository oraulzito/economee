import {NgModule} from '@angular/core';
import {LoginComponent} from './login/login.component';
import {ProfileComponent} from './profile/profile.component';
import {SignInComponent} from './sign-in/sign-in.component';
import {SharedModule} from "../../shared/shared.module";
import {NzIconModule} from "ng-zorro-antd/icon";
import {CommonModule} from "@angular/common";
import {NzButtonModule} from "ng-zorro-antd/button";

@NgModule({
  declarations: [
    LoginComponent,
    ProfileComponent,
    SignInComponent
  ],
  imports: [
    SharedModule,
    NzIconModule,
    CommonModule,
    NzButtonModule
  ],
  providers: [],
  bootstrap: []
})
export class AuthenticationModule {

}
