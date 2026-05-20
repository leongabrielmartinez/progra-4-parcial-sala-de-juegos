import { Component, inject, computed } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SupaAuthService } from '../../../services/supabase/auth/supa-auth-service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private supabaseService = inject(SupaAuthService);
  private router = inject(Router);

  isLoggedIn = computed(() => this.supabaseService.currentUserSignal().isLoggedIn);
  username = computed(() => this.supabaseService.currentUserSignal().username);

  async logout() {
    try {
      await this.supabaseService.logOut();
    } catch (error) {
      console.error('Error al cerrar sesión desde el header:', error);
    }
  }
}