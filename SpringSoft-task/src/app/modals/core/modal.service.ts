import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  public errorText = signal('Could not load');
  public successText = signal('User Form Updated');
  public hasError = signal<boolean>(false);
  public isSuccess = signal<boolean>(false);

  onError(text: string) {
    this.errorText.set(text);
    this.hasError.set(true);
    setTimeout(() => this.hasError.set(false), 3000);
  }

  onSuccess(text: string) {
    this.successText.set(text);
    this.isSuccess.set(true);
    setTimeout(() => this.isSuccess.set(false), 3000);
  }
}
