import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { environment } from "src/app/environments/environments";
import { ToastService } from "../../services/toast.service";
import { AuthService } from "../../services/auth.service";

@Component({
  standalone: true,
  template: `
    <main class="callback-page" aria-live="polite">
      <section class="callback-card">
        <div class="orbit-mark" aria-hidden="true"><span></span></div>
        <div>
          <p class="eyebrow">AUTHENTICATING</p>
          <h1>Completing GitHub sign-in<span class="dots">&hellip;</span></h1>
          <p class="helper-text">Just a moment while we securely connect your account.</p>
        </div>
        <div class="progress" aria-hidden="true"><span></span></div>
      </section>
    </main>
  `,
  styles: [`
    :host { display: block; min-height: 100vh; color: #20211e; font-family: 'Manrope', sans-serif; }
    .callback-page { min-height: 100vh; display: grid; place-items: center; padding: 24px; background: #f6f4ee; }
    .callback-card { width: min(100%, 420px); padding: 36px; background: #fff; border: 1px solid #20211e; border-radius: 16px; box-shadow: 7px 7px 0 #20211e; }
    .orbit-mark { width: 30px; height: 30px; margin-bottom: 28px; position: relative; border-radius: 50% 50% 50% 4px; background: #20211e; transform: rotate(-45deg); }
    .orbit-mark span { position: absolute; top: 6px; left: 6px; width: 10px; height: 10px; border-radius: 50%; background: #d7fb66; }
    .eyebrow { margin: 0 0 8px; color: #65665f; font: 500 11px 'DM Mono', monospace; letter-spacing: .08em; }
    h1 { margin: 0; font-size: 27px; line-height: 1.15; letter-spacing: -.05em; }
    .dots { animation: blink 1.1s steps(2, end) infinite; }
    .helper-text { margin: 10px 0 28px; color: #595a53; font-size: 13px; line-height: 1.5; }
    .progress { height: 3px; overflow: hidden; border-radius: 100px; background: #e8e6df; }
    .progress span { display: block; width: 42%; height: 100%; border-radius: inherit; background: #aea0ff; animation: loading 1.2s ease-in-out infinite; }
    @keyframes loading { 0% { transform: translateX(-110%); } 100% { transform: translateX(350%); } }
    @keyframes blink { 50% { opacity: .35; } }
    @media (max-width: 480px) { .callback-card { padding: 30px 24px; box-shadow: 5px 5px 0 #20211e; } }
  `],
})
export class GithubCallbackComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private router: Router,
    private toast: ToastService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");

    const expectedState = sessionStorage.getItem("github_oauth_state");
    const codeVerifier = sessionStorage.getItem("github_oauth_verifier");
    const intent = sessionStorage.getItem("github_oauth_intent");

    if (!code || !state || state !== expectedState || !codeVerifier) {
      this.router.navigateByUrl("/login");
      return;
    }

    this.http
      .post(
        `${environment.API_BASE_URL}/auth/oauth/github`,
        {
          code,
          codeVerifier,
          redirectUri: `${environment.FRONTEND_BASE_URL}/auth/github/callback`,
          intent,
        },
        { withCredentials: true }
      )
      .subscribe({
        next: (response: any) => {
          sessionStorage.removeItem("github_oauth_state");
          sessionStorage.removeItem("github_oauth_verifier");
          sessionStorage.removeItem("github_oauth_intent");

          // Extract token robustly across snake_case, camelCase, nested data, or session response
          const token =
            response?.accessToken ||
            response?.access_token ||
            response?.token ||
            response?.data?.accessToken ||
            response?.data?.access_token ||
            response?.data?.token ||
            (response?.user || response?.success ? "authenticated-session" : null);

          if (token) {
            this.authService.setAccessToken(token);
          }

          this.router.navigate(["/home"]).then((navigated) => {
            if (navigated) {
              this.toast.success("Signed in successfully.");
            } else {
              console.warn("Navigation to /home was blocked by authGuard.");
              this.toast.error("Authentication check failed. Please log in.");
              this.router.navigate(["/login"]);
            }
          });
        },
        error: (error) => {
          console.error("GitHub auth callback error:", error);
          this.toast.error(error?.error?.message || "GitHub sign in failed.");
          this.router.navigateByUrl("/login");
        },
      });
  }
}
