import { Component, inject, computed, signal } from '@angular/core';
import { SupaAuthService } from '../../services/supabase/auth/supa-auth-service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private supabaseService = inject(SupaAuthService);

  isLoading = computed(() => this.supabaseService.isLoadingSignal());
  isLoggedIn = computed(() => this.supabaseService.currentUserSignal().isLoggedIn);
  username = computed(() => this.supabaseService.currentUserSignal().username);

  juegos = [
    {
      titulo: 'Ahorcado',
      descripcion: 'Adivina la palabra oculta antes de que sea tarde.',
      link: '/juegos/ahorcado',
      icono: 'bi-person-lines-fill',
      esRosa: false
    },
    {
      titulo: 'Mayor o Menor',
      descripcion: '¿La siguiente carta será más alta o más baja? ¡Arriésgate!',
      link: '/juegos/mayor-menor',
      icono: 'bi-arrow-down-up',
      esRosa: true
    },
    {
      titulo: 'Preguntados',
      descripcion: 'Demuestra cuánto sabes en esta trivia de preguntas.',
      link: '/juegos/preguntados',
      icono: 'bi-patch-question',
      esRosa: false
    },
    {
      titulo: 'El Intruso',
      descripcion: 'Encuentra el elemento que no encaja con el resto.',
      link: '/juegos/el-intruso',
      icono: 'bi-incognito',
      esRosa: true
    }
  ];

  constructor() {}

  async logout() {
    try {
      await this.supabaseService.logOut();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  scrollToJuegos() {
    const elemento = document.getElementById('nuestros-juegos');
    if (elemento) {
      elemento.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}