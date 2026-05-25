import { Component, signal, effect, OnDestroy, inject } from '@angular/core';
import { ModalAlertService } from '../../../services/modal-alert';
import { GameStatistics } from '../../../services/supabase/statistics/game-statistics';
import { ResultDataMayorMenor } from '../../../models/games-data/mayor-menor-data';
import { CommonModule } from '@angular/common';

interface Card {
  value: number;
  suit: 'heart' | 'diamond' | 'club' | 'spade';
  icon: string;
  colorClass: string;
}

const GAME_TIME_SECONDS = 25;
const MAX_ERRORS = 5;
const SUITS: Card['suit'][] = ['heart', 'diamond', 'club', 'spade'];
const SUIT_ICONS = { heart: 'bi-suit-heart-fill', diamond: 'bi-suit-diamond-fill', club: 'bi-suit-club-fill', spade: 'bi-suit-spade-fill' };
const SUIT_COLORS = { heart: 'text-danger', diamond: 'text-danger', club: 'text-light', spade: 'text-light' };

@Component({
  selector: 'app-mayor-menor',
  imports: [CommonModule],
  templateUrl: './mayor-o-menor.html',
  styleUrl: './mayor-o-menor.css',
})
export class MayorMenor implements OnDestroy {
  private modalAlertService = inject(ModalAlertService);
  private gameStatisticsService = inject(GameStatistics);

  // Estado del juego
  errors = signal<number>(0);
  timeLeft = signal<number>(GAME_TIME_SECONDS);
  score = signal<number>(0);
  totalTimeUsed = signal<number>(0); // Acumulador del tiempo real utilizado
  
  // Cartas
  deck: Card[] = [];
  currentCard = signal<Card | null>(null);
  nextCard: Card | null = null;
  cardsRemaining = signal<number>(0);

  private timerInterval: any;
  private isGameOver = false;

  constructor() {
    this.startNewGame();

    effect(() => {
      if (this.isGameOver) return;

      if (this.errors() >= MAX_ERRORS || this.timeLeft() <= 0) {
        this.handleGameOver(false);
      }
    });
  }

  startNewGame() {
    this.score.set(0);
    this.errors.set(0);
    this.timeLeft.set(GAME_TIME_SECONDS);
    this.totalTimeUsed.set(0); 
    this.isGameOver = false;
    
    this.buildDeck();
    this.drawInitialCard();
    this.startTimer();
  }

  private buildDeck() {
    const newDeck: Card[] = [];
    for (let value = 1; value <= 13; value++) {
      for (const suit of SUITS) {
        newDeck.push({
          value,
          suit,
          icon: SUIT_ICONS[suit],
          colorClass: SUIT_COLORS[suit]
        });
      }
    }
    
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }
    this.deck = newDeck;
    this.cardsRemaining.set(this.deck.length);
  }

  private drawInitialCard() {
    const card = this.deck.pop();
    this.currentCard.set(card || null);
    this.cardsRemaining.set(this.deck.length);
  }

  private startTimer() {
    this.stopTimer();
    this.timerInterval = setInterval(() => {
      if (this.timeLeft() > 0) {
        this.timeLeft.update(time => time - 1);
      }
    }, 1000);
  }

  private stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  guess(choice: 'higher' | 'lower') {
    if (this.isGameOver || this.deck.length === 0 || this.errors() >= MAX_ERRORS || this.timeLeft() <= 0) return;

    this.nextCard = this.deck.pop()!;
    this.cardsRemaining.set(this.deck.length);

    const currentVal = this.currentCard()!.value;
    const nextVal = this.nextCard.value;

    let isCorrect = false;
    if (choice === 'higher' && nextVal > currentVal) isCorrect = true;
    if (choice === 'lower' && nextVal < currentVal) isCorrect = true;
    
    if (nextVal === currentVal) {
      isCorrect = true; 
    }

    if (isCorrect) {
      this.score.update(s => s + 1);
    } else {
      this.errors.update(e => e + 1);
    }

    // Calcula el tiempo consumido en esta ronda y lo suma al acumulado
    const timeUsedInThisRound = GAME_TIME_SECONDS - this.timeLeft();
    this.totalTimeUsed.update(total => total + timeUsedInThisRound);

    this.currentCard.set(this.nextCard);
    this.timeLeft.set(GAME_TIME_SECONDS); // Reinicia el temporizador de la ronda

    if (this.deck.length === 0 && this.errors() < MAX_ERRORS) {
      this.handleGameOver(true);
    }
  }

  private async handleGameOver(isWin: boolean) {
    this.stopTimer();
    this.isGameOver = true;

    // Suma el tiempo transcurrido en la ronda final antes de guardar
    const timeUsedInLastRound = GAME_TIME_SECONDS - this.timeLeft();
    this.totalTimeUsed.update(total => total + timeUsedInLastRound);

    const stats: ResultDataMayorMenor = {
      cards_guessed: this.score(),
      time_used: this.totalTimeUsed(), 
      is_win: isWin
    };

    try {
      await this.gameStatisticsService.guardarPartidaMayorMenor(stats);
    } catch (err) {
      console.error('Could not save game stats', err);
    }

    if (isWin) {
      this.modalAlertService.showAlert(
        '¡Felicidades, ganaste el juego!',
        `¡Lograste adivinar todas las cartas disponibles! Puntuación: ${this.score()}. Tiempo empleado: ${this.totalTimeUsed()}s`,
        'success'
      );
    } else {
      this.modalAlertService.showAlert(
        'Juego Terminado',
        `Te quedaste sin intentos o se agotó el tiempo. Aciertos conseguidos: ${this.score()}. Tiempo empleado: ${this.totalTimeUsed()}s`,
        'error'
      );
    }
  }

  getCardDisplayValue(value: number): string {
    if (value === 1) return 'A';
    if (value === 11) return 'J';
    if (value === 12) return 'Q';
    if (value === 13) return 'K';
    return value.toString();
  }

  ngOnDestroy() {
    this.stopTimer();
  }
}