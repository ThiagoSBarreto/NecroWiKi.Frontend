import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DownloadService {

    constructor(
        private readonly http: HttpClient
    ) {
    }

    downloadUrl(gameName: string): string {
        return `${environment.backendContext}download/${gameName}`;
    }

    downloadGame(gameName: string): void {
        this.http.get(this.downloadUrl(gameName), { observe: 'response', responseType: 'blob' }).subscribe({
            next: response => {
                const blob = response.body;
                if (!blob) {
                    return;
                }

                const contentDisposition = response.headers.get('content-disposition');
                const fileName = contentDisposition?.match(/filename="?([^";]+)"?/i)?.[1] ?? `${gameName}.zip`;
                const objectUrl = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = objectUrl;
                link.download = fileName;
                document.body.append(link);
                link.click();
                link.remove();
                window.setTimeout(() => URL.revokeObjectURL(objectUrl), 100);
            },
            error: () => {
                // The HTTP interceptors report failures and handle expired sessions.
            }
        });
    }
}
