package com.ross.theovalguide.controllers;

import com.ross.theovalguide.DTOS.review.CreateReviewRequest;
import com.ross.theovalguide.model.CourseClass;
import com.ross.theovalguide.model.Review;
import com.ross.theovalguide.repo.CourseClassRepository;
import com.ross.theovalguide.repo.ProfessorRepository;
import com.ross.theovalguide.service.ReviewService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InOrder;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReviewControllerTest {

    @Mock
    private ReviewService reviewService;
    @Mock
    private ProfessorRepository professors;
    @Mock
    private CourseClassRepository classes;

    private ReviewController controller;

    @BeforeEach
    void setUp() {
        controller = new ReviewController(reviewService, professors, classes);
    }

    @Test
    void createWithExistingClassUsesExistingRecord() {
        CourseClass existing = new CourseClass();
        existing.setId(UUID.randomUUID());
        when(classes.findByCodeIgnoreCase("CS 1234")).thenReturn(Optional.of(existing));

        Review persisted = new Review();
        persisted.setId(UUID.randomUUID());
        when(reviewService.createOrUpdate(any(Review.class))).thenAnswer(invocation -> {
            Review submitted = invocation.getArgument(0);
            persisted.setCourseClass(submitted.getCourseClass());
            return persisted;
        });

        CreateReviewRequest request = new CreateReviewRequest(
                5,
                3,
                "Great class",
                List.of(),
                null,
                "CS 1234",
                null,
                null,
                null,
                null
        );

        ResponseEntity<?> response = controller.create(request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        ArgumentCaptor<Review> reviewCaptor = ArgumentCaptor.forClass(Review.class);
        verify(reviewService).createOrUpdate(reviewCaptor.capture());
        assertSame(existing, reviewCaptor.getValue().getCourseClass());
        verify(classes, never()).save(any(CourseClass.class));
    }

    @Test
    void createCreatesCourseClassWhenMissingAndRequested() {
        when(classes.findByCodeIgnoreCase("CS 2201")).thenReturn(Optional.empty());
        when(classes.findFirstByCodeLoose("CS 2201")).thenReturn(Optional.empty());

        CourseClass stored = new CourseClass();
        stored.setId(UUID.randomUUID());
        when(classes.save(any(CourseClass.class))).thenAnswer(invocation -> {
            CourseClass created = invocation.getArgument(0);
            assertThat(created.getCode()).isEqualTo("CS 2201");
            assertThat(created.getTitle()).isEqualTo("Intro to Programming");
            assertThat(created.getDepartment()).isEqualTo("Computer Science");
            assertThat(created.getUniversity()).isEqualTo("Vanderbilt");
            return stored;
        });

        Review persisted = new Review();
        persisted.setId(UUID.randomUUID());
        when(reviewService.createOrUpdate(any(Review.class))).thenAnswer(invocation -> {
            Review submitted = invocation.getArgument(0);
            persisted.setCourseClass(submitted.getCourseClass());
            return persisted;
        });

        CreateReviewRequest request = new CreateReviewRequest(
                4,
                2,
                "Challenging but fair",
                List.of(),
                null,
                "CS 2201",
                true,
                "Intro to Programming",
                "Computer Science",
                "Vanderbilt"
        );

        ResponseEntity<?> response = controller.create(request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        ArgumentCaptor<Review> reviewCaptor = ArgumentCaptor.forClass(Review.class);
        verify(reviewService).createOrUpdate(reviewCaptor.capture());
        assertSame(stored, reviewCaptor.getValue().getCourseClass());

        InOrder inOrder = inOrder(classes, reviewService);
        inOrder.verify(classes).save(any(CourseClass.class));
        inOrder.verify(reviewService).createOrUpdate(any(Review.class));
    }
}
