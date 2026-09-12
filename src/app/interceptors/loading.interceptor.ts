import { inject } from '@angular/core';
import {
    HttpErrorResponse,
    HttpInterceptorFn
} from '@angular/common/http';
import { catchError, finalize, throwError } from 'rxjs';

import { LoadingService } from '../services/loading.service';
import { ToastService } from '../services/toast.service';

export const loadingInterceptor: HttpInterceptorFn = (request, next) => {
    const loadingService = inject(LoadingService);
    const toastService = inject(ToastService);

    loadingService.beginRequest();

    return next(request).pipe(
        catchError((error: HttpErrorResponse) => {
            const detail = error?.error?.message ?? error.message ?? 'Não foi possível completar a requisição.';

            toastService.error('Erro de comunicação', detail);

            return throwError(() => error);
        }),
        finalize(() => loadingService.endRequest())
    );
};
