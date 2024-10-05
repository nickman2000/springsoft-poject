import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'edit-profile',
    loadComponent: () =>
      import('./components/edit-profile/edit-profile.component').then((mod) => mod.EditProfileComponent),
  },
];
