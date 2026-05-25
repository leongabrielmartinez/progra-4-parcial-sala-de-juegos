import { Component, signal, effect, OnDestroy, inject } from '@angular/core';
import { ModalAlertService } from '../../../services/modal-alert';

// Constantes globales de configuración
const GAME_TIME_SECONDS = 60;
const TOTAL_ROUNDS = 5;
const WORD_LIST = ['AB'];
const ALPHABET = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');

@Component({
  selector: 'app-ahorcado',
  imports: [],
  templateUrl: './ahorcado.html',
  styleUrl: './ahorcado.css',
})
export class Ahorcado implements OnDestroy {
  private modalAlertService = inject(ModalAlertService);
  readonly alphabet = ALPHABET;

  // Estado del juego usando Signals
  errors = signal<number>(0);
  timeLeft = signal<number>(GAME_TIME_SECONDS);
  currentRound = signal<number>(1);
  score = signal<number>(0);
  currentWord = signal<string>('');
  //letras adivinadas
  guessedLetters = signal<Set<string>>(new Set());

/* * En JavaScript, los intervalos creados con `setInterval` se ejecutan de forma asíncrona
 * y en segundo plano, corriendo de manera independiente al flujo principal de la aplicación.
 
 * Existen funciones nativas, por ejemplo `clearInterval()` para manejarlos.
 */

  private timerInterval: any;

  constructor() {
    this.startNewGame();

    // Efecto reactivo: Verifica condiciones de victoria o derrota al cambiar el estado
    effect(() => {
      if (this.errors() >= 6 || this.timeLeft() <= 0) {
        //Puede seguir jugando
        this.handleGameOver(false);
      } else if (this.currentWord() && this.checkWinCondition()) {
        //Se termino el juego (puede haber ganado o perdido)
        this.handleGameOver(true);
      }
    });
  }

  // Reiniciar todo el juego 
  startNewGame() {
    this.score.set(0);
    this.currentRound.set(1);
    this.initRound();
  }

  // Inicializa los parámetros para una nueva ronda
  initRound() {
    this.errors.set(0);
    this.timeLeft.set(GAME_TIME_SECONDS);
    //letras adivinadas
    this.guessedLetters.set(new Set());
    
    // Selecciona una palabra aleatoria de la lista
    const randomIndex = Math.floor(Math.random() * WORD_LIST.length);
    this.currentWord.set(WORD_LIST[randomIndex]);

    // Inicia el cronómetro deteniendo cualquier temporizador previo activo
    this.stopTimer();
    this.timerInterval = setInterval(() => {
      if (this.timeLeft() > 0) {
        this.timeLeft.update(time => time - 1);
      }
    }, 1000);
  }

  // Detiene el temporizador de forma segura si existe
  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  // Procesa la letra seleccionada por el usuario
  guessLetter(letter: string) {
    //letra adivinada
    // Bloquea la acción si la letra ya se usó, si se agotaron los errores o el tiempo
    if (this.guessedLetters().has(letter) || this.errors() >= 6 || this.timeLeft() <= 0) {
      return;
    }

    // Registra la letra elegida en el Set reactivo
    this.guessedLetters.update(set => {
      const newSet = new Set(set);
      newSet.add(letter);
      return newSet;
    });

    // Cuenta cuántas veces aparece la letra en la palabra actual
    const word = this.currentWord();
    let occurrences = 0;

    for (let i = 0; i < word.length; i++) {
      if (word[i] === letter) {
        occurrences++;
      }
    }

    // Asigna puntos o incrementa el contador de fallos
    if (occurrences > 0) {
      this.score.update(s => s + (occurrences * 10));
    } else {
      this.errors.update(e => e + 1);
    }
  }

  // Verifica si todas las letras de la palabra ya fueron descubiertas
  checkWinCondition(): boolean {
    const guesses = this.guessedLetters();
    return this.currentWord().split('').every(letter => guesses.has(letter));
  }

  // Maneja el desenlace de la ronda actual
  handleGameOver(isWin: boolean) {
    this.stopTimer();

    if (isWin) {
      // Otorga puntos extra basados en los segundos restantes
      this.score.update(s => s + this.timeLeft());

      if (this.currentRound() < TOTAL_ROUNDS) {
        this.currentRound.update(r => r + 1);
        this.initRound();
      } else {
        this.modalAlertService.showAlert(
          'Ganaste',
          `Obtuviste ${this.score()} puntos.`,
          'info' 
        );
      }
    } else {
        this.modalAlertService.showAlert(
          'Perdiste',
          `Obtuviste ${this.score()} puntos.`,
          'info' 
        );
    }
  }

  // Mapea la palabra mostrando las letras acertadas y guiones bajos en las ocultas
  getHiddenWord(): string[] {
    const guesses = this.guessedLetters();
    return this.currentWord().split('').map(letter => guesses.has(letter) ? letter : '_');
  }

  // Asegura la limpieza del intervalo cuando el componente se destruye en Angular
  ngOnDestroy() {
    this.stopTimer();
  }
}