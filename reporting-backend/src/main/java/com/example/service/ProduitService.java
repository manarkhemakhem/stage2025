package com.example.service;

import com.example.model.Produit;
import com.example.repository.ProduitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.validation.Valid;
import java.util.List;

@Service
public class ProduitService {

    private final ProduitRepository produitRepository;

    @Autowired
    public ProduitService(ProduitRepository produitRepository) {
        this.produitRepository = produitRepository;
    }

    // Récupérer tous les produits
    public List<Produit> getAllProduits() {
        return produitRepository.findAll();
    }

    // Récupérer un produit par ID avec gestion d'erreur
    public Produit getProduitById(String id) {
        return produitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé avec ID: " + id));
    }

    // Ajouter un produit avec validation
    public Produit addProduit(@Valid Produit produit) {
        return produitRepository.save(produit);
    }

    // Mettre à jour un produit avec transaction pour assurer la cohérence
    @Transactional
    public Produit updateProduit(String id, @Valid Produit updatedProduit) {
        Produit existingProduit = produitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé avec ID: " + id));

        // Mise à jour des valeurs
        existingProduit.setNom(updatedProduit.getNom());
        existingProduit.setPrix(updatedProduit.getPrix());
        existingProduit.setDescription(updatedProduit.getDescription());
        existingProduit.setQuantiteStock(updatedProduit.getQuantiteStock());
        existingProduit.setCategorie(updatedProduit.getCategorie());
        existingProduit.setImageUrl(updatedProduit.getImageUrl());
        existingProduit.setDateExpiration(updatedProduit.getDateExpiration());

        return produitRepository.save(existingProduit);
    }

    // Supprimer un produit par ID
    public void deleteProduit(String id) {
        Produit produit = produitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé avec ID: " + id));
    
        produitRepository.delete(produit);
    }
    

    // Rechercher un produit par nom (insensible à la casse)
    public List<Produit> searchProduits(String nom) {
        return produitRepository.findByNomContainingIgnoreCase(nom);
    }
}
