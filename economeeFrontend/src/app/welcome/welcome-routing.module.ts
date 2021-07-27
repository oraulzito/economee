import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {SignupComponent} from './signup/signup.component';
import {ForgetPasswordComponent} from './forget-password/forget-password.component';

const routes: Routes = [
  // TODO in sprint 4
  // {path: '', component: LandpageComponent},
  {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {path: 'cadastro', component: SignupComponent},
  // TODO in sprint 4
  {path: 'esqueciasenha', component: ForgetPasswordComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WelcomeRoutingModule {
}
