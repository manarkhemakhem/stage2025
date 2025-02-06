import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProduitService } from '../produit-service.service';
import { Produit } from '../models/produit.model.model';

@Component({
  selector: 'app-createproduct',
  templateUrl: './createproduct.component.html',
  styleUrls: ['./createproduct.component.css']
})
export class CreateproductComponent {
  produitForm!: FormGroup;
  produit: Produit = {
    id: '',
    nom: '',
    prix: 0,
    description: '',
    quantiteStock: 0,
  
    categorie: '',
    imageUrl: '',
    dateExpiration: ''
  };

  constructor(
    private produitService: ProduitService,
    private router: Router,
    private fb: FormBuilder  // Injecter FormBuilder
  ) {
    this.createForm();  // Initialiser le formulaire
  }

  // Créer et initialiser le formulaire avec des validations
  createForm(): void {
    this.produitForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      prix: [0, [Validators.required, Validators.min(0.01)]],
      description: ['', Validators.required],
      quantiteStock: [0, [Validators.required, Validators.min(0)]],
      quantite: [1, [Validators.required, Validators.min(1)]],
      categorie: ['', Validators.required],
      imageUrl: ['', [Validators.required, Validators.pattern(/(https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp))/i)]],  // Validation URL d'image
      dateExpiration: ['', Validators.required]
    });
  }

  // Sauvegarder le produit
  createProduit() {
    if (this.produitForm.valid) {
      this.produitService.createProduit(this.produitForm.value).subscribe(() => {
        this.router.navigate(['/produits']); // Rediriger vers la liste après la création
      });
    } else {
      console.log('Le formulaire est invalide');

      // Affichage des erreurs de validation pour chaque champ
      Object.keys(this.produitForm.controls).forEach(controlName => {
        const control = this.produitForm.get(controlName);
        if (control && control.invalid) {
          console.log(`${controlName} est invalide`);
        }
      });
    }
  }

  // Annuler et rediriger vers la liste
  cancel() {
    this.router.navigate(['/produits']);
  }
}
