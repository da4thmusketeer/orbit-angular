import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterLink, Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";

type SettingsTab = "profile" | "workspace" | "notifications" | "security";

@Component({
  selector: "app-settings",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: "./settings.component.html",
  styleUrl: "./settings.component.css",
})
export class SettingsComponent {
  activeTab: SettingsTab = "profile";
  saved = false;
  profile = {
    name: "Alex Morgan",
    email: "alex@orbit.studio",
    role: "Product designer",
    timezone: "GMT+00:00",
  };
  workspaceName = "Orbit Studio";
  workspaceUrl = "orbit-studio";
  emailUpdates = true;
  mentionAlerts = true;
  weeklyDigest = false;
  compactMode = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  selectTab(tab: SettingsTab) {
    this.activeTab = tab;
    this.saved = false;
  }
  saveChanges() {
    this.saved = true;
    setTimeout(() => (this.saved = false), 2600);
  }

  onLogout() {
    this.authService.logout().subscribe({
      next: () => {
        this.authService.setAccessToken(null);
        this.router.navigate(["/login"]);
      },
      error: (error) => {
        this.authService.setAccessToken(null);
        this.router.navigate(["/login"]);
      },
    });
  }
}
