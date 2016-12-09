import { MaterialModule } from '@angular/material';
import { NgModule }       from '@angular/core';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import { BrowserModule }  from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AmpedTopbar } from './amped.admin.topbar.component';
import { AmpedSidebar } from './amped.admin.sidebar.component';
import { AmpedUserThumb } from './amped.user.thumb.component';
import { AmpedAuthService } from '../auth/amped.auth.service';

import { AmpedAdminPageDashboard } from './pages/amped.admin.page.dashboard';

const exportDeclarations = [
  [ AmpedTopbar, AmpedSidebar, AmpedUserThumb,
    AmpedAdminPageDashboard]
];


@NgModule({
  imports       : [
    MaterialModule.forRoot(),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule],
  declarations  : exportDeclarations,
  exports       : exportDeclarations,
  providers     : [ AmpedAuthService ]
})
export class AmpedAdminModule { }
