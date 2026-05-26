import { Component, inject, OnInit, signal, effect } from '@angular/core'; // Añadimos effect
import { SupaAuthService } from '../../../services/supabase/auth/supa-auth-service';
import { ChatService } from '../../../services/supabase/chat/chat-service';
import { Dialog } from '@angular/cdk/dialog';
import { ModalChat } from '../modal-chat/modal-chat';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sticky-chat',
  imports: [CommonModule], 
  templateUrl: './sticky-chat.html',
  styleUrl: './sticky-chat.css',
})
export class StickyChat implements OnInit {
  private supabaseService = inject(SupaAuthService);
  private dialog = inject(Dialog);
  
  currentUserId = signal<string | null>(null);

  async ngOnInit() {
    const session = await this.supabaseService.getSession();
  
    if (session?.user) {
      this.currentUserId.set(session.user.id);
    } 
  }

  abrirChat() {
    const dialogRef = this.dialog.open(ModalChat, {
      hasBackdrop: false,
      panelClass: 'modal-chat-contenedor' 
    });
  }
}