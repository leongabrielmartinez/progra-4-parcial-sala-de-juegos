import { Message } from './../../../../node_modules/@supabase/phoenix/priv/static/types/types.d';
import { UserRegisterPayload } from './../../models/gamer-user';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SupaRegisterService } from '../../services/supabase/register/supa-register-service';
import { SupaAuthService } from '../../services/supabase/auth/supa-auth-service';
import { ModalAlertService } from '../../services/modal-alert';

@Component({
  selector: 'app-registro',
  standalone: true,
  // LIMPIEZA: Quitamos ModalMessage de acá, el HTML ya no requiere conocerlo
  imports: [ReactiveFormsModule, RouterLink], 
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private supabaseRegisterService = inject(SupaRegisterService);
  private supabaseAuthService = inject(SupaAuthService);
  private modalAlertService = inject(ModalAlertService);

  errorMessage: string = '';

  registroForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellido: ['', [Validators.required, Validators.minLength(2)]],
    edad: ['', [Validators.required, Validators.min(18), Validators.max(99)]],
    clave: ['', [Validators.required, Validators.minLength(6)]]
  });

  async registerUser() {
    if (this.registroForm.valid) {
      this.errorMessage = ''; 

      const payload: UserRegisterPayload = {
        nombre: this.registroForm.value.nombre!,
        apellido: this.registroForm.value.apellido!,
        edad: Number(this.registroForm.value.edad), 
        email: this.registroForm.value.email!,
        clave: this.registroForm.value.clave!
      };

      try {
        await this.supabaseRegisterService.signUp(payload);
        await this.supabaseAuthService.login(payload.email, payload.clave);
        this.router.navigate(['/home']);
        
      } catch (error: any) {
        // Al llamarse aquí, el CDK creará e inyectará el componente automáticamente en pantalla
        
        if(error.message === "User already registered"){
          error.message = "La cuenta de este gmail ya se encuentra registrada";
        }

        this.modalAlertService.showAlert(
          'Error de Registro', 
          error.message || 'No se pudo crear la cuenta.', 
          'error'
        );      
      }
    } else {
      this.registroForm.markAllAsTouched();
    }
  }
}