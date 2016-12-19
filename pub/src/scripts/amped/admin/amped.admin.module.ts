import { MaterialModule } from '@angular/material';
import { NgModule }       from '@angular/core';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import { BrowserModule }  from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AmpedTopbar } from './amped.admin.topbar.component';
import { AmpedSidebar } from './amped.admin.sidebar.component';
import { AmpedAuthService } from '../auth/amped.auth.service';

import { AmpedAdminPageDashboard } from './pages/amped.admin.page.dashboard';

import { AmpedUserModule } from '../user/amped.user.module';

const exportDeclarations = [
  [ AmpedTopbar, AmpedSidebar,
    AmpedAdminPageDashboard]
];


@NgModule({
  imports       : [
    MaterialModule.forRoot(),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AmpedUserModule],
  declarations  : exportDeclarations,
  exports       : exportDeclarations,
  providers     : [ AmpedAuthService ]
})
export class AmpedAdminModule { }
