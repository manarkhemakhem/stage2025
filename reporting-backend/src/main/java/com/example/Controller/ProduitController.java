package com.example.Controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.model.Produit;
import com.example.service.ExportExcelService;
import com.example.service.ProduitService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200")  // Si tu utilises Angular sur ce port
@RestController
@RequestMapping("/api/produits")
public class ProduitController {

     @Autowired
    private ProduitService produitService;

    @Autowired
    private ExportExcelService exportExcelService;

    @GetMapping("/export-excel")
    public ResponseEntity<byte[]> exportProduitsToExcel() {
        try {
            List<Produit> produits = produitService.getAllProduits();
            byte[] excelData = exportExcelService.exportProduitsToExcel(produits);

            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Disposition", "attachment; filename=produits.xlsx");
            headers.add("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

            return new ResponseEntity<>(excelData, headers, HttpStatus.OK);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Créer un produit
    @PostMapping
    public ResponseEntity<Produit> createProduit(@RequestBody Produit produit) {
        produit.setId(null);  // Réinitialiser l'ID pour éviter une mise à jour d'un produit existant
        Produit createdProduit = produitService.addProduit(produit);
        return ResponseEntity.status(201).body(createdProduit); 
    }

    // Récupérer tous les produits
    @GetMapping
    public List<Produit> getAllProduits() {
        return produitService.getAllProduits();
    }

    // Récupérer un produit par ID
    @GetMapping("/{id}")
    public ResponseEntity<Produit> getProduitById(@PathVariable String id) {
        Optional<Produit> produit = Optional.ofNullable(produitService.getProduitById(id));
        return produit.map(ResponseEntity::ok)
                      .orElseGet(() -> ResponseEntity.status(404).body(null));  // Produit non trouvé, retourne 404
    }

    // Mettre à jour un produit par ID
    @PutMapping("/{id}")
    public ResponseEntity<Produit> updateProduit(@PathVariable String id, @RequestBody Produit produit) {
        produit.setId(id);
        Produit updatedProduit = produitService.updateProduit(id, produit);
        return updatedProduit != null ? ResponseEntity.ok(updatedProduit) : ResponseEntity.status(404).body(null);
    }

    // Supprimer un produit par ID
  @DeleteMapping("/{id}")
public ResponseEntity<Void> deleteProduit(@PathVariable String id) {
    produitService.deleteProduit(id);
    return ResponseEntity.noContent().build(); // Retourne 204 No Content si la suppression réussit
}

    // Rechercher un produit par nom
    @GetMapping("/search")
    public List<Produit> searchProduits(@RequestParam String nom) {
        return produitService.searchProduits(nom);
    }
}
