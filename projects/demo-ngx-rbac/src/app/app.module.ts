import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { NgxRbacModule } from '@do/ngx-rbac';
import { Route1Component } from './route1.component';

@NgModule({
  declarations: [
    AppComponent,
    HelloComponent,
    Route1Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxRbacModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
