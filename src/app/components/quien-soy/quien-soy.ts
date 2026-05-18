import { Component, inject, OnInit, signal } from '@angular/core';
import { GithubService } from '../../services/github';
import { GithubUser } from '../../models/github-user';

@Component({
  selector: 'app-quien-soy',
  standalone: true, 
  imports: [],
  templateUrl: './quien-soy.html',
  styleUrl: './quien-soy.css',
})
export class QuienSoy implements OnInit {
  private githubService = inject(GithubService);
  
  // Usamos una Signal para almacenar el usuario de GitHub de forma reactiva
  public githubData = signal<GithubUser | null>(null);


  ngOnInit(): void {
    this.githubService.getUserProfile('leongabrielmartinez').subscribe({
      next: (data) => {
        this.githubData.set(data); // Guardamos los datos en la signal
      },
      error: (err) => {
        console.error('Error al traer los datos de GitHub:', err);
      }
    });
  }
}