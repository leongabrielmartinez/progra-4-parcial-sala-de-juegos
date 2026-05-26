// services/preguntados-api.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TriviaResponse } from '../models/trivia-response';

@Injectable({
  providedIn: 'root',
})
export class PreguntadosApiService {
  private http = inject(HttpClient);
  // URL base para obtener 10 preguntas en formato de opción múltiple
  private apiUrl = 'https://opentdb.com/api.php';

  /**
   * Obtiene una lista de preguntas de la API de Trivia
   * @param amount Cantidad de preguntas a traer (por defecto 10)
   * @ shortcut 'multiple' para asegurar que tengan 4 opciones (1 correcta, 3 incorrectas)
   */
  getQuestions(amount: number = 10): Observable<TriviaResponse> {
    // Construimos la URL con los parámetros necesarios
    const url = `${this.apiUrl}?amount=${amount}&type=multiple`;
    
    // Hacemos la petición GET (no requiere headers de autenticación)
    return this.http.get<TriviaResponse>(url);
  }
}