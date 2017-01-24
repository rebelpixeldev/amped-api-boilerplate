import { MaterialModule } from '@angular/material';

import { NgModule }       from '@angular/core';
import { HttpModule }     from '@angular/http';
import { BrowserModule }  from '@angular/platform-browser';

import { AppComponent }  from './app.component';
import { HomepageComponent }  from './app.homepage';

import { AmpedCrudModule }       from './amped/crud/amped.crud.module';
import { AmpedAuthModule }       from './amped/auth/amped.auth.module';
import { AmpedCommonModule }       from './amped/common/amped.common.module';
import { AmpedChatModule }       from './amped/chat/amped.chat.module';
import { AmpedTableModule }       from './amped/table/amped.table.module';

import { AmpedAuthService } from './amped/auth/amped.auth.service';
import { AmpedService } from './amped/common/amped.common.service';
import { AmpedAdminModule } from './amped/admin/amped.admin.module';
import { AmpedChartModule } from './amped/chart/amped.chart.module';

import { AmpedAuthGuard } from './amped/auth/amped.auth.route.guard';

import {AmpedSocketService} from './amped/socket/amped.socket.service';

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
    AmpedCommonModule,
    AmpedChartModule,
    AmpedChatModule,
    AmpedTableModule,
    HttpModule,
    routes
  ],
  declarations: [ AppComponent, HomepageComponent ],
  providers : [ AmpedService, appRoutingProviders, AmpedAuthGuard, AmpedSocketService, {provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap:    [ AppComponent ],
  entryComponents : [  ]
})
export class AppModule { }
