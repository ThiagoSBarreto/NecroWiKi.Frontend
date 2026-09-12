import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { ArcadeGame } from '../models/arcade.models/arcade.game.model';

interface BackendRomResponse {
    romName: string;
}

@Injectable({
    providedIn: 'root'
})
export class GameSystemService {

    constructor(
        private readonly http: HttpClient
    ) {
    }

    private normalizeSystem(system: string): string {
        return system === 'ps1' ? 'psx' : system;
    }

    getGameList(system: string): Observable<ArcadeGame[]> {
        const normalizedSystem = this.normalizeSystem(system);

        return this.http.get<BackendRomResponse[]>(
            `${environment.backendContext}gamesystem/${normalizedSystem}/roms`
        ).pipe(
            map((roms) => roms.map((rom) => ({
                romName: rom.romName,
                image: `${environment.backendContext}gamesystem/${normalizedSystem}/images/${rom.romName}.png`
            })))
        );
    }

    uploadGame(system: string, rom: ArcadeGame): Observable<ArcadeGame> {
        const normalizedSystem = this.normalizeSystem(system);

        return this.http.post<ArcadeGame>(
            `${environment.backendContext}gamesystem/${normalizedSystem}/roms`,
            rom
        );
    }
}