import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GithubUser } from '../models/github-user';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  private http = inject(HttpClient);
  private apiUrl = 'https://api.github.com/users';
  
  getUserProfile(username: string): Observable<GithubUser> {
    const headers = new HttpHeaders({
      'Authorization': `token ${environment.githubToken}`
    });

    return this.http.get<GithubUser>(`${this.apiUrl}/${username}`, { headers });
  }
}