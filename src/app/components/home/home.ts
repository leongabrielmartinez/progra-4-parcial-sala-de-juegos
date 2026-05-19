import { Component, inject } from '@angular/core';
import { SupaAuthService } from '../../services/supabase/auth/supa-auth-service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private supabaseService = inject(SupaAuthService);

  async testSesion() {
        const { data, error } = await this.supabaseService.login("testing@gmail.com", "123456");

        if (error) {
          console.error('Error de inicio de sesion:', error.message);
          return;
        }

        const user = await this.supabaseService.getUser();
        console.log(user);

  }
}
