export interface HistorialGlobalJugador {
  nombre_completo: string;
  juego: 'Ahorcado' | 'Mayor o Menor' | 'Preguntados' | 'El Intruso';
  resultadoPrincipal: string; // Ej: "Ganó (Palabra)", "7 Cartas", "8/10 Aciertos"
  tiempo_utilizado: number;   // En segundos
  fecha: string;
  puntajeCalculado: number;   // Métrica unificada para ordenar de mejor a peor
}