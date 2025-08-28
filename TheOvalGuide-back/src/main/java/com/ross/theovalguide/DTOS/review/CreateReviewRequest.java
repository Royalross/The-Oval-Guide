package com.ross.theovalguide.DTOS.review;

import java.util.List;

public record CreateReviewRequest(
        Integer rating,
        Integer difficulty,        // optional
        String comment,            // optional
        List<String> tags,         // optional
        String professorSlug,      // required when reviewing a professor
        String classCode,          // "CS 2201" or "CS2201"

        // Only used when classCode does not exist
        Boolean createIfMissing,   // if true, auto-create class
        String classTitle,         // optional
        String department,         // optional
        String university          // optional
) {
}