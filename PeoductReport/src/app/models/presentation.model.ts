export interface Block {
  id: string;
  title: string;
  type: string;
  content?: string;
  imageUrl?: string;  // Ajout de l'URL de l'image
  chartType?: string;  // Type du graphique pour les blocs "chart"
  selectedProducts?: any[];  // Produits sélectionnés pour les graphiques
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}


export interface Slide {
  id: string;
  title: string;
  blocks: Block[];
}

export interface Presentation {
  id: string;
  title: string;
  slides: Slide[];
}
