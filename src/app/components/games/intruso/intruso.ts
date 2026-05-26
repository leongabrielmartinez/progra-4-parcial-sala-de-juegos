import { Component, signal, effect, OnDestroy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalAlertService } from '../../../services/modal-alert';
import { GameStatistics } from '../../../services/supabase/statistics/game-statistics';
import { ResultDataIntruso } from '../../../models/games-data/el-intruso-data';

const TIME_PER_LEVEL = 15;
const TOTAL_LEVELS = 10;

interface CasilleroFigura {
  id: number;
  emoji: string;
  esIntruso: boolean;
}

@Component({
  selector: 'app-intruso',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './intruso.html',
  styleUrl: './intruso.css',
})
export class Intruso implements OnInit, OnDestroy {
  private modalAlertService = inject(ModalAlertService);
  private gameStatisticsService = inject(GameStatistics);

  private timerInterval: any = null;
  private isGameOver = false;

  private bancoFiguras = [
    { normal: '🌕', intruso: '🌖' }, 
    { normal: '⭐', intruso: '🌟' }, 
    { normal: '📉', intruso: '📈' },  
    { normal: '🔼', intruso: '▲' },   
    { normal: '🔲', intruso: '🔳' }, 
    { normal: '☂️', intruso: '☔' }, 
    { normal: '✌️', intruso: '🤞' },  
    { normal: '😮', intruso: '😲' }, 
    { normal: '🕐', intruso: '🕢' }, 
    { normal: '🧑‍💻', intruso: '👩‍💻' } 
  ];

  isLoading = signal<boolean>(true);
  timeLeft = signal<number>(TIME_PER_LEVEL);
  currentLevel = signal<number>(1);
  score = signal<number>(0);
  gridSize = signal<number>(3); 
  casilleros = signal<CasilleroFigura[]>([]);

  totalTimeUsed = 0;
  failedClicksCount = 0;

  constructor() {
    effect(() => {
      // Si ya está marcado el fin del juego, ignoramos cualquier cambio reactivo tardío
      if (this.isGameOver) return;

      if (this.timeLeft() <= 0) {
        this.isGameOver = true;
        this.stopTimer(); // <-- Detención inmediata antes de abrir modales
        this.finalizarJuego(false);
      }
    });
  }

  ngOnInit(): void {
    this.startNewGame();
  }

  startNewGame() {
    this.stopTimer(); // 1. Detener CUALQUIER intervalo previo que haya quedado flotando
    this.isGameOver = false;
    
    // 2. Limpieza absoluta del estado del juego
    this.score.set(0);
    this.currentLevel.set(1);
    this.gridSize.set(3); 
    this.casilleros.set([]); 
    this.totalTimeUsed = 0;
    this.failedClicksCount = 0;
    
    this.isLoading.set(true);

    setTimeout(() => {
      this.initLevel();
      this.isLoading.set(false);
    }, 200); 
  }

  initLevel() {
    if (this.isGameOver) return;

    this.stopTimer();
    this.timeLeft.set(TIME_PER_LEVEL);

    // Cada 2 niveles incrementa 1 fila/columna de forma suave.
    const nivelActual = this.currentLevel();
    const nuevaDimension = 3 + Math.floor((nivelActual - 1) / 2);

    this.gridSize.set(nuevaDimension);
    const totalElementos = nuevaDimension * nuevaDimension;

    const parFiguras = this.bancoFiguras[(nivelActual - 1) % this.bancoFiguras.length];
    const indiceIntruso = Math.floor(Math.random() * totalElementos);

    const listaTemporal: CasilleroFigura[] = [];
    for (let i = 0; i < totalElementos; i++) {
      const esIntruso = (i === indiceIntruso);
      listaTemporal.push({
        id: i,
        emoji: esIntruso ? parFiguras.intruso : parFiguras.normal,
        esIntruso: esIntruso
      });
    }

    // Sobrescribimos el signal con los nuevos elementos limpios
    this.casilleros.set(listaTemporal);

    // Inicializar el cronómetro de la ronda de manera aislada
    this.timerInterval = setInterval(() => {
      if (!this.isGameOver && this.timeLeft() > 0) {
        this.timeLeft.update(t => t - 1);
      }
    }, 1000);
  }

  seleccionarCasillero(casillero: CasilleroFigura) {
    if (this.isGameOver) return;

    this.stopTimer();
    const tiempoGastadoEnNivel = TIME_PER_LEVEL - this.timeLeft();
    this.totalTimeUsed += tiempoGastadoEnNivel;

    if (casillero.esIntruso) {
      this.score.update(s => s + 200 + (this.timeLeft() * 15)); 

      if (this.currentLevel() < TOTAL_LEVELS) {
        this.currentLevel.update(l => l + 1);
        this.initLevel();
      } else {
        this.isGameOver = true;
        this.finalizarJuego(true);
      }
    } else {
      this.failedClicksCount++;
      this.isGameOver = true;
      this.finalizarJuego(false);
    }
  }

  async finalizarJuego(completoVictoria: boolean) {
    this.stopTimer(); 

    const datosPartida: ResultDataIntruso = {
      nivel_alcanzado: this.currentLevel(),
      gano: completoVictoria,
      clicks_incorrectos: this.failedClicksCount,
      tiempo_utilizado: this.totalTimeUsed
    };

    try {
      await this.gameStatisticsService.guardarPartidaIntruso(datosPartida);
    } catch (err) {
      console.error('Error al registrar métricas de El Intruso:', err);
    }

    if (completoVictoria) {
      this.modalAlertService.showAlert(
        '¡Victoria Absoluta!',
        `¡Increíble agudeza visual! Descubriste a todos los intrusos expertos en los ${TOTAL_LEVELS} niveles. Puntuación: ${this.score()} pts.`,
        'success'
      );
    } else {
      const motivo = this.timeLeft() <= 0 ? 'te quedaste sin tiempo' : 'hiciste clic en la figura incorrecta';
      this.modalAlertService.showAlert(
        'Juego Terminado',
        `Perdiste porque ${motivo}. Llegaste hasta el nivel ${this.currentLevel()} con ${this.score()} pts.`,
        'error'
      );
    }
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null; // Liberar la referencia de memoria
    }
  }

  ngOnDestroy() {
    this.stopTimer();
  }
}