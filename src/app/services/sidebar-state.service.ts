import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SidebarStateService {
    readonly isOpen = signal(this.getInitialState());

    toggle(): void {
        this.setOpen(!this.isOpen());
    }

    close(): void {
        this.setOpen(false);
    }

    closeOnMobile(): void {
        if (typeof window !== 'undefined' && window.matchMedia('(max-width: 820px)').matches) {
            this.close();
        }
    }

    private setOpen(open: boolean): void {
        this.isOpen.set(open);
        try {
            sessionStorage.setItem('necrowiki.sidebarOpen', String(open));
        } catch {
            // Keep the state in memory if storage is unavailable.
        }
    }

    private getInitialState(): boolean {
        try {
            const storedState = sessionStorage.getItem('necrowiki.sidebarOpen');
            if (storedState !== null) {
                return storedState === 'true';
            }
        } catch {
            // Fall back to viewport defaults.
        }

        return typeof window === 'undefined' || !window.matchMedia('(max-width: 820px)').matches;
    }
}