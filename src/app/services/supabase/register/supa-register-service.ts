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
        password: payload.clave,
        options: {
          data: {
            first_name: payload.nombre,
            last_name: payload.apellido,
            age: payload.edad
          },
        },
      });

      if (authError) throw authError;
      if (!data.user) throw new Error('No se pudo obtener el identificador único del usuario creado.');

      // 2. Si Auth tuvo éxito, guardamos los datos requeridos por el TP en la tabla pública vinculándolos por su UUID
      const { error: dbError } = await this.supabase
        .from('usuarios') 
        .insert({
          id: data.user.id, // Relación exacta por UUID (Clave foránea a auth.users)
          nombre: payload.nombre,
          apellido: payload.apellido,
          edad: payload.edad
        });

      // Si la base de datos rechaza la inserción (ej: por la validación de edad), lanzamos error
      if (dbError) {
        console.error('Error al insertar perfil público en base de datos:', dbError);
        throw new Error('No se pudo registrar la información complementaria en la base de datos.');
      }

      return data;

    } catch (error: any) {
      // Re-lanzamos la excepción para que el componente del formulario capture el mensaje y lo muestre
      throw error;
    }
  }
}