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
        // The next block checks if the HTTP call is successful and performs the next actions accordingly. 
        // It does not care what the response is, it just checks if the call was successful or not. 
        // So if the HTTP response is 2xx and the response from the server is { success: false }, it will still be considered a successful call and will navigate to the home page.
        // The actual response check from the server should be done in the frontend code.
        next: (response:any) => {

          // this block checks if the response is successful ie. {success:true} and navigates to the home page if it is. If not, it shows an error message.
          console.log("Success Response from server:", response.success);
          if (response && response.success) {
          this.toast.success(`Account created successfully.`);
          this.router.navigate(["/home"]);
          } 
        },
        error: (error) => { 
          console.error("Account creation failed", error);
          console.error("Error details:", error.error.message);
          this.toast.error(`Failed to create account. ${error.error.message}`);
          this.buttonText.set("Create Account");
        },
      });
  }
}
