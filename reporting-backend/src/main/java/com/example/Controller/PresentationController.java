package com.example.Controller;

import com.example.model.Presentation;
import com.example.service.PresentationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/presentations")
@CrossOrigin(origins = "*")
public class PresentationController {

    private final PresentationService presentationService;

    public PresentationController(PresentationService presentationService) {
        this.presentationService = presentationService;
    }

    // Récupérer toutes les présentations
    @GetMapping
    public List<Presentation> getAllPresentations() {
        return presentationService.getAllPresentations();
    }

    // Récupérer une présentation par ID
    @GetMapping("/{id}")
    public Optional<Presentation> getPresentationById(@PathVariable String id) {
        return presentationService.getPresentationById(id);
    }

    // Ajouter ou mettre à jour une présentation
    @PostMapping
    public Presentation createPresentation(@RequestBody Presentation presentation) {
        return presentationService.savePresentation(presentation);
    }

    @PutMapping("/{id}")
    public Presentation updatePresentation(@PathVariable String id, @RequestBody Presentation presentation) {
        presentation.setId(id);
        return presentationService.savePresentation(presentation);
    }

    @DeleteMapping("/{id}")
    public void deletePresentation(@PathVariable String id) {
        presentationService.deletePresentation(id);
    }
}
