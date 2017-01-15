import { MaterialModule } from '@angular/material';
import { NgModule }       from '@angular/core';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import { BrowserModule }  from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AmpedAuthLoginComponent } from './pages/amped.auth.login.component';
import { AmpedAuthRegisterComponent } from './pages/amped.auth.register.component';
import { AmpedAuthResetComponent } from './pages/amped.auth.resetpassword.component';
import {AmpedAuthSetPasswordComponent} from "./pages/amped.auth.setpassword";

import { AmpedCommonModule } from '../common/amped.common.module';
import { AmpedFormsModule } from '../form/amped.form.module';

import { AmpedAuthService } from './amped.auth.service';
import { AmpedService } from '../common/amped.common.service';

const exportDeclarations = [
  [ AmpedAuthLoginComponent, AmpedAuthRegisterComponent, AmpedAuthResetComponent, AmpedAuthSetPasswordComponent ]
];

@NgModule({
  imports       : [BrowserModule, FormsModule, ReactiveFormsModule, RouterModule, AmpedCommonModule, AmpedFormsModule, MaterialModule.forRoot()],
  declarations  : exportDeclarations,
  exports       : exportDeclarations,
  providers     : [ AmpedAuthService, AmpedService ]
})
export class AmpedAuthModule { }
