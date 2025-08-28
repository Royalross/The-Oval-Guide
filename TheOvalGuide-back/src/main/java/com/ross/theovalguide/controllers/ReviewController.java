package com.ross.theovalguide.controllers;

import com.ross.theovalguide.DTOS.review.CreateReviewRequest;
import com.ross.theovalguide.model.Review;
import com.ross.theovalguide.repo.CourseClassRepository;
import com.ross.theovalguide.repo.ProfessorRepository;
import com.ross.theovalguide.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.net.URI;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final ProfessorRepository professors;
    private final CourseClassRepository classes;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody CreateReviewRequest req) {
        // some basic validation
        if (req.rating() == null || req.rating() < 1 || req.rating() > 5) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "rating must be an integer 1..5");
        }
        if (req.difficulty() != null && (req.difficulty() < 1 || req.difficulty() > 5)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "difficulty must be 1..5 when provided");
        }
        if ((req.professorSlug() == null || req.professorSlug().isBlank())
                && (req.classCode() == null || req.classCode().isBlank())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "professorSlug or classCode required");
        }

        //build entity
        var review = new Review();
        review.setRating(req.rating());
        review.setDifficulty(req.difficulty());
        review.setComment(req.comment());

        review.setUser(null);

        if (req.professorSlug() != null && !req.professorSlug().isBlank()) {
            var p = professors.findBySlugIgnoreCase(req.professorSlug())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "professor not found"));
            review.setProfessor(p);
        }
        if (req.classCode() != null && !req.classCode().isBlank()) {
            var c = classes.findByCodeIgnoreCase(req.classCode())
                    .or(() -> classes.findFirstByCodeLoose(req.classCode()))
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "class not found"));
            review.setCourseClass(c);
        }
        if (review.getProfessor() == null && review.getCourseClass() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "professorSlug or classCode required");
        }

        var saved = reviewService.createOrUpdate(review);

        return ResponseEntity
                .created(URI.create("/api/reviews/" + saved.getId()))
                .body(new IdResponse(saved.getId().toString()));
    }

    public record IdResponse(String id) {
    }
}