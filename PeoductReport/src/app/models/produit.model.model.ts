export interface Produit {
  id: string;
  nom: string;
  prix: number;
  description: string;
  quantiteStock: number;
  categorie: string;   // Nouvelle propriété pour la catégorie
  imageUrl: string;
  dateExpiration: string;  // Date d'expiration au format ISO
}
