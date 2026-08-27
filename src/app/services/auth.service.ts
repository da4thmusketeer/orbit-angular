import { Injectable, signal, computed } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environments";
import { tap, catchError, of, Observable } from "rxjs";

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface GitHubAuthRequest {
  code: string;
  codeVerifier: string;
  redirectUri: string;
  intent: string;
}

export interface GoogleAuthRequest {
  code: string;
  intent: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface AuthResponse {
  success?: boolean;
  accessToken?: string;
  token?: string;
  message?: string;
  user?: any;
  [key: string]: any;
}

@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly apiBaseUrl = environment.API_BASE_URL;

  // Initialize access token from storage to preserve session across page reloads
  private readonly tokenSignal = signal<string | null>(this.getStoredToken());

  // Public readonly access token signal
  readonly accessToken = this.tokenSignal.asReadonly();

  // Computed authentication state
  readonly isLoggedIn = computed(() => !!this.tokenSignal());

  constructor(private http: HttpClient) {}

  private getStoredToken(): string | null {
    try {
      return localStorage.getItem("accessToken");
    } catch {
      return null;
    }
  }

  setAccessToken(token: string | null): void {
    this.tokenSignal.set(token);
    try {
      if (token) {
        localStorage.setItem("accessToken", token);
      } else {
        localStorage.removeItem("accessToken");
      }
    } catch (e) {
      console.error("Error updating token in storage", e);
    }
  }

  getAccessToken(): string | null {
    return this.tokenSignal();
  }

  private extractToken(response: any): string | null {
    if (!response) return null;
    return (
      response.accessToken ||
      response.access_token ||
      response.token ||
      response.data?.accessToken ||
      response.data?.access_token ||
      response.data?.token ||
      (response.user || response.success ? "authenticated-session" : null)
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiBaseUrl}/auth/register`, data, {
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          const token = this.extractToken(response);
          if (token) {
            this.setAccessToken(token);
          }
        })
      );
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiBaseUrl}/auth/login`, data, {
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          const token = this.extractToken(response);
          if (token) {
            this.setAccessToken(token);
          }
        })
      );
  }

  refresh(): Observable<AuthResponse | null> {
    return this.http
      .post<AuthResponse>(
        `${this.apiBaseUrl}/auth/refresh`,
        {},
        { withCredentials: true }
      )
      .pipe(
        tap((response) => {
          const token = this.extractToken(response);
          if (token) {
            this.setAccessToken(token);
          }
        }),
        catchError(() => {
          // Do not wipe an existing local token if refresh endpoint fails/isn't implemented
          return of(null);
        })
      );
  }

  logout(): Observable<any> {
    return this.http
      .post(
        `${this.apiBaseUrl}/auth/logout`,
        {},
        { withCredentials: true }
      )
      .pipe(
        tap(() => {
          this.setAccessToken(null);
        }),
        catchError(() => {
          this.setAccessToken(null);
          return of(null);
        })
      );
  }

  forgotPassword(data: ForgotPasswordRequest) {
    return this.http.post(
      `${this.apiBaseUrl}/auth/forgot-password`,
      data
    );
  }

  resetPassword(data: ResetPasswordRequest) {
    return this.http.post(
      `${this.apiBaseUrl}/auth/reset-password`,
      data
    );
  }
}
