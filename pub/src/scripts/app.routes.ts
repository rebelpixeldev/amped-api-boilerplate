import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomepageComponent }  from './app.homepage';

import { crudRoutes } from './amped/crud/amped.crud.routes';
import { authRoutes } from './amped/auth/amped.auth.routes';
import { adminRoutes } from './amped/admin/amped.admin.routes';

export const appRoutes: Routes = [
  ...authRoutes,
  ...adminRoutes,
  ...crudRoutes,
  { path: '', component: HomepageComponent, pathMatch: 'full' },
];

export const appRoutingProviders: any[] = [

];


export const routes: ModuleWithProviders = RouterModule.forRoot(appRoutes);
