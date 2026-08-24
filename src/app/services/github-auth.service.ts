import { Injectable } from "@angular/core";
import { environment } from "../environments/environments";


type AuthIntent = "login" | "signup";


@Injectable({ providedIn: "root" })
export class GithubAuthService {
    private readonly clientId = environment.GITHUB_CLIENT_ID;
    private readonly redirectUri = environment.GITHUB_REDIRECT_URI;


  // Begin the GitHub OAuth flow by redirecting the user to GitHub's authorization page.
  async begin(intent: AuthIntent) {
    const state = crypto.randomUUID();
    const verifier = this.base64Url(crypto.getRandomValues(new Uint8Array(32)));
    const challenge = await this.sha256(verifier);

    sessionStorage.setItem("github_oauth_state", state);
    sessionStorage.setItem("github_oauth_verifier", verifier);
    sessionStorage.setItem("github_oauth_intent", intent);

    const query = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: "read:user user:email",
      state,
      code_challenge: challenge, 
      code_challenge_method: "S256",
    });

    window.location.assign(`https://github.com/login/oauth/authorize?${query}`);
  }

  private async sha256(value: string): Promise<string> {
    const bytes = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return this.base64Url(new Uint8Array(digest));
  }

  private base64Url(bytes: Uint8Array): string {
    return btoa(String.fromCharCode(...bytes))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }
}
