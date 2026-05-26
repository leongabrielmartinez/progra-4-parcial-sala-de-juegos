import { Component, signal, effect, OnDestroy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalAlertService } from '../../../services/modal-alert';
import { GameStatistics } from '../../../services/supabase/statistics/game-statistics';
import { PreguntadosApiService } from '../../../services/preguntados-api';
import { TriviaQuestion } from '../../../models/trivia-response';
import { ResultDataPreguntados } from '../../../models/games-data/preguntados-data';

const TIME_PER_QUESTION = 25;
const TOTAL_ROUNDS = 10;
const MAX_ERRORS = 3; // <-- Constante de límite de errores

@Component({
  selector: 'app-preguntados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preguntados.html',
  styleUrl: './preguntados.css',
})
export class Preguntados implements OnInit, OnDestroy {
  private modalAlertService = inject(ModalAlertService);
  private gameStatisticsService = inject(GameStatistics);
  private preguntadosService = inject(PreguntadosApiService);

  private listaPreguntas: TriviaQuestion[] = [];
  private timerInterval: any;
  private isGameOver = false; // <-- Bandera para evitar ejecuciones duplicadas (igual que en Ahorcado)

  // Estado del juego con Signals
  isLoading = signal<boolean>(true);
  timeLeft = signal<number>(TIME_PER_QUESTION);
  currentRound = signal<number>(1);
  score = signal<number>(0);
  errors = signal<number>(0); // <--- Nuevo Signal para controlar los errores en tiempo real
  
  currentQuestionText = signal<string>('');
  currentCategory = signal<string>('');
  currentDifficulty = signal<string>('');
  shuffledAnswers = signal<string[]>([]);
  correctAnswer = signal<string>('');

  // Métricas para Supabase
  totalCorrectAnswers = 0;
  totalFailedAnswers = 0;
  totalTimeUsed = 0;

  constructor() {
    // Efecto reactivo automático (centraliza las condiciones de cierre)
    effect(() => {
      if (this.isGameOver) return;

      // Condición 1: Se quedó sin tiempo en la ronda actual
      if (this.timeLeft() <= 0) {
        this.handleAnswerSelection('', false); 
      }

      // Condición 2: Llegó al límite de 3 errores (Derrota instantánea)
      if (this.errors() >= MAX_ERRORS) {
        this.isGameOver = true;
        this.finalizarJuego(false);
      }
    });
  }

  ngOnInit(): void {
    this.startNewGame();
  }

  startNewGame() {
    this.score.set(0);
    this.currentRound.set(1);
    this.errors.set(0); // <-- Reseteamos el contador de errores
    this.isGameOver = false;
    this.totalCorrectAnswers = 0;
    this.totalFailedAnswers = 0;
    this.totalTimeUsed = 0;
    this.isLoading.set(true);

    this.preguntadosService.getQuestions(TOTAL_ROUNDS).subscribe({
      next: (data) => {
        this.listaPreguntas = data.results;
        this.initRound();
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.modalAlertService.showAlert('Error', 'No se pudo conectar con la API', 'error');
      }
    });
  }

  initRound() {
    if (this.isGameOver) return;

    this.timeLeft.set(TIME_PER_QUESTION);
    const preguntaActual = this.listaPreguntas[this.currentRound() - 1];

    if (!preguntaActual) return;

    this.currentQuestionText.set(this.decodeHTML(preguntaActual.question));
    this.currentCategory.set(this.decodeHTML(preguntaActual.category));
    this.currentDifficulty.set(preguntaActual.difficulty);
    this.correctAnswer.set(this.decodeHTML(preguntaActual.correct_answer));

    const opciones = [preguntaActual.correct_answer, ...preguntaActual.incorrect_answers].map(ans => this.decodeHTML(ans));
    this.shuffledAnswers.set(opciones.sort(() => Math.random() - 0.5));

    this.stopTimer();
    this.timerInterval = setInterval(() => {
      if (this.timeLeft() > 0) this.timeLeft.update(t => t - 1);
    }, 1000);
  }

  handleAnswerSelection(selectedAnswer: string, clickeado: boolean = true) {
    if (this.isGameOver) return; // Protege de clicks fantasmas o retrasados

    this.stopTimer();
    this.totalTimeUsed += (TIME_PER_QUESTION - this.timeLeft());

    if (clickeado && selectedAnswer === this.correctAnswer()) {
      this.score.update(s => s + 100 + this.timeLeft());
      this.totalCorrectAnswers++;
    } else {
      this.totalFailedAnswers++;
      this.errors.update(e => e + 1); // <--- Incrementamos el Signal de errores
    }

    // Solo avanzamos si el efecto reactivo no gatilló el fin del juego por llegar a 3 errores
    setTimeout(() => {
      if (this.isGameOver) return;

      if (this.currentRound() < TOTAL_ROUNDS) {
        this.currentRound.update(r => r + 1);
        this.initRound();
      } else {
        this.isGameOver = true;
        this.finalizarJuego(true); // Pasó las 10 rondas exitosamente
      }
    }, 50); // Pequeño delay de sincronización para que el effect procese primero si hubo derrota
  }

  async finalizarJuego(ganoPartida: boolean) {
    this.stopTimer();

    const datosPartida: ResultDataPreguntados = {
      total_preguntas: TOTAL_ROUNDS,
      preguntas_acertadas: this.totalCorrectAnswers,
      preguntas_falladas: this.totalFailedAnswers,
      tiempo_utilizado: this.totalTimeUsed
    };

    try {
      await this.gameStatisticsService.guardarPartidaPreguntados(datosPartida);
    } catch (err) {
      console.error('Error al guardar en Supabase:', err);
    }

    if (ganoPartida) {
      this.modalAlertService.showAlert(
        '¡Victoria!',
        `¡Completaste las ${TOTAL_ROUNDS} preguntas! Aciertos: ${this.totalCorrectAnswers}. Puntaje: ${this.score()} pts.`,
        'success'
      );
    } else {
      this.modalAlertService.showAlert(
        'Juego Terminado',
        `Alcanzaste el límite de ${MAX_ERRORS} errores permitidos en la ronda ${this.currentRound()}. Puntaje final: ${this.score()} pts.`,
        'error'
      );
    }
  }

  stopTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  private decodeHTML(html: string): string {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  }

  ngOnDestroy() {
    this.stopTimer();
  }
}