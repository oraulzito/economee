import {environment} from '../environments/environment';

import {NgModule} from '@angular/core';
import {CommonModule, registerLocaleData} from '@angular/common';
import {NG_ENTITY_SERVICE_CONFIG} from '@datorama/akita-ng-entity-service';

import ptBr from '@angular/common/locales/pt';
import {en_US, NZ_I18N} from 'ng-zorro-antd/i18n';
import {AkitaNgDevtools} from '@datorama/akita-ngdevtools';

import {AppComponent} from './app.component';
import en from '@angular/common/locales/en';
import {NzGridModule} from "ng-zorro-antd/grid";
import {RouterModule} from "@angular/router";
import {BrowserModule} from "@angular/platform-browser";
import {AppRoutingModule} from "./app-routing.module";
import {SharedModule} from "./shared/shared.module";
import {AuthenticationModule} from "./features/user/authentication.module";
import {CoreModule} from "./core/components/core.module";
import {ReleaseModule} from "./features/release/release.module";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";


registerLocaleData(ptBr);
registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    environment.production ? [] : AkitaNgDevtools.forRoot(),
    BrowserModule,
    NzGridModule,
    RouterModule,
    AppRoutingModule,
    CommonModule,
    SharedModule,
    AuthenticationModule,
    CoreModule,
    ReleaseModule,
    HttpClientModule,
    BrowserAnimationsModule
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
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule {

}
