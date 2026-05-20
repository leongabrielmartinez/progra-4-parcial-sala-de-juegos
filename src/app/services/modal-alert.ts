import { inject, Injectable } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { ModalMessage } from '../components/shared/modal-message/modal-message'; // Ajustá la ruta exacta si hace falta

export interface ModalDataPayload {
  title: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root',
})
export class ModalAlertService {
  private dialog = inject(Dialog);

  showAlert(title: string, message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.dialog.open(ModalMessage, {
      width: '450px',
      maxWidth: '90%',
      disableClose: true, 
      panelClass: 'cyber-modal-panel', 

      data: {
        title,
        message,
        type
      } as ModalDataPayload
    });
  }
}