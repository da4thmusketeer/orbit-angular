import { Component, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterLink, Router } from "@angular/router";
import { ToastService } from "../../services/toast.service";
import { SocialAuthButtonsComponent } from "../../components/social-auth-buttons/social-auth-buttons.component";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SocialAuthButtonsComponent],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css",
})
export class LoginComponent {

  constructor(
    private toast: ToastService,
    private authService: AuthService,
    private router: Router
  ) {}

  buttonText = signal("Sign In");

  email = "";
  password = "";
  //rememberMe = false;
  showPassword = false;

  get isFormValid(): boolean {
    return this.email.trim().length > 0 && this.password.trim().length > 0;
  }

  onSubmit() {
    if (!this.isFormValid) {
      return;
    }

    this.buttonText.set("Signing In...");
    this.authService.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: (response: any) => {
        // Backend HTTP 2xx response
        const isSuccessful = response && (response.success !== false);
        if (isSuccessful) {
          this.toast.success(`Signed in successfully.`);
          this.router.navigate(['/home']).then((navigated) => {
            if (!navigated) {
              this.buttonText.set("Sign In");
            }
          });
        } else {
          this.toast.error(response?.message || `Failed to sign in.`);
          this.buttonText.set("Sign In");
        }
      },
      error: (error) => {
        const errorMsg = error?.error?.message || `Failed to sign in.`;
        this.toast.error(errorMsg);
        this.buttonText.set("Sign In");
      }
    });
  }
}
