import { NgModule }       from '@angular/core';
import { HttpModule }     from '@angular/http';
import { BrowserModule }  from '@angular/platform-browser';
import { RouterModule }   from '@angular/router';

import { AppComponent }  from './app.component';
import { HomepageComponent }  from './app.homepage';

import { AmpedTopbarComponent } from './amped/admin/amped.admin.topbar.component';
import { AmpedFormsModule }     from './amped/forms/amped.forms.module';
import { AmpedCommonModule }     from './amped/common/amped.common.module';

import { routes,
  appRoutingProviders }  from './app.routes';

import
  { LocationStrategy, HashLocationStrategy} from '@angular/common';

@NgModule({
  imports:      [
    BrowserModule,
    AmpedFormsModule,
    AmpedCommonModule,
    HttpModule,
    routes
  ],
  declarations: [ AppComponent, AmpedTopbarComponent, HomepageComponent ],
  providers : [appRoutingProviders, {provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
