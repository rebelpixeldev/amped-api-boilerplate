import { Routes } from '@angular/router';

import { AmpedAuthLoginComponent } from './pages/amped.auth.login.component';
import { AmpedAuthRegisterComponent } from './pages/amped.auth.register.component';
import { AmpedAuthResetComponent } from './pages/amped.auth.resetpassword.component';
import {AmpedAuthSetPasswordComponent} from "./pages/amped.auth.setpassword";

export const authRoutes: Routes = [
  { path: 'login', component: AmpedAuthLoginComponent },
  { path: 'login/:redirect', component: AmpedAuthLoginComponent },
  { path: 'register', component: AmpedAuthRegisterComponent },
  { path: 'passwordreset', component: AmpedAuthResetComponent },
  { path: 'setpassword/:token', component: AmpedAuthSetPasswordComponent }
];
