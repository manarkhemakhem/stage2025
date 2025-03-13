package com.example.service;

import com.example.model.Presentation;
import com.example.repository.PresentationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PresentationService {

    private final PresentationRepository presentationRepository;

    public PresentationService(PresentationRepository presentationRepository) {
        this.presentationRepository = presentationRepository;
    }

    public List<Presentation> getAllPresentations() {
        return presentationRepository.findAll();
    }

    public Optional<Presentation> getPresentationById(String id) {
        return presentationRepository.findById(id);
    }

    // Méthode pour sauver une présentation
    public Presentation savePresentation(Presentation presentation) {
        return presentationRepository.save(presentation);  // Sauvegarde dans la base de données
    }

    public void deletePresentation(String id) {
        presentationRepository.deleteById(id);
    }
}
