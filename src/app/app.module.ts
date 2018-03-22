import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {Ng2ImgToolsModule} from 'ng2-img-tools';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app.routing.module';
import {StartPageModule} from './start-page/start-page.module';
import {AuthModule} from './auth/auth.module';
import {ServicesModule} from './services/services.module';
import {SharedModule} from './shared/shared.module';
import {HttpClientModule} from '@angular/common/http';
import {MainModule} from './main/main.module';
import {SharingPageModule} from './shared/pages/project/sharing-page.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    Ng2ImgToolsModule,
    AppRoutingModule,
    StartPageModule,
    AuthModule,
    HttpClientModule,
    SharedModule,
    ServicesModule,
    MainModule,
    SharingPageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
