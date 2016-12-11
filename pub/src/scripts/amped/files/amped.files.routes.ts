import { Routes } from '@angular/router';

import { FilesLibraryPage } from './pages/amped.files.page.library';

import { AmpedAuthGuard } from '../auth/amped.auth.route.guard';

export const filesRoutes: Routes = [
  { path: 'files/library', component: FilesLibraryPage,  canActivate: [AmpedAuthGuard] }
];
