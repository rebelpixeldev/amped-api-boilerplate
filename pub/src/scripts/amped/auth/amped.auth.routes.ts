import { Routes } from '@angular/router';

import { AmpedAuthLoginComponent } from './amped.auth.login.component';
import { AmpedAuthRegisterComponent } from './amped.auth.resgister.component';
import { AmpedAuthResetComponent } from './amped.auth.resetpassword.component';

export const authRoutes: Routes = [
  { path: 'login', component: AmpedAuthLoginComponent },
  { path: 'login/:redirect', component: AmpedAuthLoginComponent },
  { path: 'register', component: AmpedAuthRegisterComponent },
  { path: 'passwordreset', component: AmpedAuthResetComponent }
];
