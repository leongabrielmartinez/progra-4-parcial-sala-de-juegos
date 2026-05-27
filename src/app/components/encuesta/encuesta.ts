
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-encuesta',
  imports: [ReactiveFormsModule],
  templateUrl: './encuesta.html',
  styleUrl: './encuesta.css',
})
export class Encuesta implements OnInit {
  private fb = inject(FormBuilder);
  encuestaForm!: FormGroup;

  ngOnInit(): void {
    this.encuestaForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      edad: ['', [Validators.required, Validators.min(18), Validators.max(99)]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(10)]],
      fluidez: ['', Validators.required],         
      juegoFavorito: ['', Validators.required],  
      recomienda: ['', Validators.required] 
    });
  }

  enviarEncuesta() {
    if (this.encuestaForm.valid) {
      // Aquí recuperas el UID o mail de tu sesión activa
      const payloadCompleto = {
        usuario: 'username_o_id_desde_auth', 
        fecha: new Date(),
        ...this.encuestaForm.value
      };
      
      console.log('Objeto listo para mandar a la DB:', payloadCompleto);
      // servicio.guardarEncuesta(payloadCompleto);
    }
  }
}