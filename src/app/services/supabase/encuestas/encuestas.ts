import { inject, Injectable } from '@angular/core';
import { SUPABASE_CLIENT } from '../token/supabase.token';
import { SupaAuthService } from '../auth/supa-auth-service';
import { IEncuestaForm, IEncuestaDB } from '../../../models/encuesta';
@Injectable({
  providedIn: 'root',
})
export class EncuestasService {
  private supabase = inject(SUPABASE_CLIENT);
  private supabaseService = inject(SupaAuthService);


  async guardarEncuesta(datosEncuesta: IEncuestaForm): Promise<void> {
    const user = await this.supabaseService.getUser();
    if (!user || !user.email) {
      throw new Error('No se pudo verificar el usuario actual.');
    }

    const { error } = await this.supabase
      .from('encuestas')
      .insert([
        {
          usuario_email: user.email,
          nombre: datosEncuesta.nombre,
          apellido: datosEncuesta.apellido,
          edad: datosEncuesta.edad,
          telefono: datosEncuesta.telefono,
          fluidez: datosEncuesta.fluidez,
          juego_favorito: datosEncuesta.juegoFavorito, 
          recomienda: datosEncuesta.recomienda
        }
      ]);

    if (error) {
      throw new Error(`Error al guardar la encuesta: ${error.message}`);
    }
  }


  async consultarEncuestas(): Promise<IEncuestaDB[]> {
    const { data, error } = await this.supabase
      .from('encuestas')
      .select('*')
      .order('creado_en', { ascending: false });

    if (error) {
      throw new Error(`Error al consultar las encuestas: ${error.message}`);
    }

    // Forzamos el tipado seguro sobre la respuesta de Supabase
    return (data as IEncuestaDB[]) || [];
  }
}