import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { environment } from "src/app/environments/environments";
import {ToastService} from "../../services/toast.service";

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
    private toast: ToastService
  ) {}

 //Upon page initialization, this method retrieves the authorization code and state from the URL parameters, validates them against the expected values stored in sessionStorage, and then sends a POST request to the backend to exchange the code for an access token. If successful, it navigates to the home page; otherwise, it redirects to the login page.
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
    
    //console.log("GitHub OAuth callback received. Exchanging code for token and sending to backend for token exchange.");

    // Send the authorization code and code verifier to the backend for token exchange
    this.http
      .post(
        `${environment.API_BASE_URL}/auth/oauth/github`,
        {
          code,
          codeVerifier,
          redirectUri: `${environment.FRONTEND_BASE_URL}/auth/github/callback`,
          intent,
        },
        { withCredentials: true },
      )
      .subscribe({  // subscribe means to listen for the response
        next: () => { // if successful, navigate to home page
          sessionStorage.removeItem("github_oauth_state");
          sessionStorage.removeItem("github_oauth_verifier");
          sessionStorage.removeItem("github_oauth_intent");
          this.router.navigateByUrl("/home");
          this.toast.success("Signed in successfully.");
        },
        // if error, navigate to login page
        error: () => this.router.navigateByUrl("/login"),
      });
  }
}
