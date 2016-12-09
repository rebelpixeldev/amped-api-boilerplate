import { Routes } from '@angular/router';

import { AmpedAdminPageDashboard } from './pages/amped.admin.page.dashboard';

import { AmpedAuthGuard } from '../auth/amped.auth.route.guard';

export const adminRoutes: Routes = [
  { path: 'dashboard', component: AmpedAdminPageDashboard,  canActivate: [AmpedAuthGuard] },
];
