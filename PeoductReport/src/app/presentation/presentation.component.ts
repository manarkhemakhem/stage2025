import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { Block, Presentation, Slide } from '../models/presentation.model';
import { PresentationService } from '../presentation.service';
import { ProduitService } from '../produit-service.service';
import { Produit } from '../models/produit.model.model';

@Component({
  selector: 'app-presentation',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './presentation.component.html',
  styleUrls: ['./presentation.component.css']
})
export class PresentationComponent implements OnInit {
  presentations: Presentation[] = [];
  produits: Produit[] = [];
  selectedPresentation: Presentation | null = null;
  selectedSlide: Slide | null = null;

  // Champs pour le formulaire d'ajout de bloc
  newBlockTitle: string = '';
  newBlockType: string = 'text';  // Valeur par défaut
  newBlockStartX: number = 50;
  newBlockStartY: number = 50;
  newBlockEndX: number = 200;
  newBlockEndY: number = 100;
  newBlockContent: string = '';
  newBlockImageUrl: string = '';
  newChartType: string = 'bar';
  selectedProducts: any[] = [];

  isAddingBlock: boolean = false;

  constructor(
    private presentationService: PresentationService,
    private produitService: ProduitService
  ) {}

  ngOnInit(): void {
    this.loadPresentations();
    this.loadProduits();
  }

  loadPresentations(): void {
    this.presentationService.getPresentations().subscribe((data) => {
      this.presentations = data;
    });
  }

  loadProduits(): void {
    this.produitService.getProduits().subscribe((data) => {
      this.produits = data;
    });
  }

  selectPresentation(presentation: Presentation): void {
    this.selectedPresentation = presentation;
    this.selectedSlide = presentation.slides.length > 0 ? presentation.slides[0] : null;
  }

  addSlide(): void {
    if (this.selectedPresentation) {
      const newSlide: Slide = {
        id: Date.now().toString(),
        title: `Nouvelle Diapositive ${this.selectedPresentation.slides.length + 1}`,  // Titre par défaut
        blocks: []  // Liste vide de blocs
      };

      this.selectedPresentation.slides.push(newSlide);
      this.selectedSlide = newSlide;
      this.savePresentation(this.selectedPresentation);
    }
  }

  addCustomBlock(): void {
    if (this.newBlockTitle && this.newBlockType && this.selectedSlide) {
      const newBlock: Block = {
        id: Date.now().toString(),
        title: this.newBlockTitle,
        type: this.newBlockType,
        content: this.newBlockType === 'text' ? this.newBlockContent : '',
        imageUrl: this.newBlockType === 'image' ? this.newBlockImageUrl : '',
        chartType: this.newBlockType === 'chart' ? this.newChartType : '',
        selectedProducts: this.newBlockType === 'chart' ? this.selectedProducts : [],
        startX: this.newBlockStartX,
        startY: this.newBlockStartY,
        endX: this.newBlockEndX,
        endY: this.newBlockEndY
      };

      this.selectedSlide.blocks.push(newBlock);
      this.resetBlockForm();  // Reset the form after adding the block
      console.log('Bloc ajouté :', newBlock);
    }
  }

  private resetBlockForm(): void {
    this.newBlockTitle = '';
    this.newBlockType = 'text';
    this.newBlockContent = '';
    this.newBlockImageUrl = '';
    this.newChartType = 'bar';
    this.selectedProducts = [];
    this.newBlockStartX = 50;
    this.newBlockStartY = 50;
    this.newBlockEndX = 200;
    this.newBlockEndY = 100;
  }

  private savePresentation(presentation: Presentation): void {
    this.presentationService.savePresentation(presentation).subscribe(
      (savedPresentation: Presentation) => console.log('Présentation mise à jour', savedPresentation),
      (error) => console.error('Erreur lors de la mise à jour', error)
    );
  }

  deleteBlock(block: Block): void {
    if (this.selectedSlide) {
      const index = this.selectedSlide.blocks.indexOf(block);
      if (index !== -1) {
        this.selectedSlide.blocks.splice(index, 1);  // Supprimer le bloc
        this.savePresentation(this.selectedPresentation!);  // Sauvegarder la diapositive mise à jour
        console.log('Bloc supprimé avec succès');
      }
    }
  }

  deletePresentation(presentation: Presentation): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette présentation ?')) {
      presentation.slides.forEach(slide => {
        slide.blocks.forEach(block => {
          console.log('Bloc supprimé :', block);
        });
      });

      this.presentations = this.presentations.filter(p => p.id !== presentation.id);

      this.presentationService.deletePresentation(presentation.id).subscribe(
        () => console.log('Présentation et ses diapositives supprimées avec succès'),
        (error) => console.error('Erreur lors de la suppression de la présentation', error)
      );
    }
  }

  deleteSlide(slide: Slide): void {
    if (this.selectedPresentation) {
      const index = this.selectedPresentation.slides.indexOf(slide);
      if (index !== -1) {
        this.selectedPresentation.slides.splice(index, 1);
        this.savePresentation(this.selectedPresentation);
        console.log('Diapositive supprimée avec succès');
      }
    }
  }

  updateSlide(slide: Slide, newTitle: string): void {
    slide.title = newTitle;
    this.savePresentation(this.selectedPresentation!);
  }

  updateBlock(block: Block, startX: number, startY: number, endX: number, endY: number): void {
    block.startX = startX;
    block.startY = startY;
    block.endX = endX;
    block.endY = endY;
    this.savePresentation(this.selectedPresentation!);
  }

  addPresentation(): void {
    const newPresentation: Presentation = {
      id: Date.now().toString(),
      title: `Nouvelle Présentation ${this.presentations.length + 1}`,
      slides: []
    };

    this.presentations.push(newPresentation);
    this.selectedPresentation = newPresentation;
    this.selectedSlide = null;

    this.savePresentation(newPresentation);
    console.log('Nouvelle présentation ajoutée');
  }

  drop(event: CdkDragDrop<Block[]>): void {
    const movedBlock = event.item.data as Block;

    movedBlock.startX = event.item.element.nativeElement.getBoundingClientRect().left;
    movedBlock.startY = event.item.element.nativeElement.getBoundingClientRect().top;

    const previousIndex = this.selectedSlide?.blocks.findIndex((block) => block === movedBlock);
    const currentIndex = event.currentIndex;

    if (previousIndex !== -1 && this.selectedSlide) {
      moveItemInArray(this.selectedSlide.blocks, previousIndex!, currentIndex);
    }

    this.savePresentation(this.selectedPresentation!);
  }
  onBlockTypeChange(): void {
    // Cette méthode peut être utilisée pour mettre à jour ou réinitialiser certains champs
    // en fonction du type de bloc sélectionné.
    console.log('Le type de bloc a changé :', this.newBlockType);
    if (this.newBlockType === 'text') {
      this.newBlockContent = '';  // Réinitialiser le contenu du texte
    } else if (this.newBlockType === 'image') {
      this.newBlockImageUrl = '';  // Réinitialiser l'URL de l'image
    } else if (this.newBlockType === 'chart') {
      this.selectedProducts = [];  // Réinitialiser les produits sélectionnés pour le graphique
    }
  }

}
