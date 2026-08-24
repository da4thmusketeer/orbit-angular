import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../environments/environments";
import { Router } from "@angular/router";
import { ToastService } from "./toast.service";

declare const google: any;

type AuthIntent = "login" | "signup";

@Injectable({ providedIn: "root" })
export class GoogleAuthService {
  private codeClient: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private toast: ToastService
  ) {}

  begin(intent: AuthIntent) {
    // Initialize the client only once
    if (!this.codeClient) {
      this.codeClient = google.accounts.oauth2.initCodeClient({
        client_id: environment.GOOGLE_CLIENT_ID,
        scope: "openid profile email",
        ux_mode: "popup",
        callback: (response: any) => {
          if (response.code) {
            this.sendAuthCodeToBackend(response.code, intent);
          }
        },
      });
    }

    // Trigger the popup
    this.codeClient.requestCode();
  }

  private sendAuthCodeToBackend(code: string, intent: AuthIntent) {
    return this.http
      .post(
        `${environment.API_BASE_URL}/auth/oauth/google`,
        { code, intent }, // Replaced idToken with code
        { withCredentials: true },
      )
      .subscribe({
        next: () => {
          this.router.navigate(["/home"]);
          this.toast.success("Signed in successfully.");

        },
        error: (error) => console.error("Google authentication failed", error),
      });
  }
}
