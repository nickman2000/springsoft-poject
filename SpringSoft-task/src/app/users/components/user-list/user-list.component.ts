import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnInit,
} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { NgTemplateOutlet } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserService } from "../../core/user.service";
import { IUser } from "../../core/user.model";

@Component({
    selector: 'app-user-list',
    standalone: true,
    imports: [
        MatTableModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        NgTemplateOutlet,
        MatPaginator,
        MatDialogModule,
    ],
    templateUrl: './user-list.component.html',
    styleUrl: './user-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent implements OnInit {
    private router = inject(Router);

    public userService: UserService = inject(UserService);
    public displayedColumns = [
        'name',
        'surname',
        'email',
        'actions',
    ];

    ngOnInit() {
    }

    editClient(user: IUser) {
        this.router.navigate(['/edit-profile'], {
            queryParams: {
                id: user.id,
            },
        });
    }
}
