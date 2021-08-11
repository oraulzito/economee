import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './dashboard.component';
import {DashboardConfigurationComponent} from './dashboard-configuration/dashboard-configuration.component';
import {AuthenticationGuard} from '../guards/authentication.guard';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'configuration',
    component: DashboardConfigurationComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {
}
