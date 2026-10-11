import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-header',
    imports: [
        ButtonModule,
        TooltipModule,
        RouterLink
    ],
    templateUrl: './header.html',
    styleUrl: './header.scss'
})
export class HeaderComponent {
    readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    endSession(): void {
        this.authService.logout();
        void this.router.navigate(['/account']);
    }
}