import { Message } from './../../../../node_modules/@supabase/phoenix/priv/static/types/types.d';
import { UserRegisterPayload } from './../../models/gamer-user';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SupaRegisterService } from '../../services/supabase/register/supa-register-service';
import { SupaAuthService } from '../../services/supabase/auth/supa-auth-service';
import { ModalAlertService } from '../../services/modal-alert';
import { last } from 'rxjs';

@Component({
  selector: 'app-registro',
  standalone: true,
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
    name: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    age: ['', [Validators.required, Validators.min(18), Validators.max(99)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  async registerUser() {
    if (this.registroForm.valid) {
      this.errorMessage = ''; 

      const payload: UserRegisterPayload = {
        name: this.registroForm.value.name!,
        lastName: this.registroForm.value.lastName!,
        age: Number(this.registroForm.value.age), 
        email: this.registroForm.value.email!,
        password: this.registroForm.value.password!
      };

      try {
        await this.supabaseRegisterService.signUp(payload);
        await this.supabaseAuthService.login(payload.email, payload.password);
        this.router.navigate(['/home']);
        
      } catch (error: any) {
        
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