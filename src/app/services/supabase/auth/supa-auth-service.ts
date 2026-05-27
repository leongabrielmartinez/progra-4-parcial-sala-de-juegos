import { inject, Injectable, signal } from '@angular/core';
import { SUPABASE_CLIENT } from '../token/supabase.token';

@Injectable({
  providedIn: 'root',
})
export class SupaAuthService {
  private supabase = inject(SUPABASE_CLIENT);

  isLoadingSignal = signal<boolean>(true);

  currentUserSignal = signal<{ isLoggedIn: boolean; username: string; rol: string }>({
    isLoggedIn: false,
    username: '',
    rol: 'usuario' 
  });

  constructor() {
    this.initAuthListener();
  }

  private initAuthListener() {
    this.supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        this.loadExtendedUserData(session.user.id, session.user.email || 'Usuario');
      } else {
        this.currentUserSignal.set({
          isLoggedIn: false,
          username: '',
          rol: 'usuario' 
        });
        this.isLoadingSignal.set(false);
      }
    });
  }

  private async loadExtendedUserData(userId: string, defaultEmail: string) {
    this.isLoadingSignal.set(true); 
    
    try {
      const userData = await this.getDataUser(userId);
      
      const fullName = userData?.nombre && userData?.apellido 
        ? `${userData.nombre} ${userData.apellido}` 
        : defaultEmail;
      
      this.currentUserSignal.set({
        isLoggedIn: true,
        username: fullName,
        rol: userData?.rol || 'usuario' // <--- Esto capturará perfectamente el rol del JOIN
      });
    } catch (e) {
      console.error('Error crítico en loadExtendedUserData:', e);
      this.currentUserSignal.set({
        isLoggedIn: true,
        username: defaultEmail,
        rol: 'usuario'
      });
    } finally {
      this.isLoadingSignal.set(false);
    }
  }

  async login(email: string, pass: string) {
    return this.supabase.auth.signInWithPassword({
      email,
      password: pass
    });
  }

  async logOut() {
    try {
      this.isLoadingSignal.set(true);
      await this.supabase.auth.signOut();
    } catch (error) {
      console.error('Error en logOut: ', error);
    } finally {
      this.isLoadingSignal.set(false);
    }
  }

  async getSession() {
    const { data } = await this.supabase.auth.getSession();
    return data.session;
  }

  async getUser() {
    const { data: { user } } = await this.supabase.auth.getUser();
    return user;
  }

  async getDataUser(userId: string) {
    try {
      // 1. Buscamos de forma independiente los datos en la tabla 'usuarios'
      const userQuery = await this.supabase
        .from('usuarios')
        .select('nombre, apellido, edad')
        .eq('id', userId)
        .maybeSingle(); 

      // 2. Buscamos de forma independiente el rol en la tabla 'perfiles'
      const perfilQuery = await this.supabase
        .from('perfiles')
        .select('rol')
        .eq('id', userId)
        .maybeSingle();

      // Si ambas consultas fallan o tiran error de red, reportamos
      if (userQuery.error && perfilQuery.error) {
        console.error('Error al traer datos del usuario y perfil:', userQuery.error, perfilQuery.error);
        return null;
      }

      // 3. Unificamos las respuestas en un solo objeto plano y limpio para Angular
      return {
        nombre: userQuery.data?.nombre || '',
        apellido: userQuery.data?.apellido || '',
        edad: userQuery.data?.edad || null,
        rol: perfilQuery.data?.rol || 'usuario' 
      };

    } catch (err) {
      console.error('Error de red o conexión al buscar usuario:', err);
      return null;
    }
  }
}