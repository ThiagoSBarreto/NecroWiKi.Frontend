import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DownloadService {

    downloadUrl(gameName: string): string {
        return `${environment.backendContext}download/${gameName}`;
    }
}
