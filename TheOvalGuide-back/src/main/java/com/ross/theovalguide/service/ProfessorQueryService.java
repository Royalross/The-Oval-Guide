package com.ross.theovalguide.service;

import com.ross.theovalguide.DTOS.LabelCountDto;
import com.ross.theovalguide.DTOS.ProfessorResponse;
import com.ross.theovalguide.DTOS.ReviewItemDto;
import com.ross.theovalguide.DTOS.TagDto;
import com.ross.theovalguide.model.Review;
import com.ross.theovalguide.repo.ProfessorRepository;
import com.ross.theovalguide.repo.ReviewRepository;
import com.ross.theovalguide.repo.ReviewTagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProfessorQueryService {

    private final ProfessorRepository professors;
    private final ReviewRepository reviews;
    private final ReviewTagRepository reviewTags;

    /**
     * ENTRYPOINT used by controller → must be transactional
     */
    @Transactional(readOnly = true)
    public ProfessorResponse getProfessorBySlug(String slug) {
        var p = professors.findBySlugIgnoreCase(slug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return getProfessor(p.getId());
    }

    /**
     * If you also expose /api/professors/{id}, keep this public & annotated too
     */
    @Transactional(readOnly = true)
    public ProfessorResponse getProfessor(UUID id) {
        return buildProfessorResponse(id);
    }

    /**
     * Helper that runs inside the active transaction started by the entrypoint.
     */
    private ProfessorResponse buildProfessorResponse(UUID id) {
        var p = professors.findById(id).orElseThrow();

        // Buckets 5..1
        Map<Integer, Long> bucketMap = new HashMap<>();
        reviews.ratingBucketsForProfessor(id).forEach(row -> {
            Integer rating = (Integer) row[0];
            Long cnt = (Long) row[1];
            bucketMap.put(rating, cnt);
        });
        List<LabelCountDto> buckets = new ArrayList<>();
        for (int i = 5; i >= 1; i--) {
            buckets.add(new LabelCountDto(String.valueOf(i), bucketMap.getOrDefault(i, 0L)));
        }

        // Top tags
        List<TagDto> tags = reviewTags.topTagsForProfessor(id).stream()
                .map(row -> new TagDto(row[0].toString(), (String) row[1]))
                .collect(Collectors.toList());

        // Latest reviews with courseClass fetch-joined (prevents LazyInitializationException)
        List<Review> reviewList = reviews.findByProfessorIdWithClass(id);

        List<ReviewItemDto> reviewDtos = reviewList.stream()
                .map(this::toReviewItem)
                .collect(Collectors.toList());

        return new ProfessorResponse(
                p.getId().toString(),
                p.getName(),
                p.getDepartment(),
                p.getUniversity(),
                p.getOverallRating(),
                p.getTotalRatings(),
                buckets,
                tags,
                null,   // summary (optional, later)
                reviewDtos
        );
    }

    private ReviewItemDto toReviewItem(Review r) {
        String courseCode = r.getCourseClass() == null ? null : r.getCourseClass().getCode();
        String author = r.getUser() != null ? r.getUser().getUsername() : "anonymous";
        var date = r.getCreatedAt();
        var tagLabels = reviewTags.labelsForReview(r.getId());

        return new ReviewItemDto(
                r.getId().toString(),
                author,
                courseCode,
                date,
                r.getRating(),
                r.getComment(),
                tagLabels
        );
    }
}