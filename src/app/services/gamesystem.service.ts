import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { ArcadeGameModel } from '../models/arcade.models/arcade.game.model';

export interface ApiMessageResponse {
    message: string;
}

@Injectable({
    providedIn: 'root'
})
export class GameSystemService {

    constructor(
        private readonly http: HttpClient
    ) {
    }

    getGameList(system: string): Observable<ArcadeGameModel[]> {
        return this.http.get<ArcadeGameModel[]>(`${environment.backendContext}gamesystem/${system}/roms`);
    }

    uploadGame(system: string, payload: FormData): Observable<HttpEvent<ApiMessageResponse>> {
        return this.http.post<ApiMessageResponse>(
            `${environment.backendContext}gamesystem/${system}/upload`,
            payload,
            { observe: 'events', reportProgress: true }
        );
    }

    updateGame(system: string, currentName: string, payload: FormData): Observable<HttpEvent<ApiMessageResponse>> {
        return this.http.put<ApiMessageResponse>(
            `${environment.backendContext}gamesystem/${system}/roms/${encodeURIComponent(currentName)}`,
            payload,
            { observe: 'events', reportProgress: true }
        );
    }

    getRomUrl(romPath: string): string {
        return new URL(romPath, environment.backendContext).toString();
    }
}