import { Component, OnDestroy } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { ToastService } from "../../services/toast.service";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-forgot-password",
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: "./forgot-password.component.html",
  styleUrl: "./forgot-password.component.css",
})
export class ForgotPasswordComponent implements OnDestroy {
  private readonly cooldownScheduleSeconds = [45, 60, 90, 120];
  private cooldownTimer: number | null = null;

  email = "";
  sent = false;
  isSubmitting = false;
  cooldownRemainingSeconds = 0;
  successfulSendCount = 0;

  constructor(
    private toast: ToastService,
    private authService: AuthService,
  ) {}

  onSubmit() {
    if (this.isSubmitting || this.cooldownRemainingSeconds > 0) {
      return;
    }

    const email = this.email.trim();

    if (!email) {
      this.toast.error(`Enter your email address first.`);
      return;
    }

    this.isSubmitting = true;
    this.authService.forgotPassword({ email }).subscribe({
      next: () => {
        this.sent = true;
        this.successfulSendCount += 1;
        this.toast.success(`Reset instructions sent to your email.`);
        this.startCooldown();
        this.isSubmitting = false;
      },
      error: () => {
        this.toast.error(`Failed to send reset instructions.`);
        this.isSubmitting = false;
      },
    });
  }

  get canResend() {
    return (
      this.sent && this.cooldownRemainingSeconds === 0 && !this.isSubmitting
    );
  }

  get cooldownLabel() {
    return this.formatCountdown(this.cooldownRemainingSeconds);
  }

  get submitButtonLabel() {
    if (this.isSubmitting) {
      return "Sending...";
    }

    if (this.sent) {
      return this.canResend
        ? "Resend reset link"
        : `Resend in ${this.cooldownLabel}`;
    }

    return "Send reset link ";
  }

  ngOnDestroy() {
    this.stopCooldown();
  }

  private startCooldown() {
    this.stopCooldown();

    this.cooldownRemainingSeconds = this.getNextCooldownSeconds();

    if (this.cooldownRemainingSeconds === 0) {
      return;
    }

    this.cooldownTimer = window.setInterval(() => {
      if (this.cooldownRemainingSeconds <= 1) {
        this.stopCooldown();
        this.cooldownRemainingSeconds = 0;
        return;
      }

      this.cooldownRemainingSeconds -= 1;
    }, 1000);
  }

  private stopCooldown() {
    if (this.cooldownTimer !== null) {
      window.clearInterval(this.cooldownTimer);
      this.cooldownTimer = null;
    }
  }

  private getNextCooldownSeconds() {
    const index = Math.min(
      this.successfulSendCount - 1,
      this.cooldownScheduleSeconds.length - 1,
    );

    return this.cooldownScheduleSeconds[index] ?? 0;
  }

  private formatCountdown(totalSeconds: number) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }
}
