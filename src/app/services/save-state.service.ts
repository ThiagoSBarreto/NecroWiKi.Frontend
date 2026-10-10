import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface SaveStateIdentityResponse {
    uuid: string;
}

@Injectable({ providedIn: 'root' })
export class SaveStateService {
    private readonly http = inject(HttpClient);
    private readonly browserIdStorageKey = 'necrowiki.browserId';

    checkIdentity(uuid: string): Observable<void> {
        return this.http.get<void>(`${this.identityUrl}/${uuid}`);
    }

    resolveIdentity(user: string, password: string, currentUuid: string | null): Observable<SaveStateIdentityResponse> {
        return this.http.post<SaveStateIdentityResponse>(this.identityUrl, {
            user,
            password,
            currentUuid
        });
    }

    getBrowserId(): string | null {
        try {
            const browserId = localStorage.getItem(this.browserIdStorageKey);
            return browserId && this.isUuid(browserId) ? browserId : null;
        } catch {
            return null;
        }
    }

    setBrowserId(uuid: string): void {
        if (!this.isUuid(uuid)) {
            throw new Error('O servidor retornou um UUID inválido.');
        }

        localStorage.setItem(this.browserIdStorageKey, uuid);
    }

    save(gameKey: string, state: Uint8Array): Observable<void> {
        return this.http.put<void>(
            this.saveStateUrl,
            new Blob([new Uint8Array(state).buffer], { type: 'application/octet-stream' }),
            { params: this.createParams(gameKey) }
        );
    }

    load(gameKey: string): Observable<ArrayBuffer> {
        return this.http.get(this.saveStateUrl, {
            params: this.createParams(gameKey),
            responseType: 'arraybuffer'
        });
    }

    private get identityUrl(): string {
        return `${environment.backendContext}savestateuser`;
    }

    private get saveStateUrl(): string {
        const browserId = this.getBrowserId();
        if (!browserId) {
            throw new Error('É necessário identificar o usuário antes de acessar os save states.');
        }

        return `${environment.backendContext}savestate/${browserId}`;
    }

    private createParams(gameKey: string): HttpParams {
        return new HttpParams().set('gameKey', gameKey);
    }

    private isUuid(value: string): boolean {
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
    }
}