import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

type SettingsTab = 'profile' | 'workspace' | 'notifications' | 'security';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  activeTab: SettingsTab = 'profile';
  saved = false;
  profile = { name: 'Alex Morgan', email: 'alex@orbit.studio', role: 'Product designer', timezone: 'GMT+00:00' };
  workspaceName = 'Orbit Studio';
  workspaceUrl = 'orbit-studio';
  emailUpdates = true;
  mentionAlerts = true;
  weeklyDigest = false;
  compactMode = false;

  selectTab(tab: SettingsTab) { this.activeTab = tab; this.saved = false; }
  saveChanges() { this.saved = true; setTimeout(() => this.saved = false, 2600); }
}
