import { NgModule }       from '@angular/core';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import { BrowserModule }  from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AmpedTopbarComponent } from './amped.admin.topbar.component';
import { AmpedAuthService } from '../auth/amped.auth.service';

const exportDeclarations = [
  [ AmpedTopbarComponent ]
];


@NgModule({
  imports       : [BrowserModule, FormsModule, ReactiveFormsModule, RouterModule],
  declarations  : exportDeclarations,
  exports       : exportDeclarations,
  providers     : [ AmpedAuthService ]
})
export class AmpedAuthModule { }
