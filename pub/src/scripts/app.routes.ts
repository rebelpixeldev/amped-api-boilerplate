import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomepageComponent }  from './app.homepage';
import { AmpedCrudFormComponent } from './amped/forms/amped.forms.crudform.component';
import { AmpedCrudTableComponent } from './amped/forms/amped.forms.crudtable.component';

export const appRoutes: Routes = [
  { path: 'edit/:model', component: AmpedCrudTableComponent },
  { path: 'edit/:model/:id', component: AmpedCrudFormComponent },
  { path: '', component: HomepageComponent, pathMatch: 'full' },
];

export const appRoutingProviders: any[] = [

];


export const routes: ModuleWithProviders = RouterModule.forRoot(appRoutes);
