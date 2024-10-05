import { Routes } from '@angular/router';
import { userResolver } from './users/core/user.resolver';

export const routes: Routes = [
  {
    path: '',
    resolve: { users: userResolver },
    loadComponent: () =>
      import('./users/users.component').then(m => m.UsersComponent),
  },
  {
    path: 'edit-profile',
    resolve: { users: userResolver },
    loadComponent: () =>
      import('./users/components/edit-profile/edit-profile.component').then((mod) => mod.EditProfileComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
