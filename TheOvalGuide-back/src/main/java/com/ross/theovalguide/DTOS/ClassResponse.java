package com.ross.theovalguide.DTOS;

import java.math.BigDecimal;
import java.util.List;

public record ClassResponse(
        String id,
        String code,
        String title,
        String department,
        String university,
        BigDecimal difficulty,
        int totalRatings,
        List<LabelCountDto> gradeBuckets,       // not in schema -> empty
        List<LabelCountDto> difficultyBuckets,  // computed 5->1 from reviews
        List<ClassProfessorBriefDto> professors,
        List<TagDto> tags,
        String summary,
        List<AdviceDto> advices,
        List<String> notes,
        NotesPreviewDto notesPreview
) {
    public record AdviceDto(String id, String author, String date, String text, int upvotes) {
    }
}