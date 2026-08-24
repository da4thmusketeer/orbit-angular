import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink, Router, ActivatedRoute } from "@angular/router";
import { ToastService } from "../../services/toast.service";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-reset-password",
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: "./reset-password.component.html",
  styleUrl: "./reset-password.component.css",
})
export class ResetPasswordComponent implements OnInit {
  password = "";
  confirmPassword = "";
  token = "";
  showPassword = false;

  constructor(
    private toast: ToastService,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.token = params["token"] || "";
    });
  }

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      this.toast.error("Passwords do not match.");
      return;
    }

    this.authService
      .resetPassword({
        newPassword: this.password,
        token: this.token,
      })
      .subscribe({
        next: (response:any) => {
          if (response && response.success) {
          this.toast.success("Password reset successfully.");
          this.router.navigate(["/login"]);
          }
        },
        error: () => {
          this.toast.error("Failed to reset password.");
        },
      });
  }
}
