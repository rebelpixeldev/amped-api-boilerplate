import { Routes } from '@angular/router';

import { AmpedCrudTableComponent } from './amped.crud.table.component';
import { AmpedCrudFormComponent } from './amped.crud.form.component';

import { AmpedAuthGuard } from '../auth/amped.auth.route.guard';

export const crudRoutes: Routes = [
  { path: 'edit/:model', component: AmpedCrudTableComponent,  canActivate: [AmpedAuthGuard] },
  { path: 'edit/:model/:id', component: AmpedCrudFormComponent, canActivate: [AmpedAuthGuard] }
];
