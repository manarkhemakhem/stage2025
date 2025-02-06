import { Component, OnInit } from '@angular/core';
import { Produit } from '../models/produit.model.model';
import { ProduitService } from '../produit-service.service';

@Component({
  selector: 'app-produits',
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.css']
})
export class ProduitsComponent implements OnInit {
  produits: Produit[] = [];
  selectedProduit: Produit | null = null;
  searchTerm: string = '';
  isAddingProduct: boolean = false;  // Variable pour afficher ou masquer le formulaire
  produit: Produit = { id: '', nom: '', prix: 0, description: '', quantiteStock: 0,  categorie: '', imageUrl: '', dateExpiration: '' };  // Initialisation des nouveaux champs

  constructor(private produitService: ProduitService) {}

  ngOnInit(): void {
    this.getProduits();
  }

  // Récupérer tous les produits
  getProduits(): void {
    this.produitService.getProduits().subscribe(
      (produits) => {
        this.produits = produits;
      },
      (error) => {
        console.error('Erreur lors de la récupération des produits', error);
      }
    );
  }

  // Afficher le formulaire d'ajout
  addProduit(): void {
    this.isAddingProduct = true;
    this.produit = { id: '', nom: '', prix: 0, description: '', quantiteStock: 0, categorie: '', imageUrl: '', dateExpiration: '' };
  }

  // Annuler l'ajout de produit
  cancel(): void {
    this.isAddingProduct = false;  // Masquer le formulaire
  }

  // Sauvegarder le produit (ajouter ou modifier)
  createProduit(): void {
    if (this.produit.id) {
      // Si un ID existe, on met à jour le produit
      this.produitService.updateProduit(this.produit.id, this.produit).subscribe(() => {
        this.getProduits();
        this.isAddingProduct = false;  // Fermer le formulaire et revenir à la liste
      });
    } else {
      // Si l'ID n'existe pas, c'est un ajout
      this.produitService.createProduit(this.produit).subscribe(() => {
        this.getProduits();
        this.isAddingProduct = false;  // Fermer le formulaire et revenir à la liste
      });
    }
  }

  // Supprimer un produit
  deleteProduit(id: string): void {
    this.produitService.deleteProduit(id).subscribe(() => {
      this.getProduits();  // Mise à jour de la liste après suppression
    });
  }

  // Recherche de produit
  search(): void {
    if (this.searchTerm) {
      // Convertir le terme de recherche en minuscule
      const lowerSearchTerm = this.searchTerm.toLowerCase();

      this.produitService.searchProduits(lowerSearchTerm).subscribe(
        (produits) => {
          this.produits = produits;
        },
        (error) => {
          console.error('Erreur de recherche', error);
        }
      );
    } else {
      this.getProduits(); // Recharge la liste des produits
    }
  }


  exportToExcel() {
    this.produitService.exportProduitsToExcel().subscribe(response => {
      const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'produits.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }, error => {
      console.error('Erreur lors de l\'exportation des produits :', error);
    });
  }
}
