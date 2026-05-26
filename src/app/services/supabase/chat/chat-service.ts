import { inject, Injectable, signal, DestroyRef } from '@angular/core';
import { SUPABASE_CLIENT } from '../token/supabase.token';
import { SupaAuthService } from '../auth/supa-auth-service';
import { Mensaje } from '../../../models/message';
import { RealtimeChannel } from '@supabase/supabase-js';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private supabase = inject(SUPABASE_CLIENT);
  private authService = inject(SupaAuthService);
  private destroyRef = inject(DestroyRef);
  public mensajes = signal<Mensaje[]>([]);
  private chatChannel!: RealtimeChannel;

  constructor() {
    this.cargarMensajesIniciales();
    this.escucharMensajesEnTiempoReal();

    this.destroyRef.onDestroy(() => {
      if (this.chatChannel) {
        this.supabase.removeChannel(this.chatChannel);
      }
    });
  }

  async cargarMensajesIniciales() {
    const { data, error } = await this.supabase
      .from('mensajes')
      .select(`
        id,
        contenido,
        created_at,
        user_id,
        usuarios:user_id (
          nombre,
          apellido
        )
      `)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error cargando el chat:', error);
      return;
    }

    if (data) {
      const mensajesFormateados = data.map((msg: any) => {
        const usuarioInfo = Array.isArray(msg.usuarios) ? msg.usuarios[0] : msg.usuarios;
        
        return {
          id: msg.id,
          contenido: msg.contenido,
          created_at: msg.created_at,
          user_id: msg.user_id,
          nombre_usuario: usuarioInfo?.nombre || 'Usuario',
          apellido_usuario: usuarioInfo?.apellido || 'Externo'
        };
      });

      this.mensajes.set(mensajesFormateados as unknown as Mensaje[]);
    }
  }

  escucharMensajesEnTiempoReal() {
    this.chatChannel = this.supabase
      .channel('sala-publica')
      .on(
        'postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'mensajes' }, 
        async (payload) => {
          console.log('¡Nuevo mensaje detectado en tiempo real!', payload);
  
          setTimeout(async () => {
            await this.cargarMensajesIniciales(); 
          }, 100);
        }
      );

    this.chatChannel.subscribe((status) => {
      console.log('Estado de la suscripción Realtime:', status);
    });
  }

  async enviarMensaje(contenido: string): Promise<void> {
    if (!contenido.trim()) return;

    try {
      const user = await this.authService.getUser();
      if (!user) throw new Error('No hay una sesión de usuario activa.');

      const { error } = await this.supabase
        .from('mensajes')
        .insert({
          contenido: contenido,
          user_id: user.id
        });

      if (error) throw error;
      
    } catch (error) {
      console.error('Error al enviar mensaje a la base de datos:', error);
      throw error;
    }
  }
}