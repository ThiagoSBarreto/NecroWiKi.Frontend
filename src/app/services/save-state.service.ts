import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SaveStateService {
    private readonly http = inject(HttpClient);

    save(accountId: string, gameKey: string, state: Uint8Array): Observable<void> {
        return this.http.put<void>(
            this.saveStateUrl(accountId),
            new Blob([new Uint8Array(state).buffer], { type: 'application/octet-stream' }),
            { params: this.createParams(gameKey) }
        );
    }

    load(accountId: string, gameKey: string): Observable<ArrayBuffer> {
        return this.http.get(this.saveStateUrl(accountId), {
            params: this.createParams(gameKey),
            responseType: 'arraybuffer'
        });
    }

    private saveStateUrl(accountId: string): string {
        if (!this.isUuid(accountId)) {
            throw new Error('É necessário entrar em uma conta para acessar os save states.');
        }

        return `${environment.backendContext}savestate/${accountId}`;
    }

    private createParams(gameKey: string): HttpParams {
        return new HttpParams().set('gameKey', gameKey);
    }

    private isUuid(value: string): boolean {
        return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
    }
}