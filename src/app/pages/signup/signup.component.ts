import { Component, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterLink, Router } from "@angular/router";
import { ToastService } from "../../services/toast.service";
import { SocialAuthButtonsComponent } from "../../components/social-auth-buttons/social-auth-buttons.component";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-signup",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SocialAuthButtonsComponent], //import modules here not services
  templateUrl: "./signup.component.html",
  styleUrl: "./signup.component.css",
})
export class SignupComponent {
  constructor(
    private toast: ToastService,
    private authService: AuthService,
    private router: Router,
  ) {}

  buttonText = signal("Create Account");

  fullName = "";
  email = "";
  password = "";
  showPassword = false;

  get isFormValid(): boolean {
    return (
      this.fullName.trim().length > 0 &&
      this.email.trim().length > 0 &&
      this.password.trim().length > 0
    );
  }

  onSubmit() {
    if (!this.isFormValid) {
      return;
    }

    this.buttonText.set("Creating Account...");
    this.authService
      .register({
        fullName: this.fullName,
        email: this.email,
        password: this.password,
      })
      .subscribe({
        next: (response: any) => {
          const isSuccessful = response && (response.success !== false);
          if (isSuccessful) {
            this.toast.success(`Account created successfully.`);
            this.router.navigate(["/home"]).then((navigated) => {
              if (!navigated) {
                this.buttonText.set("Create Account");
              }
            });
          } else {
            this.toast.error(response?.message || `Failed to create account.`);
            this.buttonText.set("Create Account");
          }
        },
        error: (error) => {
          console.error("Account creation failed", error);
          const errorMsg = error?.error?.message || `Failed to create account.`;
          this.toast.error(errorMsg);
          this.buttonText.set("Create Account");
        },
      });
  }
}
