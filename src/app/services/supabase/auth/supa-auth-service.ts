import { inject, Injectable } from '@angular/core';
import { SUPABASE_CLIENT } from '../token/supabase.token';


@Injectable({
  providedIn: 'root',
})
export class SupaAuthService {
  private supabase = inject(SUPABASE_CLIENT);

  constructor() { }

  async login(email: string, pass: string) {
    return this.supabase.auth.signInWithPassword({
      email,
      password: pass
    });
  }

  async logOut() {
    try{
      const session = await this.getSession();
      const user = session?.user;

      return await this.supabase.auth.signOut().catch(()=>{
        console.warn("Se intenta cerrar la sesión de un usuario inexistente. No queda ninguna sesión activa.");
      });

    }catch(error){
      console.error('Error en logOut: ',error);
      throw error;
    }
  }

  // Metodo menos seguro: retorna la sesion local y refresca si hace falta.
  async getSession() {
    const { data } = await this.supabase.auth.getSession();
    return data.session;
  }

  // Retorna el usuario desde el servidor y sirve para validar auth real.
  async getUser() {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();
    return user;
  }
}
