import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable } from 'rxjs'
import { UserService } from './user.service';
import { IUser } from './user.model';

export const userResolver: ResolveFn<Observable<IUser[]>> = () => {
  return inject(UserService).getUsers();
};
