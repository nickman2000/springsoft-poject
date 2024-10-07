import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { EditProfileComponent } from './edit-profile.component';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../core/user.service';
import { ModalService } from '../../../modals/core/modal.service';
import { IUser } from '../../core/user.model';

describe('EditProfileComponent', () => {
  let component: EditProfileComponent;
  let fixture: ComponentFixture<EditProfileComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let router: jasmine.SpyObj<Router>;
  let modalService: jasmine.SpyObj<ModalService>;
  let route: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(() => {
    userService = jasmine.createSpyObj('UserService', ['users', 'editUser']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    modalService = jasmine.createSpyObj('ModalService', ['onError', 'onSuccess']);

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        EditProfileComponent,
      ],
      providers: [
        { provide: UserService, useValue: userService },
        { provide: Router, useValue: router },
        { provide: ModalService, useValue: modalService },
        { provide: ActivatedRoute, useValue: route }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditProfileComponent);
    component = fixture.componentInstance;
    component.editUserForm = component.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      phoneNumber: [null],
      photoUrl: [''],
    });
  });

  it('should navigate and show error if user is not found', () => {
    userService.users.and.returnValue([]);

    component.fillFormValues(999);

    expect(router.navigate).toHaveBeenCalledWith(['']);
    expect(modalService.onError).toHaveBeenCalledWith('Something went wrong.');
  });

  it('should populate the form with user data when user is found', () => {
    const mockUser: IUser = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: 1234567890,
      photoUrl: '',
    };

    userService.users.and.returnValue([mockUser]);

    component.fillFormValues(1);

    expect(component.editUser).toEqual(mockUser);
    expect(component.editUserForm.get('firstName')?.value).toBe('John');
    expect(component.editUserForm.get('lastName')?.value).toBe('Doe');
    expect(component.editUserForm.get('email')?.value).toBe('john.doe@example.com');
    expect(component.editUserForm.get('phoneNumber')?.value).toBe(1234567890);
  });
});
