import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupaAuthService } from '../services/supabase/auth/supa-auth-service';
import { ModalAlertService } from '../services/modal-alert';

export const userNotExistGuard: CanActivateFn = async (route, state) => {
  const authService = inject(SupaAuthService);
  const router = inject(Router);
  const modalAlertService = inject(ModalAlertService);

  const session = await authService.getSession();

  if (!session) {
    modalAlertService.showAlert(
      'Sesión no encontrada',
      'Debes registrarte o iniciar sessión para acceder a esta sección.',
      'info' 
    );

    router.navigate(['/home']);
    
    return false; 
  }

  return true; 
};