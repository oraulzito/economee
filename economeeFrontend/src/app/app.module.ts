import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LoginComponent } from './welcome/login/login.component';
import { SignupComponent } from './welcome/signup/signup.component';
import { LandpageComponent } from './welcome/landpage/landpage.component';
import { DashboardDesktopComponent } from './dashboard/dashboard-desktop/dashboard-desktop.component';
import { DashboardMobileComponent } from './dashboard/dashboard-mobile/dashboard-mobile.component';
import { ProfileComponent } from './dashboard/dashboard-configuration/profile/profile.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { IconsProviderModule } from './icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { GraphicsPanelComponent } from './components/graphics-panel/graphics-panel.component';
import { ReleasesPanelComponent } from './components/releases-panel/releases-panel.component';
import { ReleasesCardComponent } from './components/releases-card/releases-card.component';
import { PizzaGraphicComponent } from './components/pizza-graphic/pizza-graphic.component';
import { TimelineGraphicComponent } from './components/timeline-graphic/timeline-graphic.component';
import { GraphicTimelineComponent } from './components/graphic-timeline/graphic-timeline.component';
import { GraphicPizzaComponent } from './components/graphic-pizza/graphic-pizza.component';
import { HeaderComponent } from './dashboard/dashboard-desktop/header/header.component';
import { FooterComponent } from './dashboard/dashboard-mobile/footer/footer.component';
import { DashboardConfigurationComponent } from './dashboard/dashboard-configuration/dashboard-configuration.component';
import { CardsComponent } from './dashboard/dashboard-configuration/cards/cards.component';
import { AccountComponent } from './dashboard/dashboard-configuration/account/account.component';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    LandpageComponent,
    DashboardDesktopComponent,
    DashboardMobileComponent,
    ProfileComponent,
    GraphicsPanelComponent,
    ReleasesPanelComponent,
    ReleasesCardComponent,
    PizzaGraphicComponent,
    TimelineGraphicComponent,
    GraphicTimelineComponent,
    GraphicPizzaComponent,
    HeaderComponent,
    FooterComponent,
    DashboardConfigurationComponent,
    CardsComponent,
    AccountComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent]
})
export class AppModule { }
