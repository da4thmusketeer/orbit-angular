import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../environments/environments';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getAccessToken();

  let modifiedReq = req;

  // Ensure withCredentials: true for requests to API_BASE_URL
  if (req.url.startsWith(environment.API_BASE_URL)) {
    modifiedReq = modifiedReq.clone({
      withCredentials: true,
    });
  }

  // Attach Bearer token if present in memory
  if (token && !req.headers.has('Authorization')) {
    modifiedReq = modifiedReq.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      const isAuthEndpoint =
        req.url.includes('/auth/login') ||
        req.url.includes('/auth/register') ||
        req.url.includes('/auth/refresh');

      if (error.status === 401 && !isAuthEndpoint) {
        return authService.refresh().pipe(
          switchMap((refreshResult) => {
            if (refreshResult) {
              const newToken = authService.getAccessToken();
              const retriedReq = req.clone({
                withCredentials: true,
                setHeaders: {
                  Authorization: `Bearer ${newToken}`,
                },
              });
              return next(retriedReq);
            }
            return throwError(() => error);
          })
        );
      }

      return throwError(() => error);
    })
  );
};
