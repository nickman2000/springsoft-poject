import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { ModalService } from '../core/modal.service';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translate(100px, 0)' }),
        animate(
          '300ms ease-out',
          style({ opacity: 1, transform: 'translate(0, 0)' }),
        ),
      ]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
  private modalService = inject(ModalService);
  public isError = this.modalService.hasError();
  public modalText = computed(() => this.modalService.isSuccess() ?
    this.modalService.successText() : this.modalService.errorText());
}
