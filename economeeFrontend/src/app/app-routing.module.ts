import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthenticationGuard} from './core/guards/authentication.guard';
import {ProfileComponent} from './features/authentication/profile/profile.component';
import {LoginComponent} from './features/authentication/login/login.component';
import {SignInComponent} from './features/authentication/sign-in/sign-in.component';
import {DashboardComponent} from './features/dashboard/dashboard.component';
import {NotFoundComponent} from './features/not-found/not-found.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '',
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
