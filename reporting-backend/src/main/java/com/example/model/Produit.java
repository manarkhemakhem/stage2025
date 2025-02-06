package com.example.model;

import java.time.LocalDate;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

@Document(collection = "produits")
public class Produit {

    @Id
    private String id;

    @NotNull(message = "Le nom du produit ne peut pas être null.")
    @Size(min = 3, max = 100, message = "Le nom du produit doit être entre 3 et 100 caractères.")
    private String nom;

    @NotNull(message = "Le prix du produit ne peut pas être null.")
    @Positive(message = "Le prix doit être un nombre positif.")
    private double prix;

    @NotNull(message = "La description du produit ne peut pas être null.")
    private String description;

    @NotNull(message = "La quantité en stock est obligatoire.")
    @Min(value = 0, message = "La quantité en stock ne peut pas être négative.")
    private Integer quantiteStock;
    private String categorie;
    private String imageUrl;

    @NotNull(message = "La date d'expiration est obligatoire pour les produits cosmétiques.")
    @Future(message = "La date d'expiration doit être dans le futur.")
    private LocalDate dateExpiration;

    // Constructeurs
    public Produit() {
    }

    public Produit(String id, String nom, double prix, String description, Integer quantiteStock, String categorie, String imageUrl, LocalDate dateExpiration) {
        this.id = id;
        this.nom = nom;
        this.prix = prix;
        this.description = description;
        this.quantiteStock = quantiteStock;
        this.categorie = categorie;
        this.imageUrl = imageUrl;
        this.dateExpiration = dateExpiration;
    }

    // Getters et Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public double getPrix() {
        return prix;
    }

    public void setPrix(double prix) {
        this.prix = prix;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getQuantiteStock() {
        return quantiteStock;
    }

    public void setQuantiteStock(Integer quantiteStock) {
        this.quantiteStock = quantiteStock;
    }


    public String getCategorie() {
        return categorie;
    }

    public void setCategorie(String categorie) {
        this.categorie = categorie;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public LocalDate getDateExpiration() {
        return dateExpiration;
    }

    public void setDateExpiration(LocalDate dateExpiration) {
        this.dateExpiration = dateExpiration;
    }
}
