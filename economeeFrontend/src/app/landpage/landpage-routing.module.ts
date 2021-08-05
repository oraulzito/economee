import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { LandpageComponent } from './landpage.component';

const routes: Routes = [
  {path: '', component: LandpageComponent},
  {path: 'functions', component: LandpageComponent},
  {path: 'aboutUs', component: LandpageComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandpageRoutingModule {
}
