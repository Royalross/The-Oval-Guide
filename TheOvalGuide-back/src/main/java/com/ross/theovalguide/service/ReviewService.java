package com.ross.theovalguide.service;

import com.ross.theovalguide.model.CourseClass;
import com.ross.theovalguide.model.Professor;
import com.ross.theovalguide.model.Review;
import com.ross.theovalguide.repo.CourseClassRepository;
import com.ross.theovalguide.repo.ProfessorRepository;
import com.ross.theovalguide.repo.ReviewRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviews;
    private final ProfessorRepository professors;
    private final CourseClassRepository classes;

    /* CRUD + Aggregates */

    @Transactional
    public Review createOrUpdate(Review review) {
        Review saved = reviews.save(review);
        recalcAggregates(saved.getProfessor(), saved.getCourseClass());
        return saved;
    }

    private void recalcAggregates(Professor professor, CourseClass courseClass) {
        if (professor != null) {
            Double avg = reviews.avgRatingForProfessor(professor.getId());
            long cnt = reviews.countForProfessor(professor.getId());
            professor.setOverallRating(
                    avg == null ? null : BigDecimal.valueOf(avg).setScale(2, RoundingMode.HALF_UP)
            );
            professor.setTotalRatings((int) cnt);
            professors.save(professor);
        }

        if (courseClass != null) {
            Double avg = reviews.avgDifficultyForClass(courseClass.getId());
            long cnt = reviews.countForClass(courseClass.getId());
            courseClass.setDifficultyAvg(
                    avg == null ? null : BigDecimal.valueOf(avg).setScale(2, RoundingMode.HALF_UP)
            );
            courseClass.setTotalRatings((int) cnt);
            classes.save(courseClass);
        }
    }
}