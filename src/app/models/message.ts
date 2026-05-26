export interface Mensaje {
  id: string;          // o number, según tu base de datos
  contenido: string;
  created_at: string;
  user_id: string;
  nombre_usuario?: string;
  apellido_usuario?: string;
  usuarios?: {
    nombre: string;
    apellido: string;
  };
}