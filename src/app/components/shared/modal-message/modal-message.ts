import { Component, inject } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ModalDataPayload } from '../../../services/modal-alert'; // Ajustá la ruta a la interfaz

@Component({
  selector: 'app-modal-message',
  standalone: true,
  imports: [],
  templateUrl: './modal-message.html',
  styleUrl: './modal-message.css'
})
export class ModalMessage {
  // Capturamos los datos enviados desde el método .open()
  protected data = inject<ModalDataPayload>(DIALOG_DATA);
  // Capturamos la referencia al ciclo de vida de este modal para poder cerrarlo
  protected dialogRef = inject(DialogRef);

  getBorderClass(): string {
    const type = this.data.type;
    if (type === 'error') return 'border-danger'; 
    if (type === 'success') return 'neon-border-pink'; 
    return 'neon-border'; 
  }
}