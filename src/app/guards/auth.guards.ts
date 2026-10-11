import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

import { AuthService } from '../services/auth.service';

export const accountGuard: CanActivateFn = (_route, state) => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (auth.isAuthenticated()) {
        return true;
    }

    if (auth.isGuest()) {
        return router.createUrlTree(['/arcade/n64']);
    }

    return router.createUrlTree(['/account'], { queryParams: { returnUrl: state.url } });
};

export const arcadeGuard: CanActivateFn = (_route, state) => {
    const auth = inject(AuthService);
    return auth.isAuthenticated() || auth.isGuest()
        ? true
        : inject(Router).createUrlTree(['/account'], { queryParams: { returnUrl: state.url } });
};

export const adminGuard: CanActivateFn = () => {
    const auth = inject(AuthService);
    return auth.isAdmin() ? true : inject(Router).createUrlTree(['/home']);
};

export const accountPageGuard: CanActivateFn = () => {
    const auth = inject(AuthService);
    if (auth.isAdmin()) {
        return inject(Router).createUrlTree(['/admin']);
    }

    return auth.isAuthenticated() || auth.isGuest()
        ? inject(Router).createUrlTree(['/arcade/n64'])
        : true;
};