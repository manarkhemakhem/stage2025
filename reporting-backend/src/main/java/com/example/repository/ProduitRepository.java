package com.example.repository;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.example.model.Produit;

public interface ProduitRepository extends MongoRepository<Produit, String> {
    @Query("{ 'nom' : { $regex: ?0, $options: 'i' } }")
    List<Produit> findByNomContainingIgnoreCase(String nom);
}