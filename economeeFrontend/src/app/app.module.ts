import {environment} from '../environments/environment';

import {NgModule} from '@angular/core';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {registerLocaleData} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NG_ENTITY_SERVICE_CONFIG} from '@datorama/akita-ng-entity-service';

import ptBr from '@angular/common/locales/pt';
import {en_US, NZ_I18N} from 'ng-zorro-antd/i18n';
import {AkitaNgDevtools} from '@datorama/akita-ngdevtools';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';

import * as PlotlyJS from 'plotly.js-dist-min';
import {PlotlyModule} from 'angular-plotly.js';

import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzGridModule} from "ng-zorro-antd/grid";
import {NzSpaceModule} from "ng-zorro-antd/space";
import {NzModalModule} from "ng-zorro-antd/modal";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzSelectModule} from "ng-zorro-antd/select";

import {DashboardModule} from './features/dashboard/dashboard.module';
import {NotFoundModule} from "./features/not-found/not-found.module";
import {AuthenticationModule} from "./features/authentication/authentication.module";
import {SharedModule} from "./shared/shared.module";
import {ReleaseModule} from "./features/release/release.module";
import {NzSpinModule} from "ng-zorro-antd/spin";
import en from '@angular/common/locales/en';

PlotlyModule.plotlyjs = PlotlyJS;

registerLocaleData(ptBr);
registerLocaleData(en);

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
    ReleaseModule,
    AuthenticationModule,
    environment.production ? [] : AkitaNgDevtools.forRoot(),
    SharedModule,
    NzGridModule,
    NzSpaceModule,
    NzModalModule,
    NzInputModule,
    ReactiveFormsModule,
    NzSelectModule,
    NzSpinModule,
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
    },
    {provide: NZ_I18N, useValue: en_US}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
