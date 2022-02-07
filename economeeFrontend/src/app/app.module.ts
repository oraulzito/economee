import {environment} from '../environments/environment';

import {NgModule} from '@angular/core';

import {FormsModule} from '@angular/forms';
import {registerLocaleData} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NG_ENTITY_SERVICE_CONFIG} from '@datorama/akita-ng-entity-service';

import ptBr from '@angular/common/locales/pt';
import {NZ_I18N} from 'ng-zorro-antd/i18n';
import {AkitaNgDevtools} from '@datorama/akita-ngdevtools';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {NzLayoutModule} from 'ng-zorro-antd/layout';

import * as PlotlyJS from 'plotly.js-dist-min';
import {PlotlyModule} from 'angular-plotly.js';
import {DashboardModule} from './features/dashboard/dashboard.module';
import {NotFoundModule} from "./features/not-found/not-found.module";
import {AuthenticationModule} from "./features/authentication/authentication.module";
import {SharedModule} from "./shared/shared.module";
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzSpaceModule} from "ng-zorro-antd/space";

PlotlyModule.plotlyjs = PlotlyJS;

registerLocaleData(ptBr);

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    PlotlyModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NzLayoutModule,
    DashboardModule,
    NotFoundModule,
    AuthenticationModule,
    environment.production ? [] : AkitaNgDevtools.forRoot(),
    SharedModule,
    NzGridModule,
    NzSpaceModule,
  ],
  providers: [
    {
      provide: NG_ENTITY_SERVICE_CONFIG,
      useValue: {
        baseUrl: 'localhost:8000/api'
      }
    },
    {
      provide: NZ_I18N,
      useValue: ptBr
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
