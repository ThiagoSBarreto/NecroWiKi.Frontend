import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { AuthService } from '../../services/auth.service';
import { SidebarStateService } from '../../services/sidebar-state.service';

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
    readonly sidebarState = inject(SidebarStateService);
    private readonly router = inject(Router);

    endSession(): void {
        this.authService.logout();
        void this.router.navigate(['/account']);
    }
}