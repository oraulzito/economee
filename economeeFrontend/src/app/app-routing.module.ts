import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  // TODO in sprint 4 - remove
  {path: '', pathMatch: 'full', redirectTo: '/login'},
  {path: '', loadChildren: () => import('./welcome/welcome.module').then(m => m.WelcomeModule)},
  {path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
