import { Component, inject, OnInit } from '@angular/core';
import { SupaAuthService } from '../../services/supabase/auth/supa-auth-service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private supabaseService = inject(SupaAuthService);
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
  // Estado de autenticación simulado (Acá te conectás a tu servicio de Auth)
  isLoggedIn: boolean = false; 
  username: string = '';

  constructor() {}

  async ngOnInit(){
      await this.checkAuthStatus();
    }

  private async checkAuthStatus(): Promise<void> {
    try {
      const session = await this.supabaseService.getSession();

      if (session?.user) {
        // 1. Tenemos sesión activa de Supabase Auth
        this.isLoggedIn = true;

        // 2. Buscamos los datos extendidos en nuestra tabla personalizada
        const UserData = await this.supabaseService.getDataUser(session.user.id);

        if (UserData) {
          // Si la tabla tiene los datos, formateamos el nombre completo exigido por el TP
          this.username = `${UserData.nombre} ${UserData.apellido}`;
        } 
        
        } else {
          // No hay sesión activa
          this.isLoggedIn = false;
          this.username = '';
        }
    } catch (error) {
      console.error('Error en el estado de autenticación del Home:', error);
      this.isLoggedIn = false;
      this.username = '';
    }
  }


  logout() {
    // Lógica para cerrar sesión
    this.isLoggedIn = false;
    this.username = '';
    // this.authService.signOut();
  }

  // async testSesion() {
  //   const { data, error } = await this.supabaseService.login("testing@gmail.com", "123456");
  //   if (error) {
  //     console.error('Error de inicio de sesion:', error.message);
  //     return;
  //   }
  //   const user = await this.supabaseService.getUser();
  //   console.log(user);
  // }
}
