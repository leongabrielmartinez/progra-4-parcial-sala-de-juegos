import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupaAuthService } from '../services/supabase/auth/supa-auth-service';
import { ModalAlertService } from '../services/modal-alert';

export const userExistGuard: CanActivateFn = async (route, state) => {
  const authService = inject(SupaAuthService);
  const router = inject(Router);
  const modalAlertService = inject(ModalAlertService);

  const session = await authService.getSession();

  if (session) {
    modalAlertService.showAlert(
      'Sesión Activa',
      'Ya tienes una sesión iniciada. No es necesario volver a loguearte o registrarte.',
      'info' 
    );

    router.navigate(['/home']);
    
    return false; 
  }

  return true; 
};