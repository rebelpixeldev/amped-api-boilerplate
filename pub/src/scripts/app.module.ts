import { MaterialModule } from '@angular/material';

import { NgModule }       from '@angular/core';
import { HttpModule }     from '@angular/http';
import { BrowserModule }  from '@angular/platform-browser';

import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';

import { AppComponent }  from './app.component';
import { HomepageComponent }  from './app.homepage';

import { AmpedCrudModule }       from './amped/crud/amped.crud.module';
import { AmpedAuthModule }       from './amped/auth/amped.auth.module';

import { AmpedAuthService } from './amped/auth/amped.auth.service';
import { AmpedService } from './amped/common/amped.common.service';
import { AmpedAdminModule } from './amped/admin/amped.admin.module';

import { AmpedAuthGuard } from './amped/auth/amped.auth.route.guard';

import { routes,
  appRoutingProviders }  from './app.routes';

import
  { LocationStrategy, HashLocationStrategy} from '@angular/common';


@NgModule({
  imports:      [
    MaterialModule.forRoot(),
    BrowserModule,
    AmpedCrudModule,
    AmpedAuthModule,
    AmpedAdminModule,
    HttpModule,
    ModalModule.forRoot(),
    
    BootstrapModalModule,
    routes
  ],
  declarations: [ AppComponent, HomepageComponent ],
  providers : [ AmpedService, appRoutingProviders, AmpedAuthGuard, {provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap:    [ AppComponent ],
  entryComponents : [  ]
})
export class AppModule { }
