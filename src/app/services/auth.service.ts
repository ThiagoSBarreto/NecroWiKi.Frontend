import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { environment } from '../../environments/environment';
import { PortalAccount, PortalSession } from '../models/portal-account.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly sessionKey = 'necrowiki.portalSession';
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
        this.clearGuestSession();
    }

    private acceptSession(session: PortalSession): void {
        this.account.set(session.account);
        this.token.set(session.token);
        this.isGuest.set(false);
        this.persistSession(JSON.stringify(session));
        this.clearLegacySession();
        this.clearGuestSession();
    }

    private restoreSession(): void {
        const serializedSession = this.getStoredSession();
        if (!serializedSession) {
            this.isGuest.set(this.hasGuestSession());
            return;
        }

        let session: PortalSession;
        try {
            session = JSON.parse(serializedSession) as PortalSession;
        } catch {
            this.clearSession();
            this.isGuest.set(this.hasGuestSession());
            return;
        }

        if (Date.parse(session.expiresAtUtc) <= Date.now()) {
            this.clearSession();
            this.isGuest.set(this.hasGuestSession());
            return;
        }

        this.account.set(session.account);
        this.token.set(session.token);
        if (this.persistSession(serializedSession)) {
            this.clearLegacySession();
        }
    }

    private clearSession(): void {
        this.account.set(null);
        this.token.set(null);
        this.clearStoredSession();
    }

    private getStoredSession(): string | null {
        try {
            const persistedSession = localStorage.getItem(this.sessionKey);
            if (persistedSession) {
                return persistedSession;
            }
        } catch {
            // Fall back to the legacy session storage value.
        }

        try {
            return sessionStorage.getItem(this.sessionKey);
        } catch {
            return null;
        }
    }

    private persistSession(serializedSession: string): boolean {
        try {
            localStorage.setItem(this.sessionKey, serializedSession);
            return true;
        } catch {
            // Keep the authenticated session in memory when storage is unavailable.
            return false;
        }
    }

    private clearStoredSession(): void {
        try {
            localStorage.removeItem(this.sessionKey);
        } catch {
            // Storage may be unavailable in restricted browser contexts.
        }

        try {
            sessionStorage.removeItem(this.sessionKey);
        } catch {
            // Storage may be unavailable in restricted browser contexts.
        }
    }

    private clearLegacySession(): void {
        try {
            sessionStorage.removeItem(this.sessionKey);
        } catch {
            // Storage may be unavailable in restricted browser contexts.
        }
    }

    private clearGuestSession(): void {
        try {
            sessionStorage.removeItem(this.guestStorageKey);
        } catch {
            // Storage may be unavailable in restricted browser contexts.
        }
    }

    private hasGuestSession(): boolean {
        try {
            return sessionStorage.getItem(this.guestStorageKey) === 'true';
        } catch {
            return false;
        }
    }
}
