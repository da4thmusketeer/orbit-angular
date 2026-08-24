import { Component, Input } from "@angular/core";
import { GithubAuthService } from "../../services/github-auth.service";
import { GoogleAuthService } from "../../services/google-auth.service";

export type AuthIntent = "login" | "signup";

@Component({
  selector: "app-social-auth-buttons",
  standalone: true,
  templateUrl: "./social-auth-buttons.component.html",
  styleUrl: "./social-auth-buttons.component.css",
})
export class SocialAuthButtonsComponent {
  @Input({ required: true }) intent!: AuthIntent;

  constructor(
    private googleAuthService: GoogleAuthService,
    private githubAuthService: GithubAuthService,
  ) {}

  signInWithGoogle() {
    this.googleAuthService.begin(this.intent);
  }

  signInWithGitHub() {
    this.githubAuthService.begin(this.intent);
  }
}
