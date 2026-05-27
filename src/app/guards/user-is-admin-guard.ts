import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupaAuthService } from '../services/supabase/auth/supa-auth-service';
import { ModalAlertService } from '../services/modal-alert';

export const userIsAdminGuard: CanActivateFn = async (route, state) => {
  const authService = inject(SupaAuthService);
  const router = inject(Router);
  const modalAlertService = inject(ModalAlertService);

  // 1. Verificamos si hay una sesión activa de Supabase
  const session = await authService.getSession();

  if (!session) {
    modalAlertService.showAlert(
      'Acceso Denegado',
      'Debes iniciar sesión para acceder a esta sección.',
      'error'
    );
    router.navigate(['/login']);
    return false;
  }

  // 2. Traemos los datos extendidos del usuario (donde viene el rol) desde la base de datos
  const userData = await authService.getDataUser(session.user.id);

  // 3. Validamos si el rol es 'admin'
  if (userData && userData.rol === 'admin') {
    return true; // Acceso permitido
  }

  // 4. Si está logueado pero NO es administrador
  modalAlertService.showAlert(
    'Acceso Restringido',
    'No tienes los permisos necesarios (Admin) para ver esta sección.',
    'error'
  );
  
  router.navigate(['/home']);
  return false;
};