import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {

    private requestCount = 0;
    private readonly loadingSubject = new BehaviorSubject<boolean>(false);

    readonly loading$ = this.loadingSubject.asObservable();

    beginRequest(): void {
        this.requestCount++;

        if (this.requestCount === 1) {
            this.loadingSubject.next(true);
        }
    }

    endRequest(): void {
        this.requestCount = Math.max(this.requestCount - 1, 0);

        if (this.requestCount === 0) {
            this.loadingSubject.next(false);
        }
    }
}
