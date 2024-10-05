import {
    ChangeDetectionStrategy,
    Component,
    inject,
} from '@angular/core';
import { UserListComponent } from './components/user-list/user-list.component';
import { ModalComponent } from '../modals/modal/modal.component';
import { ModalService } from '../modals/core/modal.service';

@Component({
    selector: 'app-users',
    standalone: true,
    imports: [UserListComponent, ModalComponent],
    templateUrl: './users.component.html',
    styleUrl: './users.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent {

    public modalService = inject(ModalService);

}
