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

      if (session?.user) {
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
    this.isLoadingSignal.set(true); 
    
    try {
      const userData = await this.getDataUser(userId);
      
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