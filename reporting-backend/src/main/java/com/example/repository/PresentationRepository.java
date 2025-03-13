package com.example.repository;

import com.example.model.Presentation;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PresentationRepository extends MongoRepository<Presentation, String> {
}
