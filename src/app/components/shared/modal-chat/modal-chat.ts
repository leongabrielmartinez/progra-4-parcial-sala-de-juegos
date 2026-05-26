import { Component, inject, OnInit, signal } from '@angular/core';
import { ChatService } from '../../../services/supabase/chat/chat-service';
import { SupaAuthService } from '../../../services/supabase/auth/supa-auth-service';
import { DialogRef } from '@angular/cdk/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-chat',
  imports: [FormsModule, CommonModule],
  templateUrl: './modal-chat.html',
  styleUrl: './modal-chat.css',
})
export class ModalChat implements OnInit {
  public chatService = inject(ChatService);
  private supabaseService = inject(SupaAuthService);
  public dialogRef = inject(DialogRef);

  // Aseguramos el tipo estricto string para que coincida con el UUID
  currentUserId = signal<string | null>(null);
  nuevoMensaje = '';

  async ngOnInit() {
    const session = await this.supabaseService.getSession();

    if (session?.user) {
      this.currentUserId.set(session.user.id);
    } 
  }

  async enviar() {
    const texto = this.nuevoMensaje.trim();
    if (texto) {
      await this.chatService.enviarMensaje(texto);
      this.nuevoMensaje = '';
    }
  }
}