import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal
} from '@angular/core';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatMiniFabButton } from '@angular/material/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../core/user.service';
import { IUser } from '../../core/user.model';
import { finalize, tap } from 'rxjs';
import { ModalService } from '../../../modals/core/modal.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgStyle } from '@angular/common';


@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    MatFormField,
    MatInput,
    MatLabel,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatButton,
    MatIconModule,
    MatMiniFabButton,
    MatProgressSpinner,
    NgStyle
  ],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})


export class EditProfileComponent implements OnInit {
  public fb = inject(FormBuilder);
  public editUser: IUser | null = null;
  public isSubmitted = signal<boolean>(false);
  public url = signal<string | null | undefined | ArrayBuffer>('');
  public formHasChanged: boolean = false;
  public isSpinnerActivate: boolean = false;
  public editUserForm: FormGroup = this.fb.group({
    id: [''],
    photoUrl: [''],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: [null, Validators.pattern('[0-9]*$')]
  })

  constructor(
    private cdr: ChangeDetectorRef,
    private destroyRef: DestroyRef,
    private router: Router,
    public route: ActivatedRoute,
    private userService: UserService,
    private modalService: ModalService
  ) {
  }

  ngOnInit() {
    this.route.queryParams.pipe(
      takeUntilDestroyed(this.destroyRef),
      tap(param => {
        this.fillFormValues(param['id']);
        return;
      }),
    ).subscribe();

    this.trackChangesInForm();
  }

  fillFormValues(id: number): void {
    const user = this.userService?.users()?.find((user) => user.id === id);
    if (!user) {
      this.router.navigate(['']);
      this.modalService.onError('Something went wrong.');
      return;
    }
    this.editUser = user;
    Object.keys(user).forEach((key) => {
      this.editUserForm.get(key)?.patchValue((user as any)[key]);
    });
  }

  trackChangesInForm() {
    this.editUserForm.valueChanges.subscribe(value => {
      value.phoneNumber = +value.phoneNumber;
      JSON.stringify(value) !== JSON.stringify(this.editUser) ?
        this.formHasChanged = true : this.formHasChanged = false;
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.url.set(e.target?.result);
        this.editUserForm.patchValue({
          photoUrl: this.url(),
        });
        this.cdr.detectChanges();
      };

      reader.onerror = (e: ProgressEvent<FileReader>) => {
        console.error('File reading error:', e);
      };

      reader.readAsDataURL(file);
    }
  }

  removePhoto() {
    const photoUrlElement = document.getElementById('photo-url') as HTMLInputElement | null;
    if (photoUrlElement) {
      photoUrlElement.value = "";
    }
    this.url.set(null);
    this.editUserForm.patchValue({
      photoUrl: this.url(),
    });
    this.cdr.detectChanges();
  }

  userEdit() {
    if (this.editUserForm.invalid) return;
    this.isSpinnerActivate = true;
    const formValue = this.editUserForm.value;
    this.userService.editUser(formValue).pipe(
      finalize(() => {
        this.isSpinnerActivate = false;
        this.router.navigate(['']);
      })
    ).subscribe();
  }

  cancelEdit() {
    this.router.navigate(['/']);
  }
}
