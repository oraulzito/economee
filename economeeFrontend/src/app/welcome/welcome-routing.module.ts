import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LandpageComponent} from './landpage/landpage.component';
import {LoginComponent} from './login/login.component';
import {SignupComponent} from './signup/signup.component';

const routes: Routes = [
  // TODO in sprint 4
  // {path: '', component: LandpageComponent},
  {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WelcomeRoutingModule {
}
