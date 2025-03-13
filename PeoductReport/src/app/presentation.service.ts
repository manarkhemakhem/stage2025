import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Presentation } from './models/presentation.model';

@Injectable({
  providedIn: 'root'
})
export class PresentationService {

  private apiUrl = 'http://localhost:8080/api/presentations';

  constructor(private http: HttpClient) {}

  getPresentations(): Observable<Presentation[]> {
    return this.http.get<Presentation[]>(this.apiUrl);
  }

  createPresentation(presentation: Presentation): Observable<Presentation> {
    return this.http.post<Presentation>(this.apiUrl, presentation);
  }

  deletePresentation(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }


  // Ajouter ou mettre à jour une présentation
  savePresentation(presentation: Presentation): Observable<Presentation> {
    // Vérifiez si une présentation existe déjà pour décider si vous devez faire un POST ou un PUT
    if (presentation.id) {
      return this.http.put<Presentation>(`${this.apiUrl}/${presentation.id}`, presentation); // Si l'ID existe, utilisez PUT
    } else {
      return this.http.post<Presentation>(this.apiUrl, presentation); // Si l'ID n'existe pas, utilisez POST
    }
  }
}


