import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produit } from './models/produit.model.model';

@Injectable({
  providedIn: 'root'
})
export class ProduitService {
  private apiUrl = 'http://localhost:8080/api/produits';  // URL de ton API backend Spring Boot

  constructor(private http: HttpClient) {}

  // Méthode pour récupérer tous les produits
  getProduits(): Observable<Produit[]> {
    return this.http.get<Produit[]>(this.apiUrl);
  }

  // Méthode pour récupérer un produit par son ID
  getProduitById(id: string): Observable<Produit> {
    return this.http.get<Produit>(`${this.apiUrl}/${id}`);
  }

  // Ajouter un produit
  // Méthode pour créer un produit
  createProduit(produit: Produit): Observable<Produit> {
    return this.http.post<Produit>(this.apiUrl, produit);
  }
 // Mettre à jour un produit
 updateProduit(id: string, produit: Produit): Observable<Produit> {
  return this.http.put<Produit>(`${this.apiUrl}/${id}`, produit);
}
  // Méthode pour supprimer un produit
  deleteProduit(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Méthode pour rechercher un produit par son nom
  searchProduits(nom: string): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.apiUrl}/search?nom=${nom}`);
  }


// Méthode pour télécharger le fichier Excel
exportProduitsToExcel(): Observable<Blob> {
  return this.http.get(`${this.apiUrl}/export-excel`, {
    responseType: 'blob', // Important pour récupérer un fichier binaire
    headers: new HttpHeaders({
      'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
  });
}


}


