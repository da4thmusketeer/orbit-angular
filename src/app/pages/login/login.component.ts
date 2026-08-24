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
        if (response && response.success) {
          this.toast.success(`Signed in successfully.`);
          this.router.navigate(['/home']);
        }
      },
      error: (error) => {
        this.toast.error(`Failed to sign in.`);
        this.buttonText.set("Sign In");
      }
    });
  }
}
