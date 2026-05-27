import { IEncuestaForm } from './../../models/encuesta';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ModalAlertService } from '../../services/modal-alert';
import { EncuestasService } from '../../services/supabase/encuestas/encuestas';
import { Router } from '@angular/router';

@Component({
  selector: 'app-encuesta',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './encuesta.html',
  styleUrl: './encuesta.css',
})
export class Encuesta implements OnInit {
  private modalAlertService = inject(ModalAlertService);
  private fb = inject(FormBuilder);
  private encuestasService = inject(EncuestasService); 
  private router = inject(Router);

  encuestaForm!: FormGroup;

  ngOnInit(): void {
    this.encuestaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$')]],
      apellido: ['', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$')]],
      edad: ['', [Validators.required, Validators.min(18), Validators.max(99)]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(8), Validators.maxLength(10)]],
      fluidez: ['', Validators.required],         
      juegoFavorito: ['', Validators.required],  
      recomienda: [false] 
    });
  }

  async enviarEncuesta() {
    if (this.encuestaForm.valid) {
      try {
        const formValues = this.encuestaForm.value;

        const datosEncuesta: IEncuestaForm = {
          ...formValues,
          recomienda: formValues.recomienda ? 'si' : 'no'
        };

        await this.encuestasService.guardarEncuesta(datosEncuesta);

        this.modalAlertService.showAlert(
          '¡Datos Guardados!',
          'Tu encuesta de satisfacción ha sido registrada con éxito en el sistema central. ¡Gracias por ayudarnos a mejorar!',
          'success'
        );

        this.encuestaForm.reset({ recomienda: false });
        this.router.navigate(['/home']);

      } catch (error: any) {
        this.modalAlertService.showAlert(
          'Fallo de Conexión',
          error.message || 'No se pudo procesar la encuesta en este momento. Inténtalo más tarde.',
          'error'
        );
      }
    } else {
      this.encuestaForm.markAllAsTouched();
    }
  }
}