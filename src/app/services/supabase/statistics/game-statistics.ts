import { inject, Injectable } from '@angular/core';
import { SUPABASE_CLIENT } from '../token/supabase.token';
import { SupaAuthService } from '../auth/supa-auth-service';
import { ResultDataAhorcado } from '../../../models/games-data/ahorcado-data';
import { ResultDataMayorMenor } from '../../../models/games-data/mayor-menor-data';
import { ResultDataPreguntados } from '../../../models/games-data/preguntados-data';
import { ResultDataIntruso } from '../../../models/games-data/el-intruso-data';
import { HistorialGlobalJugador } from '../../../models/global-results';

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



    /**
   * Obtiene todos los resultados de los 4 juegos en paralelo, homologa los datos
   * y los ordena de mejor desempeño (mayor puntaje simulado) a peor.
   */
  async obtenerRankingGlobal(): Promise<HistorialGlobalJugador[]> {
    try {
      // 1. Descarga asíncrona concurrente de las 4 fuentes de datos de Supabase
      const [ahorcadoRes, mayorMenorRes, preguntadosRes, intrusoRes] = await Promise.all([
        this.supabase.from('resultados_ahorcado').select('*'),
        this.supabase.from('resultados_mayor_menor').select('*'),
        this.supabase.from('resultados_preguntados').select('*'),
        this.supabase.from('resultados_intruso').select('*')
      ]);

      // Control de errores de base de datos
      if (ahorcadoRes.error) throw ahorcadoRes.error;
      if (mayorMenorRes.error) throw mayorMenorRes.error;
      if (preguntadosRes.error) throw preguntadosRes.error;
      if (intrusoRes.error) throw intrusoRes.error;

      const listaFormateada: HistorialGlobalJugador[] = [];

      // 2. Mapear datos de Ahorcado
      ahorcadoRes.data?.forEach(p => {
        const puntos = p.gano ? (500 + (p.tiempo_sobrante * 5) - (p.letras_falladas * 20)) : (p.letras_acertadas * 30);
        listaFormateada.push({
          nombre_completo: p.nombre_completo || 'Usuario Anónimo',
          juego: 'Ahorcado',
          resultadoPrincipal: p.gano ? `Ganó (${p.palabra})` : `Perdió (${p.palabra})`,
          tiempo_utilizado: p.tiempo_gastado,
          fecha: p.fecha_partida || p.created_at,
          puntajeCalculado: Math.max(0, puntos)
        });
      });

      // 3. Mapear datos de Mayor o Menor
      mayorMenorRes.data?.forEach(p => {
        const puntos = p.cartas_acertadas * 150;
        listaFormateada.push({
          nombre_completo: p.nombre_completo || 'Usuario Anónimo',
          juego: 'Mayor o Menor',
          resultadoPrincipal: `${p.cartas_acertadas} cartas`,
          tiempo_utilizado: p.tiempo_utilizado,
          fecha: p.fecha_partida || p.created_at,
          puntajeCalculado: puntos
        });
      });

      // 4. Mapear datos de Preguntados
      preguntadosRes.data?.forEach(p => {
        // Cada respuesta vale 200 puntos, penaliza un poco el exceso de tiempo empleado
        const puntos = (p.preguntas_acertadas * 200) - Math.floor(p.tiempo_utilizado * 0.5);
        listaFormateada.push({
          nombre_completo: p.nombre_completo || 'Usuario Anónimo',
          juego: 'Preguntados',
          resultadoPrincipal: `${p.preguntas_acertadas}/${p.total_preguntas} aciertos`,
          tiempo_utilizado: p.tiempo_utilizado,
          fecha: p.fecha_partida || p.created_at,
          puntajeCalculado: Math.max(0, puntos)
        });
      });

      // 5. Mapear datos de El Intruso
      intrusoRes.data?.forEach(p => {
        // Puntos por nivel alcanzado + bonus por victoria absoluta - penalización de tiempo
        const puntos = (p.nivel_alcanzado * 150) + (p.gano ? 500 : 0) - Math.floor(p.tiempo_utilizado * 0.8);
        listaFormateada.push({
          nombre_completo: p.nombre_completo || 'Usuario Anónimo',
          juego: 'El Intruso',
          resultadoPrincipal: p.gano ? 'Victoria Absoluta' : `Nivel ${p.nivel_alcanzado}`,
          tiempo_utilizado: p.tiempo_utilizado,
          fecha: p.fecha_partida || p.created_at,
          puntajeCalculado: Math.max(0, puntos)
        });
      });

      // 6. ORDENACIÓN EFICIENTE: Ordena de mayor rendimiento a menor
      return listaFormateada.sort((a, b) => b.puntajeCalculado - a.puntajeCalculado);

    } catch (error) {
      console.error('Error al compilar el Ranking Global unificado:', error);
      return [];
    }
  }
}