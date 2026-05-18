import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GithubUser } from '../models/github-user';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  private http = inject(HttpClient);
  private apiUrl = 'https://api.github.com/users';
  
  // ⚠️ REEMPLAZA CON TU TOKEN REAL
  private githubToken = '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'; 

  getUserProfile(username: string): Observable<GithubUser> {
    const headers = new HttpHeaders({
      'Authorization': `token ${this.githubToken}`
    });

    return this.http.get<GithubUser>(`${this.apiUrl}/${username}`, { headers });
  }
}