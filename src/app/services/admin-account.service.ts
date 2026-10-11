import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { PortalAccount } from '../models/portal-account.model';

@Injectable({ providedIn: 'root' })
export class AdminAccountService {
    private readonly http = inject(HttpClient);
    private readonly endpoint = `${environment.backendContext}admin/accounts`;

    getAccounts(): Observable<PortalAccount[]> {
        return this.http.get<PortalAccount[]>(this.endpoint);
    }

    createAccount(payload: { userName: string; password: string; role: string }): Observable<PortalAccount> {
        return this.http.post<PortalAccount>(this.endpoint, payload);
    }

    updateAccount(id: string, payload: { role: string; isActive: boolean; newPassword: string }): Observable<PortalAccount> {
        return this.http.put<PortalAccount>(`${this.endpoint}/${id}`, payload);
    }

    deleteAccount(id: string): Observable<void> {
        return this.http.delete<void>(`${this.endpoint}/${id}`);
    }
}