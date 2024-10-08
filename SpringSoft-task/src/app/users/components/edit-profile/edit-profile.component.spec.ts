import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { EditProfileComponent } from './edit-profile.component';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../core/user.service';
import { ModalService } from '../../../modals/core/modal.service';
import { IUser } from '../../core/user.model';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('EditProfileComponent', () => {
  let component: EditProfileComponent;
  let fixture: ComponentFixture<EditProfileComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let router: jasmine.SpyObj<Router>;
  let modalService: jasmine.SpyObj<ModalService>;

  const activatedRouteStub = {
    queryParams: of({id: 1})
  };

  const mockUser: IUser = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phoneNumber: 1234567890,
    photoUrl: '',
  };

  beforeEach(() => {
    userService = jasmine.createSpyObj('UserService', ['users', 'editUser']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    modalService = jasmine.createSpyObj('ModalService', ['onError', 'onSuccess']);

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        EditProfileComponent,
        NoopAnimationsModule,
      ],
      providers: [
        {provide: UserService, useValue: userService},
        {provide: Router, useValue: router},
        {provide: ModalService, useValue: modalService},
        {provide: ActivatedRoute, useValue: activatedRouteStub},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditProfileComponent);
    component = fixture.componentInstance;
  });

  describe('on component initialization', () => {
    it('should get id from the activated route and call fillForm method with it', () => {
      spyOn(component, 'fillFormValues');

      component.ngOnInit();

      expect(component.fillFormValues).toHaveBeenCalledOnceWith(1);
    });

    it('should call method that tracks changes in the form', () => {
      spyOn(component, 'trackChangesInForm');

      component.ngOnInit();

      expect(component.trackChangesInForm).toHaveBeenCalledTimes(1);
    });
  });

  describe('fillForm method', () => {
    it('should navigate and show error if user is not found', () => {
      userService.users.and.returnValue([mockUser]);

      component.fillFormValues(999);

      expect(router.navigate).toHaveBeenCalledWith(['']);
      expect(modalService.onError).toHaveBeenCalledWith('Something went wrong.');
    });

    it('should fill the form with user data when user is found', () => {
      userService.users.and.returnValue([mockUser]);

      component.fillFormValues(1);

      expect(component.editUser).toEqual(mockUser);
      expect(component.editUserForm.get('firstName')?.value).toBe('John');
      expect(component.editUserForm.get('lastName')?.value).toBe('Doe');
      expect(component.editUserForm.get('email')?.value).toBe('john.doe@example.com');
      expect(component.editUserForm.get('phoneNumber')?.value).toBe(1234567890);
    });
  });

  describe('when form value is changed', () => {
    it('should convert phone number to number type and set the formHasChanged variable', () => {
      component.trackChangesInForm();

      expect(component.formHasChanged).toBe(false);

      component.editUserForm.controls['phoneNumber'].setValue('123456');

      expect(component.editUserForm.value.phoneNumber).toBe(123456);
      expect(component.formHasChanged).toBe(true);
    });
  });

  describe('when user uploads a file', () => {
    it('should call the onFileChangeMethod', () => {
      const inputSpy = fixture.nativeElement.querySelector('#photo-url');

      spyOn(component, 'onFileChange')

      inputSpy.dispatchEvent(new Event('change'));

      expect(component.onFileChange).toHaveBeenCalledTimes(1);
      expect(component.onFileChange).toHaveBeenCalledWith(new Event('change'));
    });

    it('should set the file url when user uploads the file', () => {
      const file = new File(['dummy content'], 'test.jpg', {type: 'image/jpg'});

      const event = {
        target: {
          files: [file],
        }
      } as unknown as Event;

      component.onFileChange(event);

      expect(component.url()).toBe('');
    });
  });

  describe('when user deletes the photo', () => {
    it('should reset the file input', () => {
      const inputSpy = fixture.nativeElement.querySelector('#photo-url');

      const file = new File(['dummy content'], 'test.jpg', {type: 'image/jpg'});

      const event = {
        target: {
          files: [file]
        }
      } as unknown as Event;

      inputSpy.dispatchEvent(new Event('change', event));

      component.removePhoto();

      expect(inputSpy.value).toBe('');
    });
  });

  describe('when user clicks on update', () => {
    it('should show validation error when number is incorrectly input and should not update', () => {
      const phoneNumberFC = component.editUserForm.controls['phoneNumber'];

      const patternError = {
        pattern: {
          actualValue: 'kk239',
          requiredPattern: '^[0-9]*$',
        },
      };

      phoneNumberFC.setValue('kk239');

      const updateButton = fixture.nativeElement.querySelectorAll('.form-buttons button')[0];

      updateButton.click()

      fixture.detectChanges();

      expect(phoneNumberFC.errors).toEqual(patternError);
      expect(updateButton.disabled).toBeTruthy();
      expect(userService.editUser).toHaveBeenCalledTimes(0);
    });

    it('should call API method from service and pass user data', () => {
      component.editUserForm.patchValue(mockUser);

      const updateButton = fixture.nativeElement.querySelectorAll('.form-buttons button')[0];

      updateButton.click()

      fixture.detectChanges();

      expect(userService.editUser).toHaveBeenCalledTimes(1);
      expect(userService.editUser).toHaveBeenCalledWith(mockUser);
    });

    it('should navigate to the list', () => {
      component.editUserForm.patchValue(mockUser);

      const updateButton = fixture.nativeElement.querySelectorAll('.form-buttons button')[0];

      updateButton.click()

      fixture.detectChanges();

      userService.editUser.and.returnValue(of('success' as unknown as IUser))

      expect(router.navigate).toHaveBeenCalledTimes(1);
    });
  });

  it('should navigate to the list when user clicks on cancel', () => {
    const updateButton = fixture.nativeElement.querySelectorAll('.form-buttons button')[1];

    updateButton.click();

    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});
