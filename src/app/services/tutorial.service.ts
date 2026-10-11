import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { TutorialDocument, TutorialListItem } from '../models/tutorial.models';

@Injectable({ providedIn: 'root' })
export class TutorialService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = environment.backendContext;

    getTutorials(category: string | null, search = ''): Observable<TutorialListItem[]> {
        let params = new HttpParams();
        if (category) {
            params = params.set('category', category);
        }
        if (search.trim()) {
            params = params.set('q', search.trim());
        }

        return this.http.get<TutorialListItem[]>(`${this.apiUrl}tutorials`, { params });
    }

    getTutorial(slug: string): Observable<TutorialDocument> {
        return this.http.get<TutorialDocument>(`${this.apiUrl}tutorials/${encodeURIComponent(slug)}`);
    }

    getImage(slug: string, fileName: string): Observable<Blob> {
        return this.http.get(
            `${this.apiUrl}tutorials/${encodeURIComponent(slug)}/images/${encodeURIComponent(fileName)}`,
            { responseType: 'blob' }
        );
    }

    publishTutorial(payload: FormData): Observable<TutorialDocument> {
        return this.http.post<TutorialDocument>(`${this.apiUrl}tutorials`, payload);
    }

    updateTutorial(slug: string, payload: FormData): Observable<TutorialDocument> {
        return this.http.put<TutorialDocument>(`${this.apiUrl}tutorials/${encodeURIComponent(slug)}`, payload);
    }

    deleteTutorial(slug: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}tutorials/${encodeURIComponent(slug)}`);
    }

    imageBaseUrl(slug: string): string {
        return new URL(`tutorials/${encodeURIComponent(slug)}/`, this.apiUrl).toString();
    }
}