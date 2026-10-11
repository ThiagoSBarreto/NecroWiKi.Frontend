import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

import { PortalAccount } from '../models/portal-account.model';
import { AdminAccountService } from '../services/admin-account.service';

interface AccountRow extends PortalAccount {
    newPassword: string;
}

@Component({
    selector: 'app-admin',
    imports: [CommonModule, FormsModule, ButtonModule, DialogModule],
    templateUrl: './admin.html',
    styleUrl: './admin.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminComponent {
    private readonly accountService = inject(AdminAccountService);

    readonly accounts = signal<AccountRow[]>([]);
    readonly loading = signal(true);
    readonly busyId = signal<string | null>(null);
    readonly errorMessage = signal('');
    readonly createError = signal('');

    showCreateDialog = false;
    newUserName = '';
    newPassword = '';
    newRole: 'Admin' | 'User' = 'User';

    constructor() {
        this.loadAccounts();
    }

    loadAccounts(): void {
        this.loading.set(true);
        this.accountService.getAccounts().subscribe({
            next: accounts => {
                this.accounts.set(accounts.map(account => ({ ...account, newPassword: '' })));
                this.loading.set(false);
            },
            error: error => {
                this.loading.set(false);
                this.errorMessage.set(this.getErrorMessage(error));
            }
        });
    }

    saveAccount(account: AccountRow): void {
        this.busyId.set(account.id);
        this.errorMessage.set('');
        this.accountService.updateAccount(account.id, {
            role: account.role,
            isActive: account.isActive,
            newPassword: account.newPassword
        }).subscribe({
            next: updated => {
                this.accounts.update(rows => rows.map(row => row.id === updated.id
                    ? { ...updated, newPassword: '' }
                    : row));
                this.busyId.set(null);
            },
            error: error => {
                this.busyId.set(null);
                this.errorMessage.set(this.getErrorMessage(error));
            }
        });
    }

    deleteAccount(account: AccountRow): void {
        if (!confirm(`Excluir a conta ${account.userName}?`)) {
            return;
        }

        this.busyId.set(account.id);
        this.accountService.deleteAccount(account.id).subscribe({
            next: () => {
                this.accounts.update(rows => rows.filter(row => row.id !== account.id));
                this.busyId.set(null);
            },
            error: error => {
                this.busyId.set(null);
                this.errorMessage.set(this.getErrorMessage(error));
            }
        });
    }

    createAccount(): void {
        this.createError.set('');
        this.accountService.createAccount({
            userName: this.newUserName.trim(),
            password: this.newPassword,
            role: this.newRole
        }).subscribe({
            next: account => {
                this.accounts.update(rows => [...rows, { ...account, newPassword: '' }]
                    .sort((first, second) => first.userName.localeCompare(second.userName)));
                this.showCreateDialog = false;
                this.resetCreateForm();
            },
            error: (error: HttpErrorResponse) => this.createError.set(this.getErrorMessage(error))
        });
    }

    closeCreateDialog(): void {
        this.showCreateDialog = false;
        this.resetCreateForm();
    }

    resetCreateForm(): void {
        this.newUserName = '';
        this.newPassword = '';
        this.newRole = 'User';
        this.createError.set('');
    }

    private getErrorMessage(error: HttpErrorResponse): string {
        return error.error?.message ?? 'Não foi possível concluir a operação.';
    }
}