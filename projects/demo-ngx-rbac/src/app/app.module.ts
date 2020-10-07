import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { DoNgxRbacModule } from '@do/ngx-rbac';
import { Route1Component } from './route1.component';
import { Route2Component } from './route2.component';
import { Route3Component } from './route3.component';
import { DeepComponent } from './deep.component';
import { Route4Component } from './route4.component';

@NgModule({
  declarations: [
    AppComponent,
    HelloComponent,
    Route1Component,
    Route2Component,
    Route3Component,
    Route4Component,
    DeepComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DoNgxRbacModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
