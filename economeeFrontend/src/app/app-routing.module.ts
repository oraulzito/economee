import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthenticationGuard} from './core/guards/authentication.guard';
import {WelcomeComponent} from './features/welcome/welcome.component';
import {ProfileComponent} from './features/authentication/profile/profile.component';
import {LoginComponent} from './features/authentication/login/login.component';
import {SignInComponent} from './features/authentication/sign-in/sign-in.component';
import {DashboardComponent} from './features/dashboard/dashboard.component';


const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent,
    canActivate: [AuthenticationGuard],
    children: [
      {
        path: 'signIn', // child route path
        component: SignInComponent, // child route component that the router renders
      },
      {
        path: 'login', // child route path
        component: LoginComponent, // child route component that the router renders
      },
    ]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    // canActivate: [AuthenticationGuard],
    children: [
      {
        path: 'profile', // child route path
        component: ProfileComponent, // child route component that the router renders
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
