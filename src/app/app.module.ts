import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AuthModule} from '@features/auth/auth.module';
import {DashboardModule} from '@features/dashboard/dashboard.module';
import {UserManagementComponent} from '@features/user-management/user-management.component';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {JwtInterceptor} from '@core/jwt.interceptor';

@NgModule({
  declarations: [AppComponent, UserManagementComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    AuthModule,
    DashboardModule,
    FormsModule,
    CommonModule,
    RouterModule,

  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule {
}