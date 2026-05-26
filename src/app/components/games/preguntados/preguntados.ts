import { Component, inject, AfterViewInit, ChangeDetectorRef } from '@angular/core'; // <-- Cambiamos OnInit por AfterViewInit
import { CommonModule } from '@angular/common'; 
import { PreguntadosApiService } from './../../../services/preguntados-api';
import { TriviaQuestion } from '../../../models/trivia-response';

@Component({
  selector: 'app-preguntados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preguntados.html',
  styleUrl: './preguntados.css',
})
export class Preguntados implements AfterViewInit { // <-- Implementamos AfterViewInit
  private preguntadosService = inject(PreguntadosApiService);
  private cdr = inject(ChangeDetectorRef); // <--- Inyectamos el detector de cambios
  
  public preguntas: TriviaQuestion[] = [];

  ngAfterViewInit(): void { // <-- Cambiado de ngOnInit a ngAfterViewInit
    this.preguntadosService.getQuestions(2).subscribe({
      next: (data) => {
        this.preguntas = data.results;
        
        // Le decimos a Angular de forma explícita: "Che, cambiaron los datos, redibuja ahora"
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Error al conectar con la API', err);
      }
    });
  }
}