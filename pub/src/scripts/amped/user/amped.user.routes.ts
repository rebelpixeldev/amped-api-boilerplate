import { Routes } from '@angular/router';

import { AmpedAuthGuard } from '../auth/amped.auth.route.guard';

import { UserProfileComponent } from './pages/amped.user.profile.component';

export const userRoutes: Routes = [
  { path: 'user/profile/:id', component: UserProfileComponent,  canActivate: [AmpedAuthGuard] },
];
