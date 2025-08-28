package com.ross.theovalguide.DTOS;


import java.time.Instant;
import java.util.List;

public record ReviewItemDto(
        String id,
        String author,     // username
        String course,     // class code
        Instant date,      // createdAt
        Integer rating,
        String comment,
        List<String> tags  // tag labels (UPPERCASE)
) {
}