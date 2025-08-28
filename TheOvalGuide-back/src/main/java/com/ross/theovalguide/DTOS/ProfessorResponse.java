package com.ross.theovalguide.DTOS;


import java.math.BigDecimal;
import java.util.List;

public record ProfessorResponse(
        String id,
        String name,
        String department,
        String university,
        BigDecimal overall,
        int totalRatings,
        List<LabelCountDto> buckets, // 5 -> 1
        List<TagDto> tags,
        String summary,
        List<ReviewItemDto> reviews
) {
}