
export interface IEncuestaForm {
  nombre: string;
  apellido: string;
  edad: number;
  telefono: string;
  fluidez: string;
  juegoFavorito: string;
  recomienda: string;
}

export interface IEncuestaDB {
  id: number;
  usuario_email: string;
  nombre: string;
  apellido: string;
  edad: number;
  telefono: string;
  fluidez: 'excelente' | 'buena' | 'mala'; 
  juego_favorito: 'ahorcado' | 'mayor-menor' | 'preguntados' | 'propio';
  recomienda: 'si' | 'no';
  creado_en: string;
}