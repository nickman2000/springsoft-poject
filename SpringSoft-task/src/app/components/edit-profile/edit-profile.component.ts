import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, signal} from '@angular/core';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatButton, MatMiniFabButton} from '@angular/material/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import {Router} from '@angular/router';


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
    MatMiniFabButton
  ],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditProfileComponent {
  private cdr = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  public isSubmitted = signal<boolean>(false);
  public url = signal<string | null | undefined | ArrayBuffer>('');

  public editUserForm: FormGroup = this.fb.group({
    photoUrl: [''],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', Validators.pattern('[0-9]*$')]
  })

  ngOnInit() {
    this.trackFormValues();
  }

  private trackFormValues(): void {
    this.editUserForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        // this.hasUnsavedChanges.set(true);
      });
  }

  userEdit() {
    this.isSubmitted.set(true);
    this.editUserForm.reset();
    console.log(this.editUserForm.value);
    this.router.navigate(['/']);
  }

  cancelEdit() {
    this.router.navigate(['/']);
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
}
