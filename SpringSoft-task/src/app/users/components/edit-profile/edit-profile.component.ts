import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
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
import {delay, finalize, take} from 'rxjs';
import { ModalService } from '../../../modals/core/modal.service';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {NgStyle} from '@angular/common';


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


export class EditProfileComponent implements OnInit{
  private cdr = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private editUser: IUser | null = null;
  private modalService = inject(ModalService);

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
    phoneNumber: ['', Validators.pattern('[0-9]*$')]
  })

  ngOnInit() {
    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((param) => {
        this.fillFormValues(param['id']);
        return;
      });

    this.trackChangesInForm();
  }

  fillFormValues(id: number): void {
    const [user] = this.userService?.users()?.filter((user) => user.id === id);
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

  transformFormValues(): IUser {
    const formValue = this.editUserForm.value;
    return {
      ...formValue,
      phoneNumber: +formValue.phoneNumber,
    };
  }

  trackChangesInForm() {
    this.editUserForm.valueChanges.subscribe((value) => {
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
    const formValue = this.transformFormValues();

    this.userService
      .editUser(formValue)
      .pipe(
        delay(500),
        take(1),
        finalize(() => {
          this.isSpinnerActivate = false;
          this.router.navigate(['']);
          if (this.modalService.hasError()) return;
          this.modalService.onSuccess('User profile successfully updated.');
        }),
      )
      .subscribe();
  }

  cancelEdit() {
    this.router.navigate(['/']);
  }
}
