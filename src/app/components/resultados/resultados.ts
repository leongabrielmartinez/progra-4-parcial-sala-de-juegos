import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SUPABASE_CLIENT } from '../../services/supabase/token/supabase.token';

type JuegoCategoria = 'Ahorcado' | 'Mayor o Menor' | 'Preguntados' | 'El Intruso';

@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resultados.html',
  styleUrl: './resultados.css',
})
export class Resultados implements OnInit {
  private supabase = inject(SUPABASE_CLIENT);

  // Estados reactivos con Signals
  isLoading = signal<boolean>(true);
  categoriaSeleccionada = signal<JuegoCategoria>('Ahorcado');
  filasRanking = signal<any[]>([]);

  ngOnInit(): void {
    this.cargarEstadisticas(this.categoriaSeleccionada());
  }

  async cambiarCategoria(nuevaCategoria: JuegoCategoria) {
    this.categoriaSeleccionada.set(nuevaCategoria);
    await this.cargarEstadisticas(nuevaCategoria);
  }

  async cargarEstadisticas(juego: JuegoCategoria) {
    this.isLoading.set(true);
    this.filasRanking.set([]);

    try {
      if (juego === 'Ahorcado') {
        const { data, error } = await this.supabase
          .from('resultados_ahorcado')
          .select('*')
          .order('gano', { ascending: false })
          .order('letras_falladas', { ascending: true })
          .order('tiempo_sobrante', { ascending: false })
          .limit(5); // 

        if (error) throw error;
        this.filasRanking.set(data || []);
      } 
      
      else if (juego === 'Mayor o Menor') {
        const { data, error } = await this.supabase
          .from('resultados_mayor_menor')
          .select('*')
          .order('cartas_acertadas', { ascending: false })
          .order('tiempo_utilizado', { ascending: true })
          .limit(5); // 

        if (error) throw error;
        this.filasRanking.set(data || []);
      } 
      
      else if (juego === 'Preguntados') {
        const { data, error } = await this.supabase
          .from('resultados_preguntados')
          .select('*')
          .order('preguntas_acertadas', { ascending: false })
          .order('tiempo_utilizado', { ascending: true })
          .limit(5); // 

        if (error) throw error;
        this.filasRanking.set(data || []);
      } 
      
      else if (juego === 'El Intruso') {
        const { data, error } = await this.supabase
          .from('resultados_intruso')
          .select('*')
          .order('gano', { ascending: false })
          .order('nivel_alcanzado', { ascending: false })
          .order('tiempo_utilizado', { ascending: true })
          .limit(5); 

        if (error) throw error;
        this.filasRanking.set(data || []);
      }
    } catch (error) {
      console.error(`Error al cargar el ranking de ${juego}:`, error);
    } finally {
      this.isLoading.set(false);
    }
  }
}