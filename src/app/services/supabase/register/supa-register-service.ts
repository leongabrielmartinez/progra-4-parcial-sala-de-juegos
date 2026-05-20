import { inject, Injectable } from '@angular/core';
import { SUPABASE_CLIENT } from '../token/supabase.token';
import { UserRegisterPayload } from '../../../models/gamer-user';



@Injectable({
  providedIn: 'root',
})
export class SupaRegisterService {
  private supabase = inject(SUPABASE_CLIENT);

  async signUp(payload: UserRegisterPayload) {
    try {

      const { data, error: authError } = await this.supabase.auth.signUp({
        email: payload.email,
        password: payload.password
      });

      if (authError) throw authError;
      if (!data.user) throw new Error('No se pudo obtener el identificador único del usuario creado.');

      // Guardamos la información del perfil en la tabla usuarios
      const { error: dbError } = await this.supabase
        .from('usuarios') 
        .insert({
          id: data.user.id, 
          nombre: payload.name,
          apellido: payload.lastName,
          edad: payload.age
        });

      if (dbError) {
        console.error('Error al insertar perfil público en base de datos:', dbError);
        throw new Error('No se pudo registrar la información complementaria en la base de datos.');
      }

      return data;

    } catch (error: any) {
      throw error;
    }
  }
}