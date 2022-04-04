import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthenticationGuard} from './core/guards/authentication.guard';
import {ProfileComponent} from './features/user/profile/profile.component';
import {LoginComponent} from './features/user/login/login.component';
import {SignInComponent} from './features/user/sign-in/sign-in.component';
import {DashboardComponent} from './shared/dashboard/dashboard.component';
import {NotFoundComponent} from './shared/components/not-found/not-found.component';
import {WelcomeComponent} from "./shared/welcome/welcome.component";


const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '',
    component: WelcomeComponent,
    canActivate: [AuthenticationGuard],
    children: [
      {
        path: 'signin', // child route path
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
    canActivate: [AuthenticationGuard],
    children: [
      {
        path: 'profile', // child route path
        component: ProfileComponent, // child route component that the router renders
      },
    ]
  },
  {
    path: '**', pathMatch: 'full',
    component: NotFoundComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
