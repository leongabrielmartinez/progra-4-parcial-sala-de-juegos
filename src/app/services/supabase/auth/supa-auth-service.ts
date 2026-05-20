import { inject, Injectable, signal } from '@angular/core';
import { SUPABASE_CLIENT } from '../token/supabase.token';

@Injectable({
  providedIn: 'root',
})
export class SupaAuthService {
  private supabase = inject(SUPABASE_CLIENT);

  currentUserSignal = signal<{ isLoggedIn: boolean; username: string }>({
    isLoggedIn: false,
    username: ''
  });

  constructor() {
    this.supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        this.loadExtendedUserData(session.user.id, session.user.email || 'Usuario');
      } else {
        this.currentUserSignal.set({
          isLoggedIn: false,
          username: ''
        });
      }
    });
  }

  private async loadExtendedUserData(userId: string, defaultEmail: string) {
    try {
      const userData = await this.getDataUser(userId);
      const fullName = userData ? `${userData.nombre} ${userData.apellido}` : defaultEmail;
      
      this.currentUserSignal.set({
        isLoggedIn: true,
        username: fullName
      });
    } catch (e) {
      this.currentUserSignal.set({
        isLoggedIn: true,
        username: defaultEmail
      });
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
      return await this.supabase.auth.signOut().catch(() => {
        console.warn("Se intenta cerrar la sesión de un usuario inexistente.");
      });
    } catch (error) {
      console.error('Error en logOut: ', error);
      throw error;
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
    const { data, error } = await this.supabase
      .from('usuarios')
      .select('nombre, apellido, edad')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error al traer datos complementarios:', error);
      return null;
    }
    return data;
  }
}