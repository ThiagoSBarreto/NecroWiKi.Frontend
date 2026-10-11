import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-account',
    imports: [CommonModule, FormsModule, ButtonModule, RouterLink],
    templateUrl: './account.html',
    styleUrl: './account.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountComponent {
    private readonly authService = inject(AuthService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);

    readonly registering = signal(false);
    readonly busy = signal(false);
    readonly errorMessage = signal('');

    userName = '';
    password = '';
    confirmPassword = '';

    setMode(registering: boolean): void {
        this.registering.set(registering);
        this.errorMessage.set('');
        this.password = '';
        this.confirmPassword = '';
    }

    submit(): void {
        if (this.busy()) {
            return;
        }

        if (this.registering() && this.password !== this.confirmPassword) {
            this.errorMessage.set('As senhas não coincidem.');
            return;
        }

        this.busy.set(true);
        this.errorMessage.set('');
        const request = this.registering()
            ? this.authService.register(this.userName.trim(), this.password)
            : this.authService.login(this.userName.trim(), this.password);

        request.subscribe({
            next: session => {
                this.busy.set(false);
                const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
                const safeReturnUrl = returnUrl?.startsWith('/') && !returnUrl.startsWith('//')
                    ? returnUrl
                    : session.account.role === 'Admin' ? '/admin' : '/home';
                void this.router.navigateByUrl(safeReturnUrl);
            },
            error: (error: HttpErrorResponse) => {
                this.busy.set(false);
                this.errorMessage.set(error.error?.message ?? 'Não foi possível acessar sua conta.');
            }
        });
    }

    enterAsGuest(): void {
        this.authService.enterAsGuest();
        void this.router.navigate(['/arcade/n64']);
    }
}