import { inject, Injectable, signal } from '@angular/core';
import { SUPABASE_CLIENT } from '../token/supabase.token';

@Injectable({
  providedIn: 'root',
})
export class SupaAuthService {
  private supabase = inject(SUPABASE_CLIENT);

  // Estado de loading inicializado en true
  isLoadingSignal = signal<boolean>(true);

  currentUserSignal = signal<{ isLoggedIn: boolean; username: string }>({
    isLoggedIn: false,
    username: ''
  });

  constructor() {
    this.initAuthListener();
  }

  private initAuthListener() {
    this.supabase.auth.onAuthStateChange((event, session) => {
      // Monitoreo en consola para saber qué evento está ocurriendo
      console.log(`Auth Event: ${event}`, session?.user?.email);

      if (session?.user) {
        // Ejecutamos la carga sin bloquear el callback principal
        this.loadExtendedUserData(session.user.id, session.user.email || 'Usuario');
      } else {
        this.currentUserSignal.set({
          isLoggedIn: false,
          username: ''
        });
        this.isLoadingSignal.set(false);
      }
    });
  }

  private async loadExtendedUserData(userId: string, defaultEmail: string) {
    this.isLoadingSignal.set(true); // Nos aseguramos de que esté en true al empezar
    
    try {
      const userData = await this.getDataUser(userId);
      
      // Si userData es null (por error o RLS), usamos el email por defecto
      const fullName = userData?.nombre && userData?.apellido 
        ? `${userData.nombre} ${userData.apellido}` 
        : defaultEmail;
      
      this.currentUserSignal.set({
        isLoggedIn: true,
        username: fullName
      });
    } catch (e) {
      console.error('Error crítico en loadExtendedUserData:', e);
      this.currentUserSignal.set({
        isLoggedIn: true,
        username: defaultEmail
      });
    } finally {
      // ESTE BLOQUE SIEMPRE SE EJECUTARÁ
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
      // Ponemos en carga mientras desloguea
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
      const { data, error } = await this.supabase
        .from('usuarios')
        .select('nombre, apellido, edad')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error en la consulta de usuarios (posible RLS):', error);
        return null;
      }
      return data;
    } catch (err) {
      console.error('Error de red o conexión al buscar usuario:', err);
      return null;
    }
  }
}