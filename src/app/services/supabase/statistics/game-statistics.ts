import { inject, Injectable } from '@angular/core';
import { SUPABASE_CLIENT } from '../token/supabase.token';
import { SupaAuthService } from '../auth/supa-auth-service';
import { ResultDataAhorcado } from '../../../models/games-data/ahorcado-data';
import { ResultDataMayorMenor } from '../../../models/games-data/mayor-menor-data';
import { ResultDataPreguntados } from '../../../models/games-data/preguntados-data';
import { ResultDataIntruso } from '../../../models/games-data/el-intruso-data';

@Injectable({
  providedIn: 'root',
})
export class GameStatistics {
  private supabase = inject(SUPABASE_CLIENT);
  private supabaseService = inject(SupaAuthService);

  async guardarPartidaAhorcado(partida: ResultDataAhorcado): Promise<void> {
    try {
      // 1. Obtenemos el ID del usuario directamente desde la sesión de Supabase
      const user = await this.supabaseService.getUser();
      if (!user) throw new Error('No se pudo verificar el usuario actual.');

      // 2. Leemos el valor del Signal de Auth en este instante preciso para sacar el nombre
      const fullName = this.supabaseService.currentUserSignal().username;

      // 3. Insertamos los datos limpios en la base de datos
      const { error } = await this.supabase
        .from('resultados_ahorcado')
        .insert([
          {
            user_id: user.id,
            nombre_completo: fullName,
            palabra: partida.palabra,
            gano: partida.gano,
            letras_acertadas: partida.letras_acertadas,
            letras_falladas: partida.letras_falladas,
            tiempo_gastado: partida.tiempo_utilizado,
            tiempo_sobrante: partida.tiempo_sobrante
          }
        ]);

      if (error) throw error;

    } catch (error) {
      console.error('Error al guardar estadísticas de Ahorcado:', error);
      throw error;
    }
  }

  async guardarPartidaMayorMenor(gameData: ResultDataMayorMenor): Promise<void> {
    try {
      const user = await this.supabaseService.getUser();
      if (!user) throw new Error('User session not found.');

      const fullName = this.supabaseService.currentUserSignal().username;

      const { error } = await this.supabase
        .from('resultados_mayor_menor') 
        .insert([
          {
            user_id: user.id,
            nombre_completo: fullName,
            cartas_acertadas: gameData.cards_guessed, 
            tiempo_utilizado: gameData.time_used, 
            gano: gameData.is_win
          }
        ]);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving Mayor Menor stats:', error);
      throw error;
    }
  }

  async guardarPartidaPreguntados(partida: ResultDataPreguntados): Promise<void> {
    try {
      // 1. Obtenemos el ID del usuario directamente desde la sesión de Supabase
      const user = await this.supabaseService.getUser();
      if (!user) throw new Error('No se pudo verificar el usuario actual.');

      // 2. Leemos el valor del Signal de Auth en este instante preciso para sacar el nombre
      const fullName = this.supabaseService.currentUserSignal().username;

      // 3. Insertamos los datos en la tabla correspondiente en Supabase
      const { error } = await this.supabase
        .from('resultados_preguntados') // <--- Asegúrate de crear esta tabla en Supabase
        .insert([
          {
            user_id: user.id,
            nombre_completo: fullName,
            total_preguntas: partida.total_preguntas,
            preguntas_acertadas: partida.preguntas_acertadas,
            preguntas_falladas: partida.preguntas_falladas,
            tiempo_utilizado: partida.tiempo_utilizado,
          }
        ]);

      if (error) throw error;

    } catch (error) {
      console.error('Error al guardar estadísticas de Preguntados:', error);
      throw error;
    }
  }

  async guardarPartidaIntruso(gameData: ResultDataIntruso): Promise<void> {
      try {
        // 1. Validar sesión del usuario autenticado
        const user = await this.supabaseService.getUser();
        if (!user) throw new Error('No se encontró una sesión de usuario válida.');

        // 2. Extraer el nombre de usuario del Signal reactivo
        const fullName = this.supabaseService.currentUserSignal().username;

        // 3. Insertar datos en la tabla correspondiente en Supabase
        const { error } = await this.supabase
          .from('resultados_intruso') // <--- Recuerda crear esta tabla en tu consola de Supabase
          .insert([
            {
              user_id: user.id,
              nombre_completo: fullName,
              nivel_alcanzado: gameData.nivel_alcanzado,
              gano: gameData.gano,
              clicks_incorrectos: gameData.clicks_incorrectos,
              tiempo_utilizado: gameData.tiempo_utilizado
            }
          ]);

        if (error) throw error;
      } catch (error) {
        console.error('Error al guardar estadísticas de El Intruso:', error);
        throw error;
      }
    }
}