import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environments";

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

@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly apiBaseUrl = environment.API_BASE_URL;

  constructor(
    private http: HttpClient,
  ) {}

  register(data: RegisterRequest) {
    return this.http.post(`${environment.API_BASE_URL}/auth/register`, data);
  }

  login(data: LoginRequest) {
    return this.http.post(`${environment.API_BASE_URL}/auth/login`, data);
  }

  forgotPassword(data: ForgotPasswordRequest) {
    return this.http.post(
      `${environment.API_BASE_URL}/auth/forgot-password`,
      data,
    );
  }

  resetPassword(data: ResetPasswordRequest) {
    return this.http.post(
      `${environment.API_BASE_URL}/auth/reset-password`,
      data,
    );
  }
}
