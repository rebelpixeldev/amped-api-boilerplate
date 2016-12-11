import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomepageComponent }  from './app.homepage';

import { crudRoutes } from './amped/crud/amped.crud.routes';
import { authRoutes } from './amped/auth/amped.auth.routes';
import { adminRoutes } from './amped/admin/amped.admin.routes';
import { filesRoutes } from './amped/files/amped.files.routes';

import { AmpedAuthGuard } from './amped/auth/amped.auth.route.guard';

export const appRoutes: Routes = [
  ...authRoutes,
  ...adminRoutes,
  ...crudRoutes,
  ...filesRoutes,
  { path: '', component: HomepageComponent, pathMatch: 'full', canActivate: [AmpedAuthGuard] },
];

export const appRoutingProviders: any[] = [

];


export const routes: ModuleWithProviders = RouterModule.forRoot(appRoutes);
