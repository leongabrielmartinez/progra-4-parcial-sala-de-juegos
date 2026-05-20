import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SupaAuthService } from '../../services/supabase/auth/supa-auth-service';
import { ModalAlertService } from '../../services/modal-alert';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private supaAuthService = inject(SupaAuthService);
  private modalAlertService = inject(ModalAlertService);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    clave: ['', [Validators.required, Validators.minLength(6)]]
  });

  async onSubmit() {
    if (this.loginForm.valid) {
      const email = this.loginForm.value.email!;
      const clave = this.loginForm.value.clave!;

      try {
        console.log("ok");
        const { data, error } = await this.supaAuthService.login(email, clave);

        console.log("ok");
        if (error) {
          this.modalAlertService.showAlert(
            'Error de Autenticación', 
            'El correo o la contraseña son incorrectos.', 
            'error'
          );
          return; 
        }


        this.router.navigate(['/home']); 
      } catch (error: any) {

        this.modalAlertService.showAlert(
          'Error de Conexión', 
          'No se pudo conectar con el servidor de autenticación.', 
          'error'
        );
      }
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  quickLogin(perfil: 'jugador1' | 'jugador2' | 'admin') {
    const credenciales = {
      jugador1: { email: 'jugador1@test.com', clave: '123456' },
      jugador2: { email: 'jugador2@test.com', clave: '123456' },
      admin: { email: 'admin@test.com', clave: '123456' }
    };

    this.loginForm.patchValue({
      email: credenciales[perfil].email,
      clave: credenciales[perfil].clave
    });
  }
}