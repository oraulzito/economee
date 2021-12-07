import en from '@angular/common/locales/en';

import {environment} from '../environments/environment';

import {NgModule} from '@angular/core';

import {FormsModule} from '@angular/forms';
import {registerLocaleData} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NG_ENTITY_SERVICE_CONFIG} from '@datorama/akita-ng-entity-service';

import {en_US, NZ_I18N} from 'ng-zorro-antd/i18n';
import {AkitaNgDevtools} from '@datorama/akita-ngdevtools';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {NzLayoutModule} from 'ng-zorro-antd/layout';

import * as PlotlyJS from 'plotly.js-dist-min';
import {PlotlyModule} from 'angular-plotly.js';
import {DashboardModule} from './features/dashboard/dashboard.module';
import {WelcomeModule} from './features/welcome/welcome.module';

PlotlyModule.plotlyjs = PlotlyJS;

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
    WelcomeModule,
    environment.production ? [] : AkitaNgDevtools.forRoot()
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
      useValue: en_US
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
