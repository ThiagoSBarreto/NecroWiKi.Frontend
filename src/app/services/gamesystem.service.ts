import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { ArcadeGameModel } from '../models/arcade.models/arcade.game.model';

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
}