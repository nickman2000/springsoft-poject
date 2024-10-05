import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, Observable, of, shareReplay, tap} from 'rxjs';
import { IUser } from './user.model';
import { ModalService } from '../../modals/core/modal.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private modalService = inject(ModalService);
  private http = inject(HttpClient);

  private apiUrl: string = "http://localhost:3000";

  public users = signal<IUser[]>([]);

  public getUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${this.apiUrl}/users`).pipe(
      tap((users) => {
        this.users.set(users);
      }),
      shareReplay(1),
      catchError(() => {
        this.modalService.onError('Could not load, please try again.');
        return of([]);
      }),
    );
  }

  public editUser(user: IUser): Observable<IUser | null> {
    return this.http.put<IUser>(`${this.apiUrl}/users/${user.id}`, user).pipe(
        catchError(() => {
          this.modalService.onError('Something went wrong.');
          return of(null);
        }),
    );
  }
}
