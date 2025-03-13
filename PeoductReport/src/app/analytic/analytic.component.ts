import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import * as echarts from 'echarts';

import { ProduitService } from '../produit-service.service';
import { Produit } from '../models/produit.model.model';
import { NgxEchartsModule } from 'ngx-echarts';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-analytic',
  standalone: true,
  imports: [NgxEchartsModule, CommonModule, FormsModule],
  templateUrl: './analytic.component.html',
  styleUrls: ['./analytic.component.css'],
})
export class AnalyticComponent implements OnInit {
  @ViewChild('barChart', { static: true }) barChartElement!: ElementRef;
  @ViewChild('lineChart', { static: true }) lineChartElement!: ElementRef;
  @ViewChild('expirationChart', { static: true }) expirationChartElement!: ElementRef;
  produits: Produit[] = [];
  filteredProduits: Produit[] = [];
  categories: string[] = [];
  selectedCategory: string = '';
  totalProduits: number = 0;
  totalCategories: number = 0;

  constructor(private produitService: ProduitService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getProduits();
  }

  getProduits(): void {
    this.produitService.getProduits().subscribe(
      (produits) => {
        this.produits = produits;
        this.filteredProduits = [...this.produits];

        this.totalProduits = this.produits.length;
        this.categories = [...new Set(this.produits.map(prod => prod.categorie))];
        this.totalCategories = this.categories.length;

        this.loadCharts();
        this.cdr.detectChanges();
      },
      (error) => console.error('Erreur lors du chargement des produits', error)
    );
  }

  filterByCategory(): void {
    if (this.selectedCategory) {
      this.filteredProduits = this.produits.filter(prod => prod.categorie === this.selectedCategory);
    } else {
      this.filteredProduits = [...this.produits];
    }
    this.loadCharts();
  }

  loadCharts(): void {
    const productNames = this.filteredProduits.map(prod => prod.nom);
    const productQuantities = this.filteredProduits.map(prod => prod.quantiteStock);
    const productPrices = this.filteredProduits.map(prod => prod.prix);
    const productExpirationDates = this.filteredProduits.map(prod => prod.dateExpiration);

    // 1. Graphique en barres verticales empilées : Quantité des Produits
    const barChart = echarts.init(this.barChartElement.nativeElement);
    const barChartOptions = {
      title: { text: 'Quantité des Produits', left: 'center' },
      tooltip: { trigger: 'axis' },
      legend: {
        top: '10%',
        left: 'center',
        orient: 'horizontal',
        data: ['Quantité', 'Autre Catégorie'], // Si vous avez des catégories supplémentaires
      },
      xAxis: {
        type: 'category',
        data: productNames,
        name: 'Produits'
      },
      yAxis: {
        type: 'value',
        name: 'Quantité',
      },
      series: [
        {
          name: 'Quantité',
          type: 'bar',
          stack: 'stack1', // Stack empilé
          data: productQuantities,
          itemStyle: { color: '#4CAF50' },  // Couleur des barres
        },
      ]
    };
    barChart.setOption(barChartOptions);

    // 2. Graphique en Anneau (Donut) : Évolution des Prix des Produits
    const lineChart = echarts.init(this.lineChartElement.nativeElement);
    const lineChartOptions = {
      title: { text: 'Répartition des Prix des Produits', left: 'center' },
      tooltip: { trigger: 'item' },
      series: [
        {
          name: 'Prix des Produits',
          type: 'pie',
          radius: ['40%', '70%'],  // Pour obtenir un effet de donut
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: 'outside',
            formatter: '{b}: {d}%', // Affichage du nom et pourcentage
          },
          labelLine: {
            show: true,
          },
          data: productPrices.map(price => ({
            value: price,
            name: productNames[productPrices.indexOf(price)],
          })),
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 1,
          },
        }
      ]
    };
    lineChart.setOption(lineChartOptions);

    // 3. Graphique Horizontal empilé : Jours Restants Avant l'Expiration
    const expirationChart = echarts.init(this.expirationChartElement.nativeElement);
    const expirationChartOptions = {
      title: { text: 'Jours Restants Avant l\'Expiration', left: 'center' },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const expirationDate = new Date(productExpirationDates[params.dataIndex]);
          return `${params.name}<br/>Expiration le: ${expirationDate.toLocaleDateString()}<br/>Jours restants : ${params.value}`;
        }
      },
      xAxis: {
        type: 'value',
        name: 'Jours Restants',
        max: Math.max(...productExpirationDates.map(date => {
          const expirationDate = new Date(date);
          const today = new Date();
          return isNaN(expirationDate.getTime()) ? 0 : Math.round((expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        })),
      },
      yAxis: {
        type: 'category',
        data: productNames,
        name: 'Produits',
      },
      series: [
        {
          name: 'Expiration',
          type: 'bar',
          stack: 'stack1',  // Permet l'empilement des barres
          data: productExpirationDates.map(date => {
            const expirationDate = new Date(date);
            const today = new Date();
            return isNaN(expirationDate.getTime()) ? 0 : Math.round((expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          }),
          itemStyle: { color: '#FF6347' },
        }
      ]
    };

    expirationChart.setOption(expirationChartOptions);
  }
}
