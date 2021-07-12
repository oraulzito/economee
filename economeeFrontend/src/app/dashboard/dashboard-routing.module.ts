import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import {DashboardConfigurationComponent} from './dashboard-configuration/dashboard-configuration.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'configuration', component: DashboardConfigurationComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
