import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { environment } from '../../environments/environment';
import { PortalAccount, PortalSession } from '../models/portal-account.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly sessionStorageKey = 'necrowiki.portalSession';
    private readonly guestStorageKey = 'necrowiki.guest';

    readonly account = signal<PortalAccount | null>(null);
    readonly token = signal<string | null>(null);
    readonly isGuest = signal(false);
    readonly isAuthenticated = computed(() => this.account() !== null && this.token() !== null);
    readonly isAdmin = computed(() => this.account()?.role === 'Admin');

    constructor() {
        this.restoreSession();
    }

    login(userName: string, password: string): Observable<PortalSession> {
        return this.http.post<PortalSession>(`${environment.backendContext}auth/login`, { userName, password })
            .pipe(tap(session => this.acceptSession(session)));
    }

    register(userName: string, password: string): Observable<PortalSession> {
        return this.http.post<PortalSession>(`${environment.backendContext}auth/register`, { userName, password })
            .pipe(tap(session => this.acceptSession(session)));
    }

    enterAsGuest(): void {
        this.clearSession();
        this.isGuest.set(true);
        try {
            sessionStorage.setItem(this.guestStorageKey, 'true');
        } catch {
            // The in-memory guest flag still applies for the current page.
        }
    }

    logout(): void {
        this.clearSession();
        this.isGuest.set(false);
        try {
            sessionStorage.removeItem(this.guestStorageKey);
        } catch {
            // Storage may be unavailable in restricted browser contexts.
        }
    }

    private acceptSession(session: PortalSession): void {
        this.account.set(session.account);
        this.token.set(session.token);
        this.isGuest.set(false);
        try {
            sessionStorage.setItem(this.sessionStorageKey, JSON.stringify(session));
            sessionStorage.removeItem(this.guestStorageKey);
        } catch {
            // Keep the authenticated session in memory when storage is unavailable.
        }
    }

    private restoreSession(): void {
        try {
            const serializedSession = sessionStorage.getItem(this.sessionStorageKey);
            if (serializedSession) {
                const session = JSON.parse(serializedSession) as PortalSession;
                if (Date.parse(session.expiresAtUtc) > Date.now()) {
                    this.account.set(session.account);
                    this.token.set(session.token);
                    return;
                }

                sessionStorage.removeItem(this.sessionStorageKey);
            }

            this.isGuest.set(sessionStorage.getItem(this.guestStorageKey) === 'true');
        } catch {
            this.logout();
        }
    }

    private clearSession(): void {
        this.account.set(null);
        this.token.set(null);
        try {
            sessionStorage.removeItem(this.sessionStorageKey);
        } catch {
            // In-memory session is still cleared.
        }
    }
}