import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EncuestasService } from '../../services/supabase/encuestas/encuestas';
import { IEncuestaDB } from '../../models/encuesta';

@Component({
  selector: 'app-estadisticas-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estadisticas-admin.html',
  styleUrl: './estadisticas-admin.css',
})
export class EstadisticasAdmin implements OnInit {
  private encuestasService = inject(EncuestasService);

  vistaActiva = signal<'tabla' | 'graficos'>('tabla');
  isLoading = signal<boolean>(true);
  encuestas = signal<IEncuestaDB[]>([]);

  ultimasEncuestas = computed(() => this.encuestas().slice(0, 10));

  estadisticasGraficos = computed(() => {
    const lista = this.encuestas();
    const total = lista.length || 1;

    const juegos = { 'ahorcado': 0, 'mayor-menor': 0, 'preguntados': 0, 'propio': 0 };
    const recomienda = { 'si': 0, 'no': 0 };
    const fluidez = { 'excelente': 0, 'buena': 0, 'mala': 0 };

    lista.forEach(e => {
      if (juegos[e.juego_favorito] !== undefined) juegos[e.juego_favorito]++;
      if (recomienda[e.recomienda] !== undefined) recomienda[e.recomienda]++;
      if (fluidez[e.fluidez] !== undefined) fluidez[e.fluidez]++;
    });

    const nombresJuegos: Record<string, string> = {
      'ahorcado': 'Ahorcado',
      'mayor-menor': 'Mayor o Menor',
      'preguntados': 'Preguntados',
      'propio': 'El Intruso'
    };

    const nombresFluidez: Record<string, string> = {
      'excelente': 'Excelente',
      'buena': 'Buena',
      'mala': 'Mala'
    };

    return {
      totalEncuestas: lista.length,
      juegos: Object.entries(juegos).map(([key, count]) => ({
        name: nombresJuegos[key] || key,
        cantidad: count,
        porcentaje: Math.round((count / total) * 100)
      })),
      recomendacion: {
        si_porcentaje: Math.round((recomienda.si / total) * 100),
        si_cantidad: recomienda.si,
        no_porcentaje: Math.round((recomienda.no / total) * 100),
        no_cantidad: recomienda.no
      },
      fluidez: Object.entries(fluidez).map(([key, count]) => ({
        name: nombresFluidez[key] || key,
        key: key,
        cantidad: count,
        porcentaje: Math.round((count / total) * 100)
      }))
    };
  });

  ngOnInit() {
    this.cargarEncuestas();
  }

  async cargarEncuestas() {
    this.isLoading.set(true);
    try {
      const data = await this.encuestasService.consultarEncuestas();
      this.encuestas.set(data);
    } catch (error) {
      console.error('Error al cargar encuestas:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  cambiarVista(vista: 'tabla' | 'graficos') {
    this.vistaActiva.set(vista);
  }
}