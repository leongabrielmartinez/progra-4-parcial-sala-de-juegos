import { Component, inject, computed } from '@angular/core'; 
import { SupaAuthService } from '../../../services/supabase/auth/supa-auth-service';
import { Dialog } from '@angular/cdk/dialog';
import { ModalChat } from '../modal-chat/modal-chat';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sticky-chat',
  imports: [CommonModule], 
  templateUrl: './sticky-chat.html',
  styleUrl: './sticky-chat.css',
})
export class StickyChat {
  private supabaseService = inject(SupaAuthService);
  private dialog = inject(Dialog);
  
  isUserLoggedIn = computed(() => this.supabaseService.currentUserSignal().isLoggedIn);

  abrirChat() {
    this.dialog.open(ModalChat, {
      hasBackdrop: false,
      panelClass: 'modal-chat-contenedor' 
    });
  }
}