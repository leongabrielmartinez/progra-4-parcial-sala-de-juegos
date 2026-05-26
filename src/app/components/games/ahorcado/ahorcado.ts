import { Component, signal, effect, OnDestroy, inject } from '@angular/core';
import { ModalAlertService } from '../../../services/modal-alert';
import { GameStatistics } from '../../../services/supabase/statistics/game-statistics';
import { ResultDataAhorcado } from '../../../models/games-data/ahorcado-data';

// Constantes globales de configuración
const GAME_TIME_SECONDS = 60;
const TOTAL_ROUNDS = 5;
const WORD_LIST = ['ABC'];
const ALPHABET = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');

@Component({
  selector: 'app-ahorcado',
  imports: [],
  templateUrl: './ahorcado.html',
  styleUrl: './ahorcado.css',
})
export class Ahorcado implements OnDestroy {
  private modalAlertService = inject(ModalAlertService);
  private gameStatisticsService = inject(GameStatistics);
  readonly alphabet = ALPHABET;

  // Estado del juego usando Signals
  errors = signal<number>(0);
  timeLeft = signal<number>(GAME_TIME_SECONDS);
  currentRound = signal<number>(1);
  score = signal<number>(0);
  currentWord = signal<string>('');
  guessedLetters = signal<Set<string>>(new Set());

  // Métricas acumuladas para la estadística del juego
  totalCorrectLetters = 0;
  totalFailedLetters = 0;
  totalTimeUsed = 0;
  totalTimeLeft = 0;

  private timerInterval: any;
  private isGameOver = false; // Bandera para evitar ejecuciones duplicadas en el effect

  constructor() {
    this.startNewGame();

    // Efecto reactivo: Verifica condiciones de victoria o derrota al cambiar el estado
    effect(() => {
      if (this.isGameOver) return; // Bandera para evitar ejecuciones duplicadas en el effect

      if (this.errors() >= 6 || this.timeLeft() <= 0) {
        this.handleGameOver(false);
      } else if (this.currentWord() && this.checkWinCondition()) {
        this.handleGameOver(true);
      }
    });
  }

  // Reiniciar todo el juego desde cero
  startNewGame() {
    this.score.set(0);
    this.currentRound.set(1);
    this.isGameOver = false;
    this.totalCorrectLetters = 0;
    this.totalFailedLetters = 0;
    this.totalTimeUsed = 0;
    this.totalTimeLeft = 0;
    this.initRound();
  }

  // Inicializa los parámetros para una nueva ronda
  initRound() {
    this.errors.set(0);
    this.timeLeft.set(GAME_TIME_SECONDS);
    this.guessedLetters.set(new Set());
    
    const randomIndex = Math.floor(Math.random() * WORD_LIST.length);
    this.currentWord.set(WORD_LIST[randomIndex]);

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

  // Procesa la letra seleccionada por el usuario (desde botones, no teclado)
  guessLetter(letter: string) {
    if (this.isGameOver || this.guessedLetters().has(letter) || this.errors() >= 6 || this.timeLeft() <= 0) {
      return;
    }

    this.guessedLetters.update(set => {
      const newSet = new Set(set);
      newSet.add(letter);
      return newSet;
    });

    const word = this.currentWord();
    let occurrences = 0;

    for (let i = 0; i < word.length; i++) {
      if (word[i] === letter) {
        occurrences++;
      }
    }

    if (occurrences > 0) {
      this.score.update(s => s + (occurrences * 10));
      this.totalCorrectLetters++; // Acumulamos para la estadística
    } else {
      this.errors.update(e => e + 1);
      this.totalFailedLetters++; // Acumulamos para la estadística
    }
  }

  // Verifica si todas las letras de la palabra ya fueron descubiertas
  checkWinCondition(): boolean {
    const guesses = this.guessedLetters();
    return this.currentWord().split('').every(letter => guesses.has(letter));
  }

  // Maneja el desenlace de la ronda actual
  async handleGameOver(isWin: boolean) {
    this.stopTimer();

    // Sumamos las métricas de esta ronda a los totales generales
    const timeUsedInRound = GAME_TIME_SECONDS - this.timeLeft();
    this.totalTimeUsed += timeUsedInRound;
    this.totalTimeLeft += this.timeLeft();

    if (isWin) {
      // Otorga puntos extra basados en los segundos restantes
      this.score.update(s => s + this.timeLeft());

      if (this.currentRound() < TOTAL_ROUNDS) {
        this.currentRound.update(r => r + 1);
        this.initRound();
      } else {
        // GANÓ EL JUEGO COMPLETO (Pasó las 5 rondas)
        this.isGameOver = true;
        await this.guardarEstadisticasFinales(true);
        this.modalAlertService.showAlert(
          '¡Felicidades, ganaste el juego!',
          `Completaste las ${TOTAL_ROUNDS} rondas con un total de ${this.score()} puntos.`,
          'success' // Cambiar a modales según consigna
        );
      }
    } else {
      // PERDIÓ EL JUEGO (Se quedó sin tiempo o llegó a 6 errores)
      this.isGameOver = true;
      await this.guardarEstadisticasFinales(false);
      this.modalAlertService.showAlert(
        'Juego Terminado',
        `Te quedaste sin intentos o tiempo en la ronda ${this.currentRound()}. Puntuación final: ${this.score()} puntos.`,
        'error' // Cambiar a modales según consigna
      );
    }
  }

  // Envía la estructura limpia a tu servicio GameStatistics
  private async guardarEstadisticasFinales(ganoJuego: boolean) {
    const datosPartida: ResultDataAhorcado = {
      palabra: this.currentWord(), // Guarda la última palabra jugada
      gano: ganoJuego,
      letras_acertadas: this.totalCorrectLetters,
      letras_falladas: this.totalFailedLetters,
      tiempo_utilizado: this.totalTimeUsed,
      tiempo_sobrante: this.totalTimeLeft
    };

    try {
      await this.gameStatisticsService.guardarPartidaAhorcado(datosPartida);
      console.log('Estadísticas guardadas con éxito en Supabase.');
    } catch (error) {
      console.error('No se pudieron registrar las estadísticas del juego:', error);
    }
  }

  // Mapea la palabra mostrando las letras acertadas y guiones bajos en las ocultas
  getHiddenWord(): string[] {
    const guesses = this.guessedLetters();
    return this.currentWord().split('').map(letter => guesses.has(letter) ? letter : '_');
  }

  ngOnDestroy() {
    this.stopTimer();
  }
}