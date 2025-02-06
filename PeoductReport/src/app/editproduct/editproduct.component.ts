import { Component, OnInit } from '@angular/core';
import { Produit } from '../models/produit.model.model';
import { ProduitService } from '../produit-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';  // Ajout de Reactive Forms

@Component({
  selector: 'app-editproduct',
  templateUrl: './editproduct.component.html',
  styleUrls: ['./editproduct.component.css']
})
export class EditproductComponent implements OnInit {
  produitForm!: FormGroup;  // Formulaire réactif
  produit: Produit = { id: '', nom: '', prix: 0, description: '', quantiteStock: 0, categorie: '', imageUrl: '', dateExpiration: '' };
  errorMessage: string = '';  // Message d'erreur si le produit ne peut pas être récupéré

  constructor(
    private produitService: ProduitService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getProduit();
  }

  // Initialisation du formulaire réactif
  initForm(): void {
    this.produitForm = new FormGroup({
      nom: new FormControl(this.produit.nom, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
      prix: new FormControl(this.produit.prix, [Validators.required, Validators.min(0)]),
      description: new FormControl(this.produit.description, [Validators.required]),
      quantiteStock: new FormControl(this.produit.quantiteStock, [Validators.required, Validators.min(0)]),
      categorie: new FormControl(this.produit.categorie, [Validators.required]),
      imageUrl: new FormControl(this.produit.imageUrl, [Validators.required, Validators.pattern('https?://.+')]),
      dateExpiration: new FormControl(this.produit.dateExpiration, [Validators.required])
    });
  }

  // Récupération du produit par ID
  getProduit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.produitService.getProduitById(id).subscribe(
        (produit) => {
          this.produit = produit;
          this.produitForm.patchValue(produit);  // Mise à jour du formulaire avec les données du produit
        },
        (error) => {
          console.error('Erreur lors de la récupération du produit', error);
          this.errorMessage = 'Produit non trouvé ou erreur lors de la récupération.';
        }
      );
    }
  }

  // Mise à jour du produit
  updateProduit(): void {
    if (this.produitForm.valid) {
      this.produitService.updateProduit(this.produit.id, this.produitForm.value).subscribe(
        () => {
          this.router.navigate(['/produits']); // Redirige vers la liste après mise à jour
        },
        (error) => {
          console.error('Erreur lors de la mise à jour du produit', error);
          this.errorMessage = 'Une erreur s\'est produite lors de la mise à jour du produit.';
        }
      );
    }
  }

  // Annulation de l'édition et retour à la liste des produits
  cancel(): void {
    this.router.navigate(['/produits']);
  }
}
